import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

const suggestions = [
  "Comment publier une recherche ?",
  "Trouver un chercheur en biologie",
  "Qu'est-ce que Lab Horizon ?",
];

export default function ChatbotFAB() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Bonjour ! Je suis l'assistant Lab Horizon. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: messages.length + 1, from: "user", text };
    const botMsg = {
      id: messages.length + 2,
      from: "bot",
      text: "Merci pour votre message. Je vais transmettre votre demande à notre équipe. En attendant, explorez nos publications et chercheurs disponibles !",
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* Chatbot Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-28 right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-[#EAEAEA] overflow-hidden flex flex-col"
            style={{ maxHeight: "460px" }}
          >
            {/* Header */}
            <div className="bg-[#02223F] px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#5B8EB8]/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm" style={{ fontWeight: 600 }}>
                  Assistant Lab Horizon
                </p>
                <p className="text-white/60 text-xs">Toujours disponible</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F8F8]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-[#02223F] text-white rounded-tr-sm"
                        : "bg-white text-[#2B2B2B] shadow-sm rounded-tl-sm border border-[#EAEAEA]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {/* Suggestions */}
              {messages.length <= 1 && (
                <div className="space-y-2 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="w-full text-left text-xs px-3 py-2 bg-white border border-[#D9D0E3] rounded-full text-[#535353] hover:border-[#5B8EB8] hover:text-[#02223F] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-2 bg-white border-t border-[#EAEAEA] flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Posez votre question…"
                className="flex-1 text-sm bg-[#F5F5F5] border border-[#D9D0E3] rounded-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5B8EB8] text-[#2B2B2B] placeholder:text-[#9586a8]"
              />
              <button
                onClick={() => sendMessage(input)}
                className="w-8 h-8 bg-[#02223F] rounded-full flex items-center justify-center hover:bg-[#5B8EB8] transition-colors flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-[calc(5rem+3vh)] md:bottom-[calc(5rem+10vh)] right-4 z-50 w-14 h-14 bg-[#02223F] rounded-full shadow-xl flex items-center justify-center"
        style={{ boxShadow: "0 4px 20px rgba(2,34,63,0.4)" }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}