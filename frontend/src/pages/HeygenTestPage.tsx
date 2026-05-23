import { useRef, useState } from "react";
import api from "../services/api";
import { LiveAvatarSession } from "@heygen/liveavatar-web-sdk";

const HeygenTestPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (text: string) => {
    setLogs((prev) => [...prev, text]);
  };

  const startSession = async () => {
    try {
      setLoading(true);
      addLog("Requesting LiveAvatar session token...");

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

      addLog("Session token received.");
      addLog("Creating LiveAvatarSession...");

      const liveSession = new LiveAvatarSession(sessionToken);

      console.log("LiveAvatarSession instance:", liveSession);
      console.log(
        "LiveAvatarSession methods:",
        Object.getOwnPropertyNames(Object.getPrototypeOf(liveSession))
      );

      setSession(liveSession);

      addLog("LiveAvatarSession created. Check browser console for methods.");
    } catch (error: any) {
      console.log(error);
      addLog(error?.message || "Failed to start HeyGen session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 p-6 text-white">
      <div className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6">
        <h1 className="text-4xl font-black">HeyGen LiveAvatar Test</h1>
        <p className="mt-3 text-slate-400">
          We are checking the SDK methods inside the browser.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-[70vh] w-full object-cover"
        />
      </div>

      <button
        onClick={startSession}
        disabled={loading}
        className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950"
      >
        {loading ? "Starting..." : "Create LiveAvatar Session"}
      </button>

      {session && (
        <div className="rounded-2xl border border-green-400/30 bg-green-400/10 p-4 text-green-300">
          LiveAvatarSession object created. Open browser console.
        </div>
      )}

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