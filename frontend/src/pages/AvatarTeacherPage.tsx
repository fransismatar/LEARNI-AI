import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

type ChatMessage = {
  _id?: string;
  role: "user" | "assistant";
  content: string;
};

type SpeechRecognitionType = typeof window & {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
};

const AvatarTeacherPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const teacherId = searchParams.get("teacher") || "Maya";
  const profile = user?.learningProfile || {};

  const [conversationUrl, setConversationUrl] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState("");

  const [isChatOpen, setIsChatOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/chat/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessages(res.data.messages || []);
      } catch (error) {
        console.log(error);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading, isChatOpen]);

  const startAvatarSession = async () => {
    try {
      setAvatarLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/avatar/session",
        { teacherId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConversationUrl(res.data.conversation_url);
    } catch (error) {
      console.log(error);
      alert("Failed to start avatar teacher");
    } finally {
      setAvatarLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const studentMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: studentMessage,
      },
    ]);

    setMessage("");
    setMicError("");

    try {
      setChatLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/chat/message",
        { message: studentMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.reply,
        },
      ]);
    } catch (error) {
      console.log(error);
      alert("Failed to send message");
    } finally {
      setChatLoading(false);
    }
  };

  const startSpeechToText = () => {
    setMicError("");

    const isSecure =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost";

    if (!isSecure) {
      setMicError("Microphone needs HTTPS or localhost.");
      return;
    }

    const speechWindow = window as SpeechRecognitionType;
    const SpeechRecognition =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError("Speech recognition works best in Chrome browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang =
      profile.targetLanguage === "Hebrew"
        ? "he-IL"
        : profile.targetLanguage === "Arabic"
        ? "ar"
        : "en-US";

    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setMessage(text);
      setListening(false);
    };

    recognition.onerror = (event: any) => {
      setListening(false);

      if (event.error === "not-allowed") {
        setMicError("Microphone permission was blocked.");
        return;
      }

      if (event.error === "no-speech") {
        setMicError("I did not hear anything. Try again.");
        return;
      }

      setMicError("Microphone failed. Try Chrome or check permissions.");
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const ChatPanel = () => (
    <div className="flex h-full min-h-0 flex-col rounded-[32px] border border-white/10 bg-white/[0.04] shadow-2xl">
      <div className="border-b border-white/10 p-5">
        <p className="text-sm font-bold text-cyan-300">AI Teacher Chat</p>
        <h2 className="mt-1 text-2xl font-black">{teacherId}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Ask for written sentences, corrections, grammar help, or examples.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-5 text-sm leading-7 text-slate-400">
            Try: “Write what I should say in English” or “Correct my last sentence”.
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`rounded-3xl p-4 text-sm leading-7 ${
              msg.role === "user"
                ? "ml-auto max-w-[85%] bg-cyan-400 text-slate-950"
                : "mr-auto max-w-[90%] border border-white/10 bg-slate-950/60 text-slate-200"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {chatLoading && (
          <div className="mr-auto max-w-[90%] rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">
            {teacherId} is writing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 p-4">
        {micError && (
          <div className="mb-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {micError}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={startSpeechToText}
            className={`grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-2xl font-bold transition ${
              listening
                ? "bg-red-400 text-white"
                : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
            }`}
          >
            🎤
          </button>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask your teacher to write, correct, or explain..."
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <button
            onClick={sendMessage}
            disabled={chatLoading}
            className="cursor-pointer rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Tavus handles video. Chat gives written help and readable corrections.
        </p>
      </div>
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-blue-500/10 p-6 shadow-2xl sm:p-8">
        <p className="text-sm font-bold text-cyan-300">Lesson Room</p>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              Learn with{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {teacherId}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Video teacher, chat, microphone, and corrections in one place.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center font-bold text-slate-200 transition hover:bg-white/[0.08]"
          >
            Change teacher
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl">
          {!conversationUrl ? (
            <div className="flex min-h-[68vh] flex-col items-center justify-center p-8 text-center">
              <div className="grid h-24 w-24 place-items-center rounded-[28px] border border-cyan-400/30 bg-cyan-400/10 text-5xl">
                🤖
              </div>

              <h2 className="mt-6 text-3xl font-black">
                Ready to meet {teacherId}?
              </h2>

              <p className="mt-4 max-w-md leading-7 text-slate-400">
                Start the video call, then open chat anytime for written help.
              </p>

              <button
                onClick={startAvatarSession}
                disabled={avatarLoading}
                className="mt-8 cursor-pointer rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {avatarLoading ? "Starting lesson..." : "Start Video Lesson"}
              </button>
            </div>
          ) : (
            <iframe
              src={conversationUrl}
              allow="camera; microphone; autoplay; fullscreen"
              className="h-[72vh] w-full"
            />
          )}
        </div>

        <div className="hidden h-[72vh] xl:block">
          <ChatPanel />
        </div>
      </div>

      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-4 z-50 rounded-2xl bg-cyan-400 px-5 py-4 font-bold text-slate-950 shadow-2xl shadow-cyan-400/30 xl:hidden"
      >
        Open Chat
      </button>

      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-end bg-black/70 p-3 backdrop-blur-md xl:hidden">
          <div className="h-[82vh] w-full overflow-hidden rounded-[32px] bg-slate-950">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <p className="font-bold text-cyan-300">Teacher chat</p>

              <button
                onClick={() => setIsChatOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 text-xl text-slate-300"
              >
                ×
              </button>
            </div>

            <div className="h-[calc(82vh-73px)]">
              <ChatPanel />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AvatarTeacherPage;