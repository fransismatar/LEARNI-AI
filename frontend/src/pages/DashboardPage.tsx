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

  const stats = [
    ["Level", profile.englishLevel],
    ["Main Goal", profile.mainGoal],
    ["Daily Goal", profile.dailyGoal],
    ["Focus", profile.workField || profile.travelPurpose || profile.studyType || profile.businessType],
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-blue-500/10 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
        <p className="text-sm font-semibold text-cyan-300">
          Your personal learning dashboard
        </p>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              Hi, {user?.name || "Student"} 👋
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Your AI teacher builds lessons based on your level, goals, weak
              points, and daily practice time.
            </p>
          </div>

          <Link
            to="/teacher"
            className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300"
          >
            Start learning
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
          >
            <p className="text-sm font-semibold text-cyan-300">{label}</p>
            <h2 className="mt-3 text-xl font-black text-white">
              {value || "Not set"}
            </h2>
          </div>
        ))}
      </div>

      <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-300">
              Personalized AI Learning Plan
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Your custom roadmap
            </h2>

            <p className="mt-3 max-w-2xl text-slate-400">
              Generate a focused plan built from your onboarding answers.
            </p>
          </div>

          <button
            onClick={generatePlan}
            disabled={loading}
            className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Generating..." : "Generate AI Plan"}
          </button>
        </div>

        {!aiPlan && (
          <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-slate-300">
            No AI plan yet. Click generate and Learni AI will create your first roadmap.
          </div>
        )}

        {aiPlan && (
          <div className="mt-8 space-y-8">
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
              <p className="text-sm font-semibold text-cyan-300">
                First Lesson
              </p>

              <h3 className="mt-3 text-2xl font-black text-white">
                {aiPlan.firstLesson?.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                {aiPlan.summary}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                <p className="text-sm font-semibold text-cyan-300">
                  Daily Goal
                </p>
                <p className="mt-3 text-lg text-slate-200">
                  {aiPlan.dailyGoal}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                <p className="text-sm font-semibold text-cyan-300">
                  Conversation Scenario
                </p>
                <p className="mt-3 text-lg text-slate-200">
                  {aiPlan.firstLesson?.conversationScenario}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black">Vocabulary</h3>

              <div className="mt-5 flex flex-wrap gap-3">
                {aiPlan.firstLesson?.vocabulary?.map((word: string) => (
                  <span
                    key={word}
                    className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black">Weekly Plan</h3>

              <div className="mt-6 grid gap-4">
                {aiPlan.weeklyPlan?.map((day: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-white/10 bg-slate-950/60 p-6"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <h4 className="text-xl font-black">{day.day}</h4>

                      <span className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-300">
                        {day.focus}
                      </span>
                    </div>

                    <p className="mt-4 leading-7 text-slate-300">
                      {day.practice}
                    </p>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-sm font-semibold text-cyan-300">
                        Practice Task
                      </p>
                      <p className="mt-2 text-slate-200">{day.exampleTask}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/teacher"
          className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300"
        >
          Open AI Teacher
        </Link>

        <Link
          to="/realtime-teacher"
          className="rounded-2xl border border-cyan-400/40 bg-cyan-400/5 px-6 py-4 text-center font-bold text-cyan-300 transition hover:bg-cyan-400/10"
        >
          Start Realtime Voice Teacher
        </Link>
      </div>
    </section>
  );
};

export default DashboardPage;