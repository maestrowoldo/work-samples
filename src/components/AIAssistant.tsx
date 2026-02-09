"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIResponse {
  keywords: string[];
  response: string | string[];
}

const aiResponses: AIResponse[] = [
  {
    keywords: ["oi", "olá", "ola"],
    response: [
      "Olá! 👋 Sou o assistente virtual do Wolkendo. Como posso ajudar?",
      "Oi! 😄 Posso te contar sobre projetos, experiência ou como entrar em contato.",
    ],
  },
  {
    keywords: ["quem é você", "quem você é"],
    response:
      "Sou o assistente virtual do Wolkendo Arias, Desenvolvedor Full Stack, bacharel em Ciência da Computação, com experiência em aplicações web, dados e automação.",
  },
  {
    keywords: ["o que você faz", "seu trabalho"],
    response:
      "O Wolkendo atua no desenvolvimento de aplicações web modernas, do código ao deploy, com foco em qualidade, automação e soluções escaláveis.",
  },
  {
    keywords: ["tecnologias", "stack", "ferramentas"],
    response:
      "Ele trabalha com React, Next.js, TypeScript, Node.js, PostgreSQL, Python, Power BI e ferramentas de automação.",
  },
  {
    keywords: ["projetos"],
    response:
      "Entre os projetos estão aplicações Full Stack, dashboards em Power BI e automações internas. Você pode ver os detalhes na seção de projetos 😉",
  },
  {
    keywords: ["experiência", "trabalho"],
    response:
      "Atualmente, Wolkendo atua como Desenvolvedor Full Stack na Prime Secure, com experiência prévia em TI, dados e automação.",
  },
  {
    keywords: ["contato", "falar", "email"],
    response:
      "Você pode entrar em contato pelo formulário do site, LinkedIn ou GitHub. É só clicar em ‘Vamos conversar’.",
  },
  {
    keywords: ["disponível", "contratar", "freelance"],
    response:
      "Sim! Wolkendo está disponível para novos projetos e oportunidades. Vamos conversar?",
  },
  {
    keywords: ["preço", "valor"],
    response:
      "Os valores variam conforme o escopo e a complexidade do projeto. O ideal é conversar para entender sua necessidade.",
  },
];

const defaultResponse =
  "Boa pergunta! 😊 Posso te contar sobre projetos, tecnologias, experiência ou como entrar em contato.";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      text:
        "Olá! 👋 Sou o assistente virtual do Wolkendo. Posso te ajudar com informações sobre projetos, experiência ou contato.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const getAIResponse = (message: string): string => {
    const lower = message.toLowerCase();

    const match = aiResponses.find(({ keywords }) =>
      keywords.some((k) => lower.includes(k))
    );

    if (!match) return defaultResponse;

    if (Array.isArray(match.response)) {
      return match.response[Math.floor(Math.random() * match.response.length)];
    }

    return match.response;
  };

  const sendMessage = (text: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: getAIResponse(text),
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 600);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const suggestionQuestions = [
    "Quais tecnologias você domina?",
    "Quais projetos você já fez?",
    "Você está disponível para trabalho?",
  ];

  return (
    <>
      {/* Botão flutuante */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <MessageCircle size={16} />
        </div>
        <span className="font-semibold text-xs">Vamos conversar</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-20 right-4 z-50 w-72 max-h-[380px] rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-700 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm">Assistente Wolkendo</h3>
                  <p className="text-xs text-white/80">Online</p>
                </div>
                <button onClick={() => setIsOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-1.5 text-xs rounded-xl ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white"
                          : "bg-zinc-800 text-zinc-100 border border-zinc-700"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="text-xs text-zinc-400">Digitando...</div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-zinc-700 p-2 flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-zinc-800 text-zinc-100 text-xs rounded-lg px-3 py-1.5 border border-zinc-700 focus:border-emerald-500 outline-none"
                />
                <button
                  disabled={isLoading}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-lg p-2"
                >
                  <Send size={14} />
                </button>
              </form>

              {/* Sugestões */}
              {messages.length === 1 && !isLoading && (
                <div className="p-2 border-t border-zinc-700 space-y-1">
                  {suggestionQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
                            {/* CTA Footer */}
              <div className="border-t border-zinc-700 px-3 py-2 bg-gradient-to-t from-zinc-900/80 to-zinc-800/40 text-center space-y-1.5">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Se já está na página principal, scroll direto
                    if (globalThis.location.pathname === "/") {
                      setTimeout(() => {
                        const element = document.getElementById("contato");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }, 100);
                    } else {
                      // Se está em outra página, redireciona para principal
                      globalThis.location.href = "/#contato";
                    }
                  }}
                  className="inline-block text-xs font-bold text-emerald-400 hover:text-emerald-300 transition px-2 py-1 rounded-lg hover:bg-emerald-500/10 cursor-pointer"
                >
                    Fale diretamente comigo →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
