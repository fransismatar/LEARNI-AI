import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaMicrophone,
  FaPaperPlane,
  FaVolumeUp,
  FaUser,
  FaCircle,
} from "react-icons/fa";
import api from "../services/api";
import { teachers } from "../data/teachers";

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
  const [searchParams] = useSearchParams();

  const teacherKey = (
    searchParams.get("teacher") ||
    localStorage.getItem("selectedTeacherId") ||
    "zayed"
  ).toLowerCase();

  const teacher =
    teachers.find(
      (item) =>
        item.id?.toLowerCase() === teacherKey ||
        item.name.toLowerCase() === teacherKey
    ) ||
    teachers.find((item) => item.id === "zayed") ||
    teachers[0];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

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
    <section className="mx-auto grid min-h-[calc(100vh-130px)] max-w-7xl overflow-hidden rounded-[34px] border border-slate-200 bg-white text-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 p-5 text-white sm:p-7">
        <div className="relative z-10">
          <p className="text-sm font-black text-blue-100">
            AI Live Teacher · No HeyGen Credits
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Talk with {teacher.name}
          </h1>

          <p className="mt-3 max-w-md text-sm leading-7 text-blue-100">
            Practice naturally with your selected teacher. Speak, type, listen,
            and improve without live avatar cost.
          </p>
        </div>

        <div className="relative z-10 mt-8 rounded-[34px] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
          <div
            className={`relative mx-auto h-[360px] max-w-[320px] overflow-hidden rounded-[32px] bg-blue-950 transition duration-500 ${
              isSpeaking ? "scale-[1.02] shadow-[0_0_60px_rgba(96,165,250,0.7)]" : ""
            }`}
          >
            <img
              src={teacher.image}
              alt={teacher.name}
              className={`h-full w-full object-cover object-top transition duration-500 ${
                isSpeaking ? "scale-105 brightness-110" : ""
              }`}
            />

            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-xs font-black backdrop-blur">
              <FaCircle className={isSpeaking ? "text-green-400" : "text-blue-300"} />
              {isSpeaking ? "Speaking now" : "Ready"}
            </div>

            <div className="absolute bottom-4 left-4 right-4 rounded-3xl bg-black/35 p-4 backdrop-blur">
              <p className="text-lg font-black">{teacher.name}</p>
              <p className="mt-1 text-xs font-bold text-white/70">
                {teacher.role} · {teacher.accent}
              </p>

              <div className="mt-4 flex h-8 items-center gap-1">
                {[12, 22, 16, 28, 18, 34, 14, 25, 19, 30, 15, 24].map(
                  (height, index) => (
                    <span
                      key={index}
                      style={{ height: `${isSpeaking ? height : 8}px` }}
                      className="w-1 flex-1 rounded-full bg-blue-300 transition-all duration-200"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
            <p className="text-xl font-black">{messages.length}</p>
            <p className="text-[11px] font-bold text-blue-100">Messages</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
            <p className="text-xl font-black">{listening ? "On" : "Off"}</p>
            <p className="text-[11px] font-bold text-blue-100">Mic</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
            <p className="text-xl font-black">{isSpeaking ? "Live" : "AI"}</p>
            <p className="text-[11px] font-bold text-blue-100">Mode</p>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-col bg-slate-50">
        <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <p className="text-sm font-black text-blue-600">
            Speaking Practice
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Ask, answer, repeat
          </h2>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-3 py-4 sm:px-5 sm:py-6">
          {messages.length === 0 && (
            <div className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-black text-slate-950">
                Hello! I’m {teacher.name}.
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Start with: “I want to practice English for travel.” You can
                speak or type.
              </p>
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
                  className={`mt-1 grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-2xl ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 shadow-sm"
                  }`}
                >
                  {message.role === "user" ? (
                    <FaUser />
                  ) : (
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="h-full w-full object-cover"
                    />
                  )}
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
              <div className="rounded-[26px] rounded-tl-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p className="animate-pulse text-sm font-bold text-slate-400">
                  {teacher.name} is thinking...
                </p>
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
                listening
                  ? "Listening..."
                  : `Type or speak to ${teacher.name}...`
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
        </div>
      </div>
    </section>
  );
};

export default AITeacherPage;