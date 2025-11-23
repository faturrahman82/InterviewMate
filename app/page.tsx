"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, Briefcase, FileText, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function InterviewMate() {
  const [step, setStep] = useState<"form" | "chat">("form");
  const [role, setRole] = useState("");
  const [cv, setCv] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startInterview = async () => {
    if (!role.trim() || !cv.trim()) {
      alert("Please fill in both Job Role and CV Summary");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/interview", {
        role,
        cv,
        history: [],
        userMessage: "",
      });

      setMessages([{ role: "ai", content: response.data.response }]);
      setStep("chat");
    } catch (error) {
      console.error("Error starting interview:", error);
      alert(
        "Failed to start interview. Please check your API key and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: Message = { role: "user", content: userInput };
    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/interview", {
        role,
        cv,
        history: [...messages, newUserMessage],
        userMessage: userInput,
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: response.data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Sorry, there was an error processing your response. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (step === "form") {
        startInterview();
      } else {
        sendMessage();
      }
    }
  };

  if (step === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              InterviewMate
            </h1>
            <p className="text-gray-600 text-lg">
              AI-Powered Job Interview Simulator
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Desired Job Role
                </div>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Frontend Developer, Data Scientist, Product Manager"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  CV Summary
                </div>
              </label>
              <textarea
                value={cv}
                onChange={(e) => setCv(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Briefly describe your experience, skills, and qualifications..."
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none text-gray-900 placeholder-gray-400"
              />
            </div>

            <button
              onClick={startInterview}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Starting Interview...
                </span>
              ) : (
                "Start Interview"
              )}
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 Tip:</span> Be specific about
              your role and experience. The AI will tailor questions based on
              your input.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  InterviewMate - Miku
                </h2>
                <p className="text-sm text-gray-600">
                  Interviewing for: {role}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setStep("form");
                setMessages([]);
                setRole("");
                setCv("");
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              New Interview
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}>
              {message.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "bg-white text-gray-900 shadow-md border border-gray-100"
                }`}>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik jawaban kamu..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !userInput.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3 rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
