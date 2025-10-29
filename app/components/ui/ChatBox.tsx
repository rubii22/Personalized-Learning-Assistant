/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CompleteUserProfile } from "./OnboardingWizard";
import {
  saveChatHistory,
  getChatHistory,
  startSession,
  endSession,
  incrementMessageCount,
  ChatMessage,
} from "../../utils/storage";

interface ChatBoxProps {
  profile: CompleteUserProfile;
  onShowAnalytics?: () => void;
  onShowQuiz?: () => void;
}

export default function ChatBox({
  profile,
  onShowAnalytics,
  onShowQuiz,
}: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<"english" | "urdu">("english");
  const [showImageButton, setShowImageButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history and start session on mount
  useEffect(() => {
    const history = getChatHistory();

    if (history.length > 0) {
      setMessages(history);
    } else {
      // Initial welcome message
      const welcomeMsg: ChatMessage = {
        sender: "ai",
        text: `🎯 **Welcome ${
          profile.name
        }!** I'm MentorMind AI, your personal learning assistant for **${
          profile.topic
        }**. 

Based on your preferences:
• **Learning Style:** ${profile.formatPreferences.join(", ")}
• **Confidence Level:** ${profile.confidence}/5  
• **Session Length:** ${profile.sessionLength}
• **Examples:** ${profile.exampleTypes.join(", ")}

I'll tailor everything to your learning style! How can I help you with ${
          profile.topic
        } today?`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
      saveChatHistory([welcomeMsg]);
    }

    // Start learning session
    startSession(profile.topic, profile.confidence);

    // Cleanup on unmount
    return () => {
      endSession(profile.confidence);
    };
  }, [profile]);

  // Generate diagram for last topic
  const handleGenerateDiagram = async () => {
    if (messages.length === 0) return;

    const lastUserMessage = messages.filter((m) => m.sender === "user").pop();
    if (!lastUserMessage) return;

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: lastUserMessage.text,
          profile,
          language,
          requestImage: true,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        const imageMessage: ChatMessage = {
          sender: "ai",
          text: "🎨 Here's a visual diagram for your topic:",
          timestamp: new Date().toISOString(),
          imageUrl: data.imageUrl,
        };
        const newMessages = [...messages, imageMessage];
        setMessages(newMessages);
        saveChatHistory(newMessages);
      }
    } catch (error) {
      console.error("Diagram generation error:", error);
    }
    setLoading(false);
  };

  // Send user message and get AI response
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    incrementMessageCount();
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          profile,
          language,
          conversationId: Date.now().toString(),
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiMessage: ChatMessage = {
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toISOString(),
        imageUrl: data.imageUrl,
      };

      const newMessages = [...updatedMessages, aiMessage];
      setMessages(newMessages);
      saveChatHistory(newMessages);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMsg: ChatMessage = {
        sender: "ai",
        text: "Request failed. Please try again!",
        timestamp: new Date().toISOString(),
      };
      const errorMessages = [...updatedMessages, errorMsg];
      setMessages(errorMessages);
      saveChatHistory(errorMessages);
    }

    setLoading(false);
  };

  // Main chat UI - Professional Dark Theme
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <div>
              <h1 className="text-white font-semibold">MentorMind AI</h1>
              <p className="text-gray-400 text-sm">Learning: {profile.topic}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white text-sm">{profile.name}</p>
              <p className="text-gray-400 text-xs">
                Confidence: {profile.confidence}/5 • {profile.motivation}
              </p>
            </div>
            <div className="flex gap-2">
              {/* Language Toggle */}
              <button
                onClick={() =>
                  setLanguage(language === "english" ? "urdu" : "english")
                }
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
                title={`Switch to ${
                  language === "english" ? "Urdu" : "English"
                }`}
              >
                <span className="text-lg">🌐</span>
                <span className="font-semibold">
                  {language === "english" ? "EN" : "اردو"}
                </span>
              </button>

              {onShowQuiz && (
                <button
                  onClick={onShowQuiz}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Take Quiz
                </button>
              )}
              {onShowAnalytics && (
                <button
                  onClick={onShowAnalytics}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Analytics
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-900">
        <div className="max-w-[1400px] mx-auto py-6 px-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } mb-6`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-5 overflow-hidden ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-none shadow-lg"
                }`}
              >
                <div className="prose prose-invert max-w-none break-words overflow-hidden">
                  {msg.sender === "ai" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-2xl font-bold mb-3 mt-4 break-words"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-xl font-bold mb-2 mt-3 break-words"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-lg font-semibold mb-2 mt-2 break-words"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="mb-3 leading-relaxed break-words" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="list-disc list-inside mb-3 space-y-1"
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="list-decimal list-inside mb-3 space-y-1"
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="ml-4 break-words" {...props} />
                        ),
                        code: ({ node, inline, ...props }: any) =>
                          inline ? (
                            <code
                              className="bg-gray-700 px-2 py-1 rounded text-sm font-mono break-all"
                              {...props}
                            />
                          ) : (
                            <code
                              className="block bg-gray-700 p-3 rounded-lg my-2 overflow-x-auto font-mono text-sm break-words"
                              {...props}
                            />
                          ),
                        strong: ({ node, ...props }) => (
                          <strong
                            className="font-bold text-blue-300"
                            {...props}
                          />
                        ),
                        em: ({ node, ...props }) => (
                          <em className="italic text-purple-300" {...props} />
                        ),
                        hr: ({ node, ...props }) => (
                          <hr className="my-4 border-gray-600" {...props} />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="border-l-4 border-blue-500 pl-4 italic my-3"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    <div className="whitespace-pre-wrap break-words leading-relaxed overflow-hidden">
                      {msg.text}
                    </div>
                  )}
                </div>

                {/* Display image if available (for visual learners) */}
                {msg.imageUrl && msg.imageUrl.trim() !== "" && (
                  <div className="mt-4 bg-gray-700/30 p-3 rounded-lg overflow-hidden">
                    <img
                      src={msg.imageUrl}
                      alt="Educational diagram"
                      className="rounded-lg border-2 border-purple-500/50 w-full max-w-full mx-auto hover:scale-[1.02] transition-transform shadow-lg object-contain"
                      style={{ maxHeight: '500px' }}
                      loading="lazy"
                      onError={(e) => {
                        console.error("Image failed to load:", msg.imageUrl);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <p className="text-xs text-center text-purple-300 mt-3 font-semibold">
                      🖼️ Visual Learning Aid
                    </p>
                  </div>
                )}

                <div
                  className={`text-xs mt-2 ${
                    msg.sender === "user" ? "text-blue-200" : "text-gray-500"
                  }`}
                >
                  {msg.sender === "user" ? "You" : "MentorMind AI"}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start mb-6">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-none p-4 shadow-lg">
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <span className="text-sm ml-2">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Container */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="space-y-2">
            {/* Optional diagram generation button for visual learners */}
            {profile.formatPreferences.includes("images") &&
              messages.length > 0 && (
                <div className="flex justify-center">
                  {/* <button
                    onClick={handleGenerateDiagram}
                    disabled={loading}
                    className="bg-purple-600/20 border border-purple-500 hover:bg-purple-600/30 text-purple-300 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>🎨</span>
                    <span>Generate Diagram</span>
                  </button> */}
                </div>
              )}

            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder={`Ask me anything about ${profile.topic}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-2 text-center">
            MentorMind AI • Personalized Learning •{" "}
            {profile.formatPreferences.length} Formats • {profile.feedbackPref}{" "}
            Feedback
          </p>
        </div>
      </div>
    </div>
  );
}
