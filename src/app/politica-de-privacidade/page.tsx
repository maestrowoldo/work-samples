import type { Metadata } from "next";
import Link from "next/link";
import { buildAbsoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Política de Privacidade - Wolkendo Dev",
  description:
    "Política de privacidade do blog Wolkendo Dev, incluindo uso de cookies, métricas e anúncios do Google AdSense.",
  alternates: {
    canonical: buildAbsoluteUrl("/politica-de-privacidade"),
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-6 text-stone-900 md:px-8 md:py-10">
      <article className="mx-auto max-w-3xl rounded-[1.5rem] border border-stone-200 bg-white px-5 py-7 shadow-[0_18px_55px_rgba(28,25,23,0.07)] sm:px-8 sm:py-10">
        <Link
          href="/articles/pt"
          className="text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-900"
        >
          Voltar ao blog
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-stone-950">
          Política de Privacidade
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-6 text-stone-700">
          <p>
            Esta política explica como o blog Wolkendo Dev pode coletar e usar
            informações básicas de navegação para manter o site funcionando,
            medir desempenho e exibir anúncios.
          </p>

          <h2 className="text-lg font-semibold text-stone-950">
            Cookies e tecnologias semelhantes
          </h2>
          <p>
            O site pode usar cookies e tecnologias semelhantes para melhorar a
            experiência de navegação, entender métricas de acesso e permitir a
            veiculação de anúncios por parceiros como o Google.
          </p>

          <h2 className="text-lg font-semibold text-stone-950">
            Google AdSense
          </h2>
          <p>
            O Google, como fornecedor terceirizado, pode usar cookies para
            exibir anúncios com base em visitas anteriores a este e a outros
            sites. Você pode gerenciar anúncios personalizados nas configurações
            de anúncios da sua conta Google.
          </p>

          <h2 className="text-lg font-semibold text-stone-950">
            Dados de contato
          </h2>
          <p>
            Quando você envia uma mensagem pelo formulário de contato do site,
            os dados informados são usados apenas para responder à sua
            solicitação.
          </p>

          <h2 className="text-lg font-semibold text-stone-950">
            Atualizações
          </h2>
          <p>
            Esta política pode ser atualizada para refletir mudanças no site,
            em serviços usados ou em requisitos legais.
          </p>
        </div>
      </article>
    </main>
  );
}
