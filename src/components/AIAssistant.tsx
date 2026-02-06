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

const aiResponses: Record<string, string> = {
  oi: "Olá!  Sou Wolkendo, Full Stack Developer. Como posso ajudar?",
  ola: "Olá! 👋 Sou Wolkendo, Full Stack Developer. Como posso ajudar?",
  "quem é você":
    "Sou Wolkendo Arias, Bacharel em Ciência da Computação. Especialista em desenvolvimento web, Power BI e automação. Tenho experiência com Next.js, React, TypeScript, Python, Power BI e muito mais!",
  "o que você faz":
    "Eu crio aplicações web modernas, dashboards em Power BI e automações com Power Platform. Combino código limpo com design intuitivo para resolver problemas reais.",
  tecnologias:
    "Trabalho com: Next.js, React, TypeScript, Node.js, PostgreSQL, Python, Power BI, Figma e mais. Vejo minha seção 'I WORK WITH' para a lista completa!",
  projetos:
    "Tenho experiência com SalesFlow (Dashboard Power BI), TaskHub (Full Stack App) e projetos de análise de dados. Veja meus projetos para mais detalhes!",
  experiência:
    "Trabalho atualmente como Desenvolvedor Full Stack na Prime Secure. Já tive experiência em TI, análise de dados e design gráfico. Confira minha trajetória completa!",
  contato:
    "Você pode entrar em contato comigo através do formulário no site, LinkedIn ou GitHub. Para uma conversa mais profunda, clique em 'Vamos conversar' no final!",
  preço:
    "O valor dos meus serviços varia conforme escopo e complexidade do projeto. Gostaria de discutir os detalhes do seu projeto?",
  disponível: "Sim! Estou disponível para novos projetos. Gostaria de começar algo junto?",
  contrate:
    "Ótimo! Para maiores informações sobre como trabalho e valores, entre em contato comigo através do formulário ou clique em 'Vamos conversar'.",
  default:
    "Entendi sua pergunta! Para detalhes específicos sobre serviços, projetos ou parcerias, seria ótimo conversar diretamente. Clique em 'Vamos conversar' para mais informações! ",
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá!  Sou uma IA assistente de Wolkendo. Posso responder perguntas básicas e depois você pode entrar em contato para conversas mais profundas. Como posso ajudar?",
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
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    for (const [key, response] of Object.entries(aiResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    return aiResponses.default;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(input),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 500);
  };

  const suggestionQuestions = [
    "Quem é você?",
    "O que você faz?",
    "Quais tecnologias?",
  ];

  const handleSuggestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(question),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Botão Flutuante com Texto */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <MessageCircle size={20} />
        </div>
        <span className="font-semibold text-sm">Vamos conversar</span>
      </motion.button>

      {/* Modal do Chat */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-700 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header Premium */}
              <div className="relative p-5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-600 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Avatar Profissional */}
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                        WA
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-base leading-tight">Assistente Wolkendo</h3>
                      <p className="text-xs text-white/80 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                        Online - Respondo na hora
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                        W
                      </div>
                    )}
                    <div
                      className={`max-w-[65%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                        message.sender === "user"
                          ? "bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/50"
                          : "bg-zinc-800 text-zinc-100 border border-zinc-700"
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      W
                    </div>
                    <div className="bg-zinc-800 text-zinc-100 rounded-2xl px-3.5 py-2 border border-zinc-700">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-zinc-700 p-3 flex gap-2 bg-gradient-to-t from-zinc-900 to-transparent"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-zinc-800 text-zinc-50 rounded-xl px-4 py-2 text-xs outline-none border border-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition placeholder-zinc-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 disabled:from-zinc-700 disabled:to-zinc-700 text-white rounded-xl p-2 transition shadow-lg hover:shadow-emerald-500/50"
                >
                  <Send size={16} />
                </button>
              </form>

              {/* Sugestões */}
              {messages.length === 1 && !isLoading && (
                <div className="px-3 py-1 space-y-2 border-t border-zinc-700 bg-zinc-900/50">
                  <p className="text-xs text-zinc-400 font-semibold mb-2">💬 Perguntas populares:</p>
                  <div className="grid gap-1.5">
                    {suggestionQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSuggestion(q)}
                        className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 text-zinc-300 hover:bg-emerald-500/20 hover:border-emerald-500/60 hover:text-emerald-300 transition font-medium"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Footer */}
              <div className="border-t border-zinc-700 px-4 py-3 bg-gradient-to-t from-zinc-900/80 to-zinc-800/40 text-center space-y-2">
                <p className="text-xs text-zinc-400 font-medium">
                  💡 Quer conversar sobre um projeto específico?
                </p>
                <a
                  href="#contato"
                  onClick={() => setIsOpen(false)}
                  className="inline-block text-xs font-bold text-emerald-400 hover:text-emerald-300 transition px-3 py-1.5 rounded-lg hover:bg-emerald-500/10"
                >
                    Fale diretamente comigo →
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
