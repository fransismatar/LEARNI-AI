import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faVolumeHigh,
  faVolumeXmark,
  faComments,
  faMicrophone,
  faLightbulb,
  faKeyboard,
  faVideo,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LiveAvatarSession } from "@heygen/liveavatar-web-sdk";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

type ChatMessage = {
  id: string;
  role: "user" | "teacher";
  text: string;
};

const TEACHER_NAME = "Zayed";

const AvatarTeacherPage = () => {
  const { user } = useAuth();
  const storedProfile = localStorage.getItem("learningProfile");

const profile =
  user?.learningProfile ||
  (storedProfile ? JSON.parse(storedProfile) : {});

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sessionRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const hasStartedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const transcriptRef = useRef("");

  const [, setSession] = useState<any>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState("Preparing Zayed...");
  const [isMuted, setIsMuted] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const addMessage = (role: "user" | "teacher", text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${role}-${Date.now()}-${Math.random()}`, role, text },
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
      setStatus("Checking microphone permission...");

      await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      setStatus("Requesting Zayed session...");

      const authToken = localStorage.getItem("token");

      const res = await api.post(
        "/heygen/token",
        { teacherId: TEACHER_NAME },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      const sessionToken = res.data?.data?.session_token;

      if (!sessionToken) throw new Error("No HeyGen session token returned");

      setStatus("Starting live avatar...");

      const liveSession = new LiveAvatarSession(sessionToken);

      await liveSession.start();
      await new Promise((resolve) => setTimeout(resolve, 2500));

      if (videoRef.current) {
        videoRef.current.muted = false;
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

const studentName =
  user?.name && user.name !== TEACHER_NAME
    ? user.name
    : "student";

const welcomeText = `Hello ${studentName}, I'm ${TEACHER_NAME} from Lerni AI, your ${
  profile.targetLanguage || "English"
} teacher. I saw your goal is ${
  profile.mainGoal || "conversation"
}, and your level is ${
  profile.englishLevel || profile.level || "Beginner"
}. Are you ready to start your first lesson?`;

      addMessage("teacher", welcomeText);
      await speakText(liveSession, welcomeText);
    } catch (error: any) {
      console.log("HEYGEN START ERROR:", error);
      console.log("HEYGEN RESPONSE:", error?.response?.data);
      setStatus(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to start teacher"
      );
      hasStartedRef.current = false;
    } finally {
      setAvatarLoading(false);
    }
  }, [user?.name, profile.targetLanguage]);

  const stopSession = async () => {
    try {
      if (sessionRef.current) await sessionRef.current.stop();

      if (videoRef.current) videoRef.current.srcObject = null;

      sessionRef.current = null;
      setSession(null);
      hasStartedRef.current = false;
      setStatus("Lesson stopped");
    } catch (error) {
      console.log("STOP ERROR:", error);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

 const startListening = () => {
  if (recognitionRef.current || isRecording) return;

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser");
    return;
  }

  transcriptRef.current = "";

 const recognition = new SpeechRecognition();

recognition.lang =
  profile.nativeLanguage === "Arabic"
    ? "ar-SA"
    : profile.nativeLanguage === "Hebrew"
    ? "he-IL"
    : "en-US";

recognition.interimResults = true;
recognition.continuous = true;

recognitionRef.current = recognition;

recognition.onstart = () => {
  setIsRecording(true);
  setStatus("Recording...");
};

  recognition.onresult = (event: any) => {
    let finalTranscript = "";

    for (let i = 0; i < event.results.length; i++) {
      finalTranscript += event.results[i][0].transcript;
    }

    transcriptRef.current = finalTranscript.trim();
    setInput(transcriptRef.current);

    console.log("VOICE TRANSCRIPT:", transcriptRef.current);
  };

  recognition.onerror = (event: any) => {
    console.log("SPEECH ERROR:", event);
    setIsRecording(false);
    setStatus("Lesson started");
    recognitionRef.current = null;
  };

  recognition.onend = async () => {
    const finalText = transcriptRef.current.trim();

    setIsRecording(false);
    setStatus("Lesson started");
    recognitionRef.current = null;

    if (finalText) {
      await sendToTeacher(finalText);
      transcriptRef.current = "";
    }
  };

  recognition.start();
};

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  useEffect(() => {
    startAvatarSession();

    return () => {
      if (sessionRef.current) sessionRef.current.stop();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [startAvatarSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const micButtonClass = `grid h-20 w-20 select-none cursor-pointer place-items-center rounded-full text-3xl text-white shadow-xl transition duration-200 hover:scale-105 ${
    isRecording
      ? "bg-red-500 shadow-red-500/30"
      : "bg-blue-500 shadow-blue-500/25 hover:bg-blue-600"
  }`;

  return (
    <section className="min-h-screen bg-slate-50 text-slate-950">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExitModal(true)}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/20 transition duration-200 hover:scale-105 hover:bg-red-600"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <button className="grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-slate-100 text-slate-500 transition duration-200 hover:scale-105 hover:bg-slate-200">
              <FontAwesomeIcon icon={faVideo} />
            </button>

            <button
              onClick={toggleMute}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-blue-950 text-white transition duration-200 hover:scale-105 hover:bg-blue-900 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <FontAwesomeIcon icon={isMuted ? faVolumeXmark : faVolumeHigh} />
            </button>

            <button
              onClick={() => setIsChatVisible(!isChatVisible)}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-blue-950 text-white transition duration-200 hover:scale-105 hover:bg-blue-900 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <FontAwesomeIcon icon={faComments} />
            </button>
          </div>

          <div className="hidden items-center gap-2 text-sm font-bold text-slate-600 sm:flex">
            <span>{isRecording ? "Recording" : "04:28"}</span>
            <FontAwesomeIcon icon={faClock} />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-black">Zayed</p>
              <p className="text-xs text-slate-500">{status}</p>
            </div>

            <div className="h-11 w-11 overflow-hidden rounded-2xl bg-blue-500">
              <img
                src="/teachers/Zayed.png"
                alt="Zayed"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        {isChatVisible && (
          <div className="order-2 flex min-h-[420px] flex-col border-r border-slate-200 bg-white lg:order-1 lg:min-h-[calc(100vh-68px)]">
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-amber-400 px-4 py-3 text-white">
                <p className="text-sm font-black">Lecture</p>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">
                  {isRecording ? "Recording" : "Active"}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
              {messages.length === 0 && (
                <div className="mx-auto max-w-md rounded-3xl bg-slate-100 p-5 text-center text-sm leading-7 text-slate-500">
                  Zayed is preparing your first lesson message...
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-[28px] px-5 py-4 text-sm leading-7 shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-50 text-slate-800"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <div className="sticky bottom-0 border-t border-slate-100 bg-white px-5 py-4">
              <div className="flex items-center justify-center gap-8">
                <button className="flex cursor-pointer flex-col items-center gap-2 text-xs font-bold text-blue-500 transition duration-200 hover:scale-105">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-lg transition duration-200 hover:bg-blue-100">
                    <FontAwesomeIcon icon={faLightbulb} />
                  </span>
                  Hint
                </button>

                <button
                  onMouseDown={startListening}
                  onMouseUp={stopListening}
                  onMouseLeave={stopListening}
                  onTouchStart={startListening}
                  onTouchEnd={stopListening}
                  className={micButtonClass}
                >
                  <FontAwesomeIcon icon={faMicrophone} />
                </button>

                <button
                  onClick={() => {
                    const finalText = input.trim();
                    if (finalText) sendToTeacher(finalText);
                  }}
                  className="flex cursor-pointer flex-col items-center gap-2 text-xs font-bold text-blue-500 transition duration-200 hover:scale-105"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-lg transition duration-200 hover:bg-blue-100">
                    <FontAwesomeIcon icon={faKeyboard} />
                  </span>
                  Type
                </button>
              </div>

              {isRecording && (
                <p className="mt-3 text-center text-xs font-bold text-red-500">
                  Recording... release to send
                </p>
              )}

              <div className="mt-4 flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendToTeacher(input);
                  }}
                  placeholder="Write to Zayed..."
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                />

                <button
                  onClick={() => sendToTeacher(input)}
                  className="cursor-pointer rounded-2xl bg-blue-500 px-5 py-3 text-sm font-black text-white transition duration-200 hover:scale-[1.02] hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={`order-1 bg-slate-50 p-4 lg:order-2 lg:min-h-[calc(100vh-68px)] lg:p-8 ${
            !isChatVisible ? "lg:col-span-2" : ""
          }`}
        >
          <div className="relative overflow-hidden rounded-[28px] bg-blue-950 shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isMuted}
              controls={false}
              className="h-[240px] w-full bg-blue-950 object-contain sm:h-[320px] lg:h-[420px]"
            />

            <div className="absolute bottom-5 left-5 space-y-2 text-sm font-bold text-white">
              <div className="flex items-center gap-2">
                <span>Lecture</span>
                <span className="h-3 w-3 rounded-full bg-white"></span>
              </div>

              <div className="flex items-center gap-2 text-white/40">
                <span>Practice</span>
                <span className="h-3 w-3 rounded-full bg-white/30"></span>
              </div>
            </div>

            {avatarLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-950/90 p-8 text-center text-white">
                <div className="h-32 w-32 overflow-hidden rounded-[28px] border border-white/20 bg-white/10">
                  <img
                    src="/teachers/Zayed.png"
                    alt="Zayed"
                    className="h-full max-h-[320px] w-auto object-contain"
                  />
                </div>

                <h2 className="mt-5 text-2xl font-black">Starting Zayed...</h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
                  {status}
                </p>
              </div>
            )}
          </div>

          {!isChatVisible && (
            <div className="mt-5 flex items-center justify-center gap-8">
              <button className="flex cursor-pointer flex-col items-center gap-2 text-xs font-bold text-blue-500 transition duration-200 hover:scale-105">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-lg transition duration-200 hover:bg-blue-100">
                  <FontAwesomeIcon icon={faLightbulb} />
                </span>
                Hint
              </button>

              <button
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onMouseLeave={stopListening}
                onTouchStart={startListening}
                onTouchEnd={stopListening}
                className={micButtonClass}
              >
                <FontAwesomeIcon icon={faMicrophone} />
              </button>

              <button
                onClick={() => setIsChatVisible(true)}
                className="flex cursor-pointer flex-col items-center gap-2 text-xs font-bold text-blue-500 transition duration-200 hover:scale-105"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-lg transition duration-200 hover:bg-blue-100">
                  <FontAwesomeIcon icon={faComments} />
                </span>
                Chat
              </button>
            </div>
          )}

          {isChatVisible && (
            <div className="mt-5 hidden rounded-[28px] bg-blue-50 p-6 lg:block">
              <div className="mx-auto grid h-48 place-items-center rounded-full bg-white text-5xl font-black text-blue-500 sm:h-56">
                F
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold text-slate-500">Today</p>
                  <p className="mt-1 text-lg font-black">Speaking practice</p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold text-slate-500">Target</p>
                  <p className="mt-1 text-lg font-black">
                    {profile.targetLanguage || "English"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-100 text-5xl">
              😢
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-900">
              Finish lesson?
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Are you sure you want to finish this conversation with Zayed?
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 cursor-pointer rounded-2xl bg-slate-100 px-5 py-4 font-bold text-slate-700 transition duration-200 hover:bg-slate-200"
              >
                Continue Talking
              </button>

              <Link
                to="/dashboard"
                onClick={stopSession}
                className="flex-1 rounded-2xl bg-red-500 px-5 py-4 text-center font-bold text-white transition duration-200 hover:bg-red-600"
              >
                Finish
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AvatarTeacherPage;