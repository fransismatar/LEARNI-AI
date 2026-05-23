import { useRef, useState } from "react";
import api from "../services/api";

import StreamingAvatar, {
  StreamingEvents,
  AvatarQuality,
} from "@heygen/streaming-avatar";

const HeygenTestPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [avatar, setAvatar] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

      const sessionToken = res.data.data.session_token;

      const newAvatar = new StreamingAvatar({
        token: sessionToken,
      });

      newAvatar.on(StreamingEvents.STREAM_READY, (event: any) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.detail;
          videoRef.current.play();
        }
      });

      await newAvatar.createStartAvatar({
        quality: AvatarQuality.Medium,
        avatarName: import.meta.env.VITE_HEYGEN_AVATAR_ID,
      });

      setAvatar(newAvatar);

      alert("HeyGen avatar started 🔥");
    } catch (error) {
      console.log(error);
      alert("Failed to start avatar");
    } finally {
      setLoading(false);
    }
  };

  const speak = async () => {
    if (!avatar) return;

    await avatar.speak({
      text: "Hello and welcome to Lerni AI. I am your AI teacher.",
    });
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 p-6 text-white">
      <div className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6">
        <h1 className="text-4xl font-black">
          HeyGen LiveAvatar Test
        </h1>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-[70vh] w-full object-cover"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={startSession}
          disabled={loading}
          className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950"
        >
          {loading ? "Starting..." : "Start Avatar"}
        </button>

        <button
          onClick={speak}
          className="rounded-2xl bg-white px-6 py-4 font-bold text-slate-950"
        >
          Speak
        </button>
      </div>
    </section>
  );
};

export default HeygenTestPage;