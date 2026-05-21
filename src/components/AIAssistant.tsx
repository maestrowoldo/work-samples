"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle } from "lucide-react";
import { useLocaleContext } from "@/components/LocaleProvider";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AIAssistant() {
  const { dictionary, locale } = useLocaleContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      text: dictionary.assistant.greeting,
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

    const match = dictionary.assistant.responses.find(({ keywords }) =>
      keywords.some((k) => lower.includes(k))
    );

    if (!match) return dictionary.assistant.defaultResponse;

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
        <span className="font-semibold text-xs">{dictionary.assistant.buttonLabel}</span>
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
                  <h3 className="font-bold text-sm">{dictionary.assistant.headerTitle}</h3>
                  <p className="text-xs text-white/80">{dictionary.assistant.onlineLabel}</p>
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
                  <div className="text-xs text-zinc-400">{dictionary.assistant.typingLabel}</div>
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
                  placeholder={dictionary.assistant.inputPlaceholder}
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
                  {dictionary.assistant.suggestionQuestions.map((q) => (
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
                      globalThis.location.href = `/${locale}#contato`;
                    }
                  }}
                  className="inline-block text-xs font-bold text-emerald-400 hover:text-emerald-300 transition px-2 py-1 rounded-lg hover:bg-emerald-500/10 cursor-pointer"
                >
                    {dictionary.assistant.ctaLabel} →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
