import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LiveAvatarSession } from "@heygen/liveavatar-web-sdk";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LessonRobot from "../assets/LessonRobot.png";

type ChatMessage = {
  id: string;
  role: "user" | "teacher";
  text: string;
};

const TEACHER_NAME = "Zayed";

const AvatarTeacherPage = () => {
  const { user } = useAuth();
  const profile = user?.learningProfile || {};

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sessionRef = useRef<any>(null);
  const hasStartedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [session, setSession] = useState<any>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState("Preparing Zayed...");

  const addMessage = (role: "user" | "teacher", text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${role}-${Date.now()}-${Math.random()}`,
        role,
        text,
      },
    ]);
  };

  const speakText = async (liveSession: any, text: string) => {
    if (!liveSession || !text.trim()) return;

    if (typeof liveSession.speak === "function") {
      await liveSession.speak({ text });
    } else if (typeof liveSession.message === "function") {
      await liveSession.message(text);
    } else if (typeof liveSession.repeat === "function") {
      await liveSession.repeat(text);
    }
  };

  const sendToTeacher = async (text: string) => {
    const finalText = text.trim();
    if (!finalText || !sessionRef.current) return;

    addMessage("user", finalText);
    setInput("");

    try {
      await speakText(sessionRef.current, finalText);
      addMessage("teacher", "I’m answering you by video.");
    } catch (error) {
      console.log("SEND ERROR:", error);
      addMessage("teacher", "Sorry, I could not answer right now.");
    }
  };

  const startAvatarSession = useCallback(async () => {
    if (hasStartedRef.current) return;

    try {
      hasStartedRef.current = true;
      setAvatarLoading(true);
      setStatus("Checking microphone and camera...");

      await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setStatus("Requesting Zayed session...");

      const authToken = localStorage.getItem("token");

      const res = await api.post(
        "/heygen/token",
        { teacherId: TEACHER_NAME },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("HEYGEN TOKEN RESPONSE:", res.data);

      const sessionToken = res.data?.data?.session_token;

      if (!sessionToken) {
        throw new Error("No HeyGen session token returned");
      }

      setStatus("Starting live avatar...");

      const liveSession = new LiveAvatarSession(sessionToken);

      await liveSession.start();

      await new Promise((resolve) => setTimeout(resolve, 2500));

      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.autoplay = true;
        videoRef.current.playsInline = true;

        await (liveSession as any).attach(videoRef.current);

        try {
          await videoRef.current.play();
        } catch (err) {
          console.log("VIDEO PLAY ERROR:", err);
        }
      }

      sessionRef.current = liveSession;
      setSession(liveSession);
      setStatus("Lesson started");

      const welcomeText = `Hello ${
        user?.name || "student"
      }, welcome to Lerni AI. I am Zayed, your AI language teacher. Today we will practice ${
        profile.targetLanguage || "English"
      }. Let's start: how are you today?`;

      addMessage("teacher", welcomeText);
      await speakText(liveSession, welcomeText);
    } catch (error: any) {
      console.log("HEYGEN START ERROR:", error);
      console.log("HEYGEN RESPONSE:", error?.response?.data);
      setStatus(error?.response?.data?.message || error?.message || "Failed to start teacher");
      alert("Failed to start live teacher");
      hasStartedRef.current = false;
    } finally {
      setAvatarLoading(false);
    }
  }, [user?.name, profile.targetLanguage]);

  const stopSession = async () => {
    try {
      if (sessionRef.current) {
        await sessionRef.current.stop();
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      sessionRef.current = null;
      setSession(null);
      hasStartedRef.current = false;
      setStatus("Lesson stopped");
    } catch (error) {
      console.log("STOP ERROR:", error);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      await sendToTeacher(transcript);
    };

    recognition.onerror = (event: any) => {
      console.log("SPEECH ERROR:", event);
      alert("Speech recognition error. Try typing in chat.");
    };

    recognition.start();
  };

  useEffect(() => {
    startAvatarSession();

    return () => {
      if (sessionRef.current) {
        sessionRef.current.stop();
      }
    };
  }, [startAvatarSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ChatPanel = (
    <div className="flex h-full min-h-0 flex-col rounded-[32px] border border-white/10 bg-white/[0.04] shadow-2xl">
      <div className="border-b border-white/10 p-5">
        <p className="text-sm font-bold text-cyan-300">Teacher Chat</p>
        <h2 className="mt-1 text-2xl font-black">Zayed</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Write or speak, and Zayed will answer by live avatar.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-3xl p-4 text-sm leading-7 ${
              msg.role === "user"
                ? "ml-auto max-w-[85%] bg-cyan-400 text-slate-950"
                : "mr-auto max-w-[90%] border border-white/10 bg-slate-950/60 text-slate-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendToTeacher(input);
            }}
            placeholder="Write to Zayed..."
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <button
            onClick={() => sendToTeacher(input)}
            className="rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
          >
            Send
          </button>
        </div>

        <button
          onClick={startListening}
          className="mt-3 w-full rounded-2xl border border-cyan-400/40 px-5 py-3 font-bold text-cyan-300"
        >
          🎤 Talk
        </button>
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
                Zayed
              </span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Live avatar, connected chat, microphone, and speaking practice.
            </p>

            <p className="mt-3 text-sm text-cyan-300">{status}</p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center font-bold text-slate-200"
            >
              Change teacher
            </Link>

            {session && (
              <button
                onClick={stopSession}
                className="rounded-2xl border border-red-400/40 px-5 py-3 font-bold text-red-300"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            controls={false}
            className="h-[72vh] w-full bg-black object-contain"
          />

          {avatarLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-8 text-center">
              <div className="h-40 w-40 overflow-hidden rounded-[32px] border border-cyan-400/20 bg-cyan-400/5 shadow-2xl shadow-cyan-500/10">
                <img
                  src={LessonRobot}
                  alt="AI Teacher"
                  className="h-full w-full object-cover"
                />
              </div>

              <h2 className="mt-6 text-3xl font-black">Starting Zayed...</h2>

              <p className="mt-4 max-w-md leading-7 text-slate-400">
                Please allow camera and microphone permissions.
              </p>
            </div>
          )}
        </div>

        <div className="hidden h-[72vh] xl:block">{ChatPanel}</div>
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

            <div className="h-[calc(82vh-73px)]">{ChatPanel}</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AvatarTeacherPage;