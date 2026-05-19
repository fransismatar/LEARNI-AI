import { useState } from "react";
import api from "../services/api";

const AvatarTeacherPage = () => {
  const [conversationUrl, setConversationUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const startAvatarSession = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/avatar/session",
        {},
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
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-8">
        <p className="text-sm font-semibold text-cyan-300">
          AI Video Teacher
        </p>

        <h1 className="mt-3 text-5xl font-black">
          Practice English face to face
        </h1>

        <p className="mt-4 max-w-2xl text-slate-300">
          Start a real video conversation with your AI avatar teacher.
        </p>
      </div>

      {!conversationUrl ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <div className="text-7xl">🤖</div>

          <h2 className="mt-6 text-3xl font-bold">
            Ready to meet your AI teacher?
          </h2>

          <button
            onClick={startAvatarSession}
            disabled={loading}
            className="mt-8 rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
          >
            {loading ? "Starting avatar..." : "Start Avatar Lesson"}
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
          <iframe
            src={conversationUrl}
            allow="camera; microphone; autoplay; fullscreen"
            className="h-[75vh] w-full"
          />
        </div>
      )}
    </section>
  );
};

export default AvatarTeacherPage;