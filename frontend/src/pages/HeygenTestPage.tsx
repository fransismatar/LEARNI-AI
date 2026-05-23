import { useRef, useState } from "react";
import api from "../services/api";

const HeygenTestPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);

  const startSession = async () => {
    try {
      setLoading(true);

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

      console.log("HEYGEN SESSION:", res.data);

      setSessionData(res.data);

      alert("Session created successfully 🔥");
    } catch (error) {
      console.log(error);
      alert("Failed to create HeyGen session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 p-6 text-white">
      <div className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6">
        <h1 className="text-4xl font-black">
          HeyGen LiveAvatar Test
        </h1>

        <p className="mt-3 text-slate-400">
          Testing realtime avatar connection for Lerni AI.
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
        {loading ? "Starting..." : "Start HeyGen Session"}
      </button>

      {sessionData && (
        <pre className="overflow-auto rounded-3xl border border-white/10 bg-slate-950 p-5 text-sm">
          {JSON.stringify(sessionData, null, 2)}
        </pre>
      )}
    </section>
  );
};

export default HeygenTestPage;