import { useRef, useState } from "react";
import api from "../services/api";
import { LiveAvatarSession } from "@heygen/liveavatar-web-sdk";

const HeygenTestPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(
    "Hello, welcome to Lerni AI. I am your AI language teacher."
  );
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [...prev, message]);
  };

  const startSession = async () => {
    try {
      setLoading(true);

      addLog("Checking media permissions...");

      // طلب صلاحيات الميكروفون فقط، الكاميرا اختيارية ولا يحتاجها الأفاتار ليتحدث إليك
      await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false, 
      });

      addLog("Requesting HeyGen token...");

      const authToken = localStorage.getItem("token");

      const res = await api.post(
        "/heygen/token",
        { teacherId: "Zayed" }, 
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("TOKEN RESPONSE:", res.data);

      // استخراج التوكن بناءً على بنية الـ Backend المحدثة
      const sessionToken = res.data?.data?.token || res.data?.data;

      if (!sessionToken) {
        addLog("No session token returned from backend");
        return;
      }

      addLog("Creating LiveAvatarSession...");
      const liveSession = new LiveAvatarSession(sessionToken);

      // إضافة مستمع للأحداث (Event Listeners) لالتقاط البث فور جاهزيته
   (liveSession as any).on("stream_ready", (stream: MediaStream) => {
  addLog("Stream ready event triggered!");
  if (videoRef.current) {
    videoRef.current.srcObject = stream;
    videoRef.current.muted = false; 
    videoRef.current.play().catch((err) => console.log("Video play error:", err));
  }
});

 (liveSession as any).on("session_end", () => {
  addLog("Session ended by server");
  setSession(null);
});

      addLog("Starting avatar session...");
      await liveSession.start();

      addLog("Waiting for connection...");
      setSession(liveSession);
      addLog("Avatar session started successfully");

    } catch (error: any) {
      console.log("HEYGEN START ERROR:", error);
      addLog(error?.message || "Failed to start avatar");
      alert("Failed to start HeyGen avatar");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!session || !text.trim()) return;

    try {
      addLog("Sending message...");

      // التحقق من الدوال الرسمية لـ HeyGen LiveAvatar SDK
      if (typeof session.speak === "function") {
        await session.speak({ text });
      } else if (typeof session.sendTask === "function") {
        await session.sendTask({ text });
      } else if (typeof session.message === "function") {
        await session.message(text);
      } else {
        addLog("No speak/sendTask/message method found");
        return;
      }

      addLog("Message sent");
    } catch (error: any) {
      console.log("SEND ERROR:", error);
      addLog(error?.message || "Failed to send message");
    }
  };

  const stopSession = async () => {
    if (!session) return;

    try {
      addLog("Stopping session...");
      await session.stop();

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setSession(null);
      addLog("Session stopped");
    } catch (error: any) {
      console.log("STOP ERROR:", error);
      addLog(error?.message || "Failed to stop");
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
      setText(transcript);
      addLog(`You said: ${transcript}`);

      if (session) {
        if (typeof session.speak === "function") {
          await session.speak({ text: transcript });
        } else if (typeof session.sendTask === "function") {
          await session.sendTask({ text: transcript });
        } else if (typeof session.message === "function") {
          await session.message(transcript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.log("Speech error:", event);
      addLog("Speech recognition error");
    };

    recognition.start();
  };

  return (
    <section className="mx-auto max-w-6xl space-y-6 p-6 text-white">
      <div className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6">
        <h1 className="text-4xl font-black">HeyGen Live Avatar Test</h1>
        <p className="mt-3 text-slate-400">Testing real-time avatar for Lerni AI.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            controls={false}
            className="h-[70vh] w-full bg-black object-contain"
          />
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950 p-6">
          <button
            onClick={startSession}
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-400 px-5 py-4 font-bold text-slate-950 disabled:opacity-60"
          >
            {loading ? "Starting..." : "Start HeyGen Avatar"}
          </button>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-5 h-40 w-full rounded-2xl border border-white/10 bg-slate-900 p-4 text-white outline-none"
          />

          <button
            onClick={sendMessage}
            className="mt-4 w-full rounded-2xl bg-white px-5 py-4 font-bold text-slate-950"
          >
            Send Message
          </button>
          
          <button
            onClick={startListening}
            className="mt-4 w-full rounded-2xl border border-cyan-400/40 px-5 py-4 font-bold text-cyan-300"
          >
            🎤 Talk with Teacher
          </button>

          <button
            onClick={stopSession}
            className="mt-4 w-full rounded-2xl border border-red-400/40 px-5 py-4 font-bold text-red-300"
          >
            Stop Session
          </button>
        </div>
      </div>

      <div className="space-y-2 rounded-3xl border border-white/10 bg-slate-950 p-5">
  {logs.map((log, index) => (
    <p key={index} className="text-sm text-slate-300">
      {log}
    </p>
  ))}
</div>

    </section>
  );
};

export default HeygenTestPage;
