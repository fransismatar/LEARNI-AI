import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();

  const profile = user?.learningProfile || {};

  const [loading, setLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState<any>(user?.aiLearningPlan || null);

  const generatePlan = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/ai/generate-plan",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAiPlan(res.data.plan);
    } catch (error) {
      console.log(error);
      alert("Failed to generate AI plan");
    } finally {
      setLoading(false);
    }
  };

  const firstLessonTitle =
    aiPlan?.firstLesson?.title ||
    `${profile.targetLanguage || "English"} Daily Practice`;

  const focus =
    profile.travelPurpose ||
    profile.workField ||
    profile.studyType ||
    profile.businessType ||
    profile.mainGoal ||
    "Speaking";

  const roadmap = aiPlan?.weeklyPlan || [
    {
      day: "Day 1",
      focus: "Start",
      practice: "Warm up with simple conversation practice.",
      exampleTask: "Introduce yourself to your AI teacher.",
    },
    {
      day: "Day 2",
      focus: "Vocabulary",
      practice: "Learn useful words for your goal.",
      exampleTask: "Use 5 new words in short sentences.",
    },
    {
      day: "Day 3",
      focus: "Speaking",
      practice: "Practice real conversation with corrections.",
      exampleTask: "Answer questions with full sentences.",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[36px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-blue-500/10 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
          <p className="text-sm font-bold text-cyan-300">
            Welcome back, {user?.name || "Student"}
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            Learn with your personal{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              AI teacher
            </span>
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Today your teacher will help you practice {focus}. Your lessons are
            built from your level, goals, and weak points.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/avatar-teacher"
              className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300"
            >
              Start Video Lesson
            </Link>

            <Link
              to="/teacher"
              className="rounded-2xl border border-cyan-400/40 bg-cyan-400/5 px-6 py-4 text-center font-bold text-cyan-300 transition hover:bg-cyan-400/10"
            >
              Open AI Chat
            </Link>
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
          <p className="text-sm font-bold text-cyan-300">Free practice</p>
          <h2 className="mt-3 text-4xl font-black">5:00</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Try your AI teacher for 5 minutes. Subscription gate will be added later.
          </p>

          <div className="mt-6 rounded-3xl bg-slate-950/60 p-5">
            <p className="text-sm text-slate-400">Current teacher</p>
            <h3 className="mt-2 text-2xl font-black">Learni-X</h3>
            <p className="mt-2 text-sm text-slate-400">
              Friendly AI language coach
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Native", profile.nativeLanguage],
          ["Learning", profile.targetLanguage],
          ["Level", profile.englishLevel],
          ["Goal", profile.mainGoal],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
          >
            <p className="text-sm font-semibold text-cyan-300">{label}</p>
            <h2 className="mt-3 text-xl font-black">{value || "Not set"}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-cyan-300">Learning path</p>
              <h2 className="mt-2 text-3xl font-black">Your roadmap</h2>
            </div>

            <button
              onClick={generatePlan}
              disabled={loading}
              className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Generating..." : aiPlan ? "Regenerate plan" : "Generate AI Plan"}
            </button>
          </div>

          <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <p className="text-sm font-bold text-cyan-300">Today’s lesson</p>
            <h3 className="mt-3 text-2xl font-black">{firstLessonTitle}</h3>
            <p className="mt-3 leading-7 text-slate-300">
              {aiPlan?.summary ||
                "Generate your AI plan to unlock a personalized lesson based on your onboarding answers."}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {roadmap.map((day: any, index: number) => (
              <div
                key={index}
                className="flex gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-400 text-lg font-black text-slate-950">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-black">{day.day}</h4>
                    <span className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                      {day.focus}
                    </span>
                  </div>

                  <p className="mt-3 leading-7 text-slate-300">
                    {day.practice}
                  </p>

                  <p className="mt-3 rounded-2xl bg-white/[0.04] p-4 text-sm text-slate-300">
                    {day.exampleTask}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <p className="text-sm font-bold text-cyan-300">Choose teacher</p>

            <div className="mt-5 space-y-3">
              {["Learni-X", "Maya", "Adam"].map((teacher, index) => (
                <button
                  key={teacher}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    index === 0
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-white/10 bg-slate-950/50 hover:border-cyan-400/40"
                  }`}
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 font-black text-cyan-300">
                    {teacher.charAt(0)}
                  </div>

                  <div>
                    <p className="font-bold">{teacher}</p>
                    <p className="text-xs text-slate-400">
                      AI language teacher
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <p className="text-sm font-bold text-cyan-300">Quick actions</p>

            <div className="mt-5 grid gap-3">
              <Link
                to="/realtime-teacher"
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 font-bold text-white transition hover:border-cyan-400/40"
              >
                Speaking Practice
              </Link>

              <Link
                to="/lessons"
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 font-bold text-white transition hover:border-cyan-400/40"
              >
                Lessons
              </Link>

              <Link
                to="/progress"
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 font-bold text-white transition hover:border-cyan-400/40"
              >
                Progress
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default DashboardPage;