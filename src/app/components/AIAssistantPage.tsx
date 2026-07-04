import { sendAIMessage, getAIHistory, clearAIHistory } from "../../lib/aiApi";
import { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Send,
  FileText,
  Download,
  Zap,
  Target,
  Mic,
  Bot,
  RefreshCw,
} from "lucide-react";
import { cn } from "../utils";
import Btn from "./Btn";
import Avatar from "./Avatar";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string; time: string }[]
  >([
    {
      role: "ai",
      text: "Hello! I'm your AI Career Assistant powered by GradAlumni. I can help you with resume reviews, career guidance, interview preparation, skill recommendations, and placement strategy. What would you like help with today?",
      time: "now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getAIHistory();

        if (history.length > 0) {
          setMessages(
            history.map((m: any) => ({
              role: m.role === "assistant" ? "ai" : "user",
              text: m.message,
              time: new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            })),
          );
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadHistory();
  }, []);
  const quickActions = [
    {
      label: "Review My Resume",
      icon: <FileText size={14} />,
      prompt:
        "Please review my resume. I'm a 3rd year CSE student with 8.5 CGPA, experience in React and Python, and I'm targeting SDE intern roles at FAANG companies.",
    },
    {
      label: "Interview Prep",
      icon: <Target size={14} />,
      prompt:
        "Help me prepare for a Software Engineer internship interview at Google. What topics should I focus on?",
    },
    {
      label: "Career Roadmap",
      icon: <TrendingUp size={14} />,
      prompt:
        "Create a 6-month career roadmap for a 3rd year CSE student aiming for SDE roles at top product companies.",
    },
    {
      label: "Skill Gaps",
      icon: <Zap size={14} />,
      prompt:
        "Based on current industry trends, what skills should I develop as a CSE student interested in backend development?",
    },
  ];

  

  const send = async (text: string) => {
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((m) => [...m, { role: "user", text, time }]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendAIMessage(text);

      const aiTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: res.answer,
          time: aiTime,
        },
      ]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: err.message || "Sorry, something went wrong.",
          time,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div
      className="flex-1 flex flex-col bg-slate-50 overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h2
              className="font-bold text-gray-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              AI Career Assistant
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-emerald-600 font-medium">
                Online · Powered by GradAlumni AI
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm" icon={<Download size={14} />}>
            Export
          </Btn>
          <Btn
            variant="outline"
            size="sm"
            icon={<RefreshCw size={14} />}
            onClick={async () => {
              try {
                await clearAIHistory();
                setMessages([
                  {
                    role: "ai",
                    text: "Chat cleared. How can I help you with your career today?",
                    time: "now",
                  },
                ]);
              } catch (err: any) {
                alert(err.message || "Failed to clear chat");
              }
            }}
          >
            Clear
          </Btn>
        </div>
      </div>

      {/* Quick modes */}
      <div
        className="bg-white border-b border-gray-100 px-6 py-3 flex gap-2 overflow-x-auto flex-shrink-0"
        style={{ scrollbarWidth: "none" }}
      >
        {quickActions.map((q) => (
          <button
            key={q.label}
            onClick={() => {
              send(q.prompt);
              setActiveMode(q.label);
            }}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border whitespace-nowrap transition-all cursor-pointer",
              activeMode === q.label
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 bg-white",
            )}
          >
            {q.icon}
            {q.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3",
              m.role === "user" ? "flex-row-reverse" : "flex-row",
            )}
          >
            {m.role === "ai" ? (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={16} className="text-white" />
              </div>
            ) : (
              <Avatar name="Aryan Kapoor" size="sm" />
            )}
            <div
              className={cn(
                "max-w-[70%]",
                m.role === "user" ? "items-end" : "items-start",
              )}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "ai"
                    ? "bg-white border border-gray-200 text-gray-800 shadow-sm rounded-tl-none"
                    : "bg-blue-600 text-white rounded-tr-none",
                )}
              >
                <pre className="whitespace-pre-wrap font-sans">{m.text}</pre>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 px-1">
                {m.time}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <div className="flex-1 flex items-center border border-gray-200 rounded-xl bg-slate-50 px-4 py-3 gap-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <Mic size={16} className="text-gray-400 flex-shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about careers, resumes, interviews, skills..."
              className="flex-1 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
          <Btn
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            icon={<Send size={16} />}
          >
            Send
          </Btn>
        </div>
        <p className="text-center text-[11px] text-gray-400 mt-2">
          AI responses are for guidance only. Always verify with human mentors.
        </p>
      </div>
    </div>
  );
}
