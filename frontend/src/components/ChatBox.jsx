/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, AlertTriangle, Bot, User as UserIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../utils/api";
import LoadingSpinner from "./LoadingSpinner";

const ChatBox = ({ analysis, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: `👋 Hello! I've analyzed your resume and I'm here to help. Based on your background in **${(
        analysis.job_roles || []
      ).join(", ")}**, what would you like to discuss?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simulated streaming effect for bot messages
  const streamBotMessage = (fullText) => {
    let index = 0;
    const streamId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: streamId,
        type: "bot",
        content: "",
        timestamp: new Date().toISOString(),
      },
    ]);

    const interval = setInterval(() => {
      index++;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamId
            ? { ...msg, content: fullText.slice(0, index) }
            : msg
        )
      );
      scrollToBottom();

      if (index >= fullText.length) clearInterval(interval);
    }, 20);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setError(null);

    try {
      const response = await api.sendChatMessage(userMessage.content);
      const replyText = response.reply || "I'm sorry, I couldn't process that.";
      streamBotMessage(replyText);
    } catch (err) {
      setError(err.message || "Failed to send message");
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content:
          "⚠️ I apologize, but I'm having trouble processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] sm:h-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900">
                AI Career Assistant
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600">
                Chat about your resume and career
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
            <p className="text-yellow-800">
              This chat is temporary and will be cleared when you leave or
              reload the page.
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-black">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-3 ${
                message.type === "user" ? "justify-end" : ""
              }`}
            >
              {message.type === "bot" && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
              )}

              <div
                className={`max-w-[80%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  message.type === "user"
                    ? "bg-linear-to-br from-primary-600 to-secondary-600 text-black"
                    : "bg-neutral-100 text-neutral-900"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({ node, ...props }) => (
                      <strong
                        className="font-semibold text-neutral-900"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-4 sm:pl-5 space-y-1" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-4 sm:pl-5 space-y-1" {...props} />
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        className="bg-neutral-200 px-1.5 py-0.5 rounded text-sm font-mono text-black"
                        {...props}
                      />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                <p
                  className={`text-[10px] sm:text-xs mt-1 ${
                    message.type === "user"
                      ? "text-primary-200"
                      : "text-neutral-500"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.type === "user" && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-neutral-200 rounded-full flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4 text-neutral-600" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-start space-x-3"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
                <div className="bg-neutral-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 sm:p-6 border-t border-neutral-200">
          <div className="flex items-end space-x-2 sm:space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your career, skills, or job opportunities..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-colors duration-200 text-black text-sm sm:text-base"
                rows="2"
                disabled={isTyping}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-2 sm:p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-black rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mb-3 sm:mb-4 cursor-pointer"
            >
              {isTyping ? (
                <LoadingSpinner size="small" />
              ) : (
                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "What are my strongest skills?",
              "What jobs should I apply for?",
              "How can I improve my resume?",
            ].map((text, i) => (
              <button
                key={i}
                onClick={() => setInputMessage(text)}
                className="px-3 py-1 text-xs sm:text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-colors duration-200"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatBox;
