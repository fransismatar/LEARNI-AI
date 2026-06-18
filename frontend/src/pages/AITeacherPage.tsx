import { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPaperPlane,
  FaVolumeUp,
  FaRobot,
  FaUser,
} from "react-icons/fa";
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
    <section className="mx-auto flex h-[calc(100vh-150px)] min-h-[680px] max-w-7xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white text-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:h-[calc(100vh-90px)]">
      <div className="border-b border-slate-200 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-500 px-4 py-5 text-white sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-blue-100">
              AI Speaking Practice
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Talk, type, listen, and improve your English
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
              Practice naturally with your AI teacher. Speak or type a sentence,
              then listen to the answer and continue the conversation.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-[280px]">
            <div className="rounded-2xl bg-white/15 p-3 text-center backdrop-blur">
              <p className="text-lg font-black">{messages.length}</p>
              <p className="text-[11px] font-bold text-blue-100">Messages</p>
            </div>

            <div className="rounded-2xl bg-white/15 p-3 text-center backdrop-blur">
              <p className="text-lg font-black">EN</p>
              <p className="text-[11px] font-bold text-blue-100">Language</p>
            </div>

            <div className="rounded-2xl bg-white/15 p-3 text-center backdrop-blur">
              <p className="text-lg font-black">{listening ? "On" : "Off"}</p>
              <p className="text-[11px] font-bold text-blue-100">Mic</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="hidden border-r border-slate-200 bg-slate-50/70 p-5 lg:block">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-blue-50 text-2xl text-blue-600">
              <FaRobot />
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-950">
              Speaking Coach
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Use this page for normal OpenAI speaking practice without live
              avatar credits.
            </p>
          </div>

          <div className="mt-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-slate-950">
              Practice ideas
            </p>

            <div className="mt-4 space-y-3">
              {[
                "Introduce yourself in English.",
                "Talk about your day.",
                "Practice ordering food.",
                "Prepare for a job interview.",
              ].map((idea) => (
                <button
                  key={idea}
                  onClick={() => setInput(idea)}
                  className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[28px] border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-black text-blue-700">Tip</p>
            <p className="mt-2 text-sm leading-6 text-blue-700">
              Try speaking one full sentence. The AI teacher can correct your
              grammar and continue the conversation.
            </p>
          </div>
        </aside>

        <div className="flex min-h-0 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-3 py-4 sm:px-5 sm:py-6">
            {messages.length === 0 && (
              <div className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                    <FaRobot />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-950">
                      Hello! I’m your AI English teacher.
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      Type or use the microphone to practice. Start with a simple
                      sentence like: “I want to practice travel English.”
                    </p>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={message._id || index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[92%] gap-3 sm:max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 shadow-sm"
                    }`}
                  >
                    {message.role === "user" ? <FaUser /> : <FaRobot />}
                  </div>

                  <div
                    className={`rounded-[26px] px-4 py-3 text-sm leading-7 shadow-sm sm:px-5 sm:py-4 sm:text-base ${
                      message.role === "user"
                        ? "rounded-tr-md bg-blue-600 text-white"
                        : "rounded-tl-md border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {message.role === "assistant" && (
                      <button
                        onClick={() => speakText(message.content)}
                        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-600 transition hover:bg-blue-100"
                      >
                        <FaVolumeUp />
                        Listen again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm">
                    <FaRobot />
                  </div>

                  <div className="rounded-[26px] rounded-tl-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <p className="animate-pulse text-sm font-bold text-slate-400">
                      AI teacher is thinking...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
            {listening && (
              <div className="mb-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-500">
                Listening... speak now
              </div>
            )}

            <div className="flex items-end gap-2 sm:gap-3">
              <button
                onClick={startListening}
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-base font-bold transition sm:h-14 sm:w-14 ${
                  listening
                    ? "bg-red-500 text-white shadow-lg shadow-red-200"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
              >
                <FaMicrophone />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  listening ? "Listening..." : "Type or speak your message..."
                }
                rows={1}
                className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white sm:min-h-14 sm:px-5 sm:py-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-40 sm:h-14 sm:w-14"
              >
                <FaPaperPlane />
              </button>
            </div>

            <p className="mt-3 text-center text-[11px] font-bold text-slate-400">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITeacherPage;