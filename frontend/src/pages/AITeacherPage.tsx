import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPaperPlane, FaVolumeUp } from "react-icons/fa";
import api from "../services/api";

interface Message {
  _id?: string;
  role: "user" | "assistant";
  content: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const AITeacherPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/chat/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(res.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition works best on Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/chat/message",
        { message: currentInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMessage: Message = {
        role: "assistant",
        content: res.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);

      speakText(res.data.reply);
    } catch (error) {
      console.log(error);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-[85vh] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
      <div className="border-b border-white/10 bg-white/[0.03] px-6 py-5">
        <p className="text-sm font-semibold text-cyan-300">
          AI English Teacher
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Talk, type, listen, and learn
        </h1>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        {messages.length === 0 && (
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <p className="text-lg text-slate-200">
              👋 Hello! I’m your AI English teacher. Type or use the microphone
              to practice.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-3xl px-5 py-4 text-lg leading-8 ${
                message.role === "user"
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/10 bg-white/[0.04] text-slate-100"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>

              {message.role === "assistant" && (
                <button
                  onClick={() => speakText(message.content)}
                  className="mt-4 flex items-center gap-2 text-sm text-cyan-300"
                >
                  <FaVolumeUp />
                  Listen again
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4">
              <p className="animate-pulse text-slate-300">
                AI teacher is thinking...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-4">
          <button
            onClick={startListening}
            className={`rounded-2xl px-5 py-4 font-bold transition ${
              listening
                ? "bg-red-400 text-white"
                : "bg-white/10 text-cyan-300 hover:bg-white/20"
            }`}
          >
            <FaMicrophone />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              listening ? "Listening..." : "Type or speak your message..."
            }
            className="flex-1 rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-white outline-none focus:border-cyan-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AITeacherPage;