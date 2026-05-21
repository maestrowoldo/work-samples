import { BlogGeneratorError } from "./errors";

export type AiProvider = "gemini" | "groq" | "openrouter";

interface AiConfiguration {
  apiKey: string;
  baseUrl?: string;
  model: string;
  provider: AiProvider;
}

interface AiTextGenerationInput {
  prompt: string;
  systemPrompt: string;
}

type AiEnvironment = Partial<Record<string, string | undefined>>;
type ProviderErrorPayload = {
  error?: {
    code?: number;
    details?: Array<{
      "@type"?: string;
      quotaId?: string;
      quotaMetric?: string;
      retryDelay?: string;
      violations?: Array<{
        quotaDimensions?: Record<string, string>;
        quotaId?: string;
        quotaMetric?: string;
      }>;
    }>;
    message?: string;
    status?: string;
  };
};

const defaultBaseUrls: Record<AiProvider, string> = {
  gemini: "https://generativelanguage.googleapis.com/v1beta",
  groq: "https://api.groq.com/openai/v1",
  openrouter: "https://openrouter.ai/api/v1",
};

const defaultModels: Record<AiProvider, string> = {
  gemini: "gemini-2.0-flash",
  groq: "llama-3.3-70b-versatile",
  openrouter: "google/gemini-2.0-flash-001",
};

function buildAiErrorMessage(
  provider: AiProvider,
  status: number,
  statusText: string,
  responseText: string,
) {
  let parsedPayload: ProviderErrorPayload | null = null;

  try {
    parsedPayload = JSON.parse(responseText) as ProviderErrorPayload;
  } catch {
    parsedPayload = null;
  }

  const providerMessage = parsedPayload?.error?.message?.trim();
  const details = parsedPayload?.error?.details ?? [];
  const retryDelay = details.find((detail) => detail.retryDelay)?.retryDelay;
  const quotaViolations = details.flatMap((detail) => detail.violations ?? []);
  const hasDailyQuotaViolation = quotaViolations.some((violation) =>
    violation.quotaId?.includes("PerDay"),
  );
  const hasMinuteQuotaViolation = quotaViolations.some((violation) =>
    violation.quotaId?.includes("PerMinute"),
  );
  const model =
    quotaViolations.find((violation) => violation.quotaDimensions?.model)?.quotaDimensions?.model;

  if (provider === "gemini" && status === 429) {
    const retryMessage = retryDelay ? ` Retry indicado pelo provider: ${retryDelay}.` : "";

    if (hasDailyQuotaViolation) {
      return `Falha na IA (${provider}): cota diária esgotada para o modelo ${
        model ?? "configurado"
      }. A chave/projeto atual não tem quota disponível no free tier.${retryMessage} Troque a chave/projeto do Gemini ou mude AI_PROVIDER para groq/openrouter.`;
    }

    if (hasMinuteQuotaViolation) {
      return `Falha na IA (${provider}): limite temporário por minuto/tokens excedido para o modelo ${
        model ?? "configurado"
      }.${retryMessage} Aguarde e tente novamente, ou use outro provider.`;
    }
  }

  return `Falha na IA (${provider}): ${status} ${statusText}. ${providerMessage ?? responseText}`;
}

export function resolveAiConfiguration(
  environment: AiEnvironment = process.env,
): AiConfiguration {
  const provider = environment.AI_PROVIDER?.trim().toLowerCase() as AiProvider | undefined;

  if (!provider || !["gemini", "groq", "openrouter"].includes(provider)) {
    throw new BlogGeneratorError(
      "AI_PROVIDER inválido ou ausente. Use um destes valores: gemini, groq ou openrouter.",
    );
  }

  const apiKey = environment.AI_API_KEY?.trim();

  if (!apiKey) {
    throw new BlogGeneratorError(
      "AI_API_KEY não está configurada. Defina a chave antes de gerar um post.",
    );
  }

  return {
    apiKey,
    baseUrl: environment.AI_BASE_URL?.trim() || defaultBaseUrls[provider],
    model: environment.AI_MODEL?.trim() || defaultModels[provider],
    provider,
  };
}

function extractTextFromOpenAiCompatibleResponse(payload: unknown) {
  const typedPayload = payload as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  return typedPayload.choices?.[0]?.message?.content?.trim();
}

function extractTextFromGeminiResponse(payload: unknown) {
  const typedPayload = payload as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  return typedPayload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();
}

async function generateWithOpenAiCompatibleProvider(
  configuration: AiConfiguration,
  input: AiTextGenerationInput,
  fetchImpl: typeof fetch,
) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${configuration.apiKey}`,
    "Content-Type": "application/json",
  };

  if (configuration.provider === "openrouter") {
    headers["HTTP-Referer"] = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    headers["X-Title"] = "Wolkendo Blog Generator";
  }

  const response = await fetchImpl(`${configuration.baseUrl}/chat/completions`, {
    body: JSON.stringify({
      max_tokens: 1800,
      messages: [
        {
          content: input.systemPrompt,
          role: "system",
        },
        {
          content: input.prompt,
          role: "user",
        },
      ],
      model: configuration.model,
      temperature: 0.6,
    }),
    headers,
    method: "POST",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new BlogGeneratorError(
      buildAiErrorMessage(
        configuration.provider,
        response.status,
        response.statusText,
        body,
      ),
    );
  }

  const payload = await response.json();
  const content = extractTextFromOpenAiCompatibleResponse(payload);

  if (!content) {
    throw new BlogGeneratorError(
      `A resposta da IA (${configuration.provider}) veio sem conteúdo útil.`,
    );
  }

  return content;
}

async function generateWithGemini(
  configuration: AiConfiguration,
  input: AiTextGenerationInput,
  fetchImpl: typeof fetch,
) {
  const response = await fetchImpl(
    `${configuration.baseUrl}/models/${configuration.model}:generateContent?key=${configuration.apiKey}`,
    {
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: input.prompt,
              },
            ],
            role: "user",
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
        systemInstruction: {
          parts: [
            {
              text: input.systemPrompt,
            },
          ],
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new BlogGeneratorError(
      buildAiErrorMessage(
        configuration.provider,
        response.status,
        response.statusText,
        body,
      ),
    );
  }

  const payload = await response.json();
  const content = extractTextFromGeminiResponse(payload);

  if (!content) {
    throw new BlogGeneratorError(
      `A resposta da IA (${configuration.provider}) veio sem conteúdo útil.`,
    );
  }

  return content;
}

export async function generateTextWithAi(
  input: AiTextGenerationInput,
  options: {
    environment?: AiEnvironment;
    fetchImpl?: typeof fetch;
  } = {},
) {
  const configuration = resolveAiConfiguration(options.environment);
  const fetchImpl = options.fetchImpl ?? fetch;

  if (configuration.provider === "gemini") {
    return generateWithGemini(configuration, input, fetchImpl);
  }

  return generateWithOpenAiCompatibleProvider(configuration, input, fetchImpl);
}
