import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const AvatarTeacherPage = () => {
  const { user } = useAuth();

  const [conversationUrl, setConversationUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const teacherId = searchParams.get("teacher") || "Learni-X";

  const profile = user?.learningProfile || {};

  const startAvatarSession = async () => {
    try {
      setLoading(true);

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
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-blue-500/10 p-6 shadow-2xl sm:p-8">
        <p className="text-sm font-bold text-cyan-300">Lesson Room</p>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              Video lesson with{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {teacherId}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Practice {profile.targetLanguage || "English"} with video,
              microphone, live conversation, and corrections.
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

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl">
          {!conversationUrl ? (
            <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
              <div className="grid h-24 w-24 place-items-center rounded-[28px] border border-cyan-400/30 bg-cyan-400/10 text-5xl">
                🤖
              </div>

              <h2 className="mt-6 text-3xl font-black">
                Ready to meet {teacherId}?
              </h2>

              <p className="mt-4 max-w-md leading-7 text-slate-400">
                Your teacher will speak based on your native language and help
                you practice your target language step by step.
              </p>

              <button
                onClick={startAvatarSession}
                disabled={loading}
                className="mt-8 cursor-pointer rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Starting lesson..." : "Start Video Lesson"}
              </button>
            </div>
          ) : (
            <iframe
              src={conversationUrl}
              allow="camera; microphone; autoplay; fullscreen"
              className="h-[78vh] w-full"
            />
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <p className="text-sm font-bold text-cyan-300">Student profile</p>

            <div className="mt-5 space-y-4">
              {[
                ["Native", profile.nativeLanguage || "Arabic"],
                ["Learning", profile.targetLanguage || "English"],
                ["Level", profile.englishLevel || "Beginner"],
                ["Goal", profile.mainGoal || "Speaking"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                >
                  <p className="text-xs font-bold text-cyan-300">{label}</p>
                  <p className="mt-1 font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <p className="text-sm font-bold text-cyan-300">Lesson tools</p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                🎤 Speak with microphone
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                💬 Chat transcript
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                ✅ Grammar corrections
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                🔁 Repeat better sentence
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-cyan-400/20 bg-cyan-400/10 p-6">
            <p className="font-bold text-cyan-300">Teaching rule</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              If your native language is Arabic, the teacher explains in Arabic
              and practices with you in {profile.targetLanguage || "English"}.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default AvatarTeacherPage;