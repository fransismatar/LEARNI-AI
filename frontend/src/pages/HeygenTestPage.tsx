import { useRef, useState } from "react";
import api from "../services/api";
import { LiveAvatarSession } from "@heygen/liveavatar-web-sdk";

const HeygenTestPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("Hello, welcome to Lerni AI. I am your AI language teacher.");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (text: string) => {
    setLogs((prev) => [...prev, text]);
  };

  const startSession = async () => {
    try {
      setLoading(true);
      addLog("Requesting LiveAvatar token...");

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/heygen/token",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sessionToken = res.data.data.session_token;

      addLog("Creating LiveAvatarSession...");
      const liveSession = new LiveAvatarSession(sessionToken);

     addLog("Attaching video...");
if (videoRef.current) {
  await liveSession.attach(videoRef.current);
}

addLog("Starting session...");
await liveSession.start();
      
      setSession(liveSession);
      addLog("HeyGen avatar started successfully.");
    } catch (error: any) {
      console.log(error);
      addLog(error?.message || "Failed to start avatar");
      alert("Failed to start HeyGen avatar");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!session || !text.trim()) return;

    try {
      addLog("Sending message to avatar...");
      await session.message(text);
      addLog("Message sent.");
    } catch (error: any) {
      console.log(error);
      addLog(error?.message || "Failed to send message");
    }
  };

  const repeatText = async () => {
    if (!session || !text.trim()) return;

    try {
      addLog("Repeating text...");
      await session.repeat(text);
      addLog("Repeat sent.");
    } catch (error: any) {
      console.log(error);
      addLog(error?.message || "Failed to repeat");
    }
  };

  const stopSession = async () => {
    if (!session) return;

    try {
      await session.stop();
      setSession(null);
      addLog("Session stopped.");
    } catch (error: any) {
      console.log(error);
      addLog(error?.message || "Failed to stop");
    }
  };

  return (
    <section className="mx-auto max-w-6xl space-y-6 p-6 text-white">
      <div className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6">
        <h1 className="text-4xl font-black">HeyGen LiveAvatar Test</h1>
        <p className="mt-3 text-slate-400">
          Testing real-time avatar video for Lerni AI.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-[70vh] w-full object-cover"
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
            onClick={repeatText}
            className="mt-4 w-full rounded-2xl border border-cyan-400/40 px-5 py-4 font-bold text-cyan-300"
          >
            Repeat Text
          </button>

          <button
            onClick={stopSession}
            className="mt-4 w-full rounded-2xl border border-red-400/40 px-5 py-4 font-bold text-red-300"
          >
            Stop
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950 p-5">
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