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

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-8">
        <p className="text-sm font-semibold text-cyan-300">
          Your personal learning dashboard
        </p>

        <h1 className="mt-3 text-5xl font-black">Hi, {user?.name} 👋</h1>

        <p className="mt-4 max-w-2xl text-slate-300">
          Your AI teacher is preparing lessons based on your goals, level, weak
          points, and daily practice time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          ["Level", profile.englishLevel],
          ["Main Goal", profile.mainGoal],
          ["Daily Goal", profile.dailyGoal],
          ["Work Field", profile.workField],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
          >
            <p className="text-sm text-cyan-300">{label}</p>
            <h2 className="mt-3 text-2xl font-bold">{value || "Not set"}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-300">
              Personalized AI Learning Plan
            </p>

            <h2 className="mt-3 text-3xl font-black">Your custom roadmap</h2>
          </div>

          <button
            onClick={generatePlan}
            disabled={loading}
            className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
          >
            {loading ? "Generating..." : "Generate AI Plan"}
          </button>
        </div>

        {!aiPlan && (
          <p className="mt-8 text-slate-400">
            Click the button to generate your personal AI learning plan.
          </p>
        )}

        {aiPlan && (
          <div className="mt-10 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {aiPlan.firstLesson?.title}
              </h3>

              <p className="mt-4 text-slate-300">{aiPlan.summary}</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-900 p-6">
                <p className="text-sm text-cyan-300">Daily Goal</p>
                <p className="mt-3 text-lg text-slate-200">
                  {aiPlan.dailyGoal}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-6">
                <p className="text-sm text-cyan-300">
                  Conversation Scenario
                </p>
                <p className="mt-3 text-lg text-slate-200">
                  {aiPlan.firstLesson?.conversationScenario}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold">Vocabulary</h3>

              <div className="mt-5 flex flex-wrap gap-3">
                {aiPlan.firstLesson?.vocabulary?.map((word: string) => (
                  <span
                    key={word}
                    className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-cyan-200"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold">Weekly Plan</h3>

              <div className="mt-6 grid gap-4">
                {aiPlan.weeklyPlan?.map((day: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-slate-900 p-6"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <h4 className="text-xl font-bold">{day.day}</h4>

                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
                        {day.focus}
                      </span>
                    </div>

                    <p className="mt-4 text-slate-300">{day.practice}</p>

                    <div className="mt-5 rounded-xl bg-white/[0.04] p-4">
                      <p className="text-sm text-cyan-300">Practice Task</p>
                      <p className="mt-2 text-slate-200">{day.exampleTask}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Link
        to="/teacher"
        className="inline-block w-full rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
      >
        Open AI Teacher
      </Link>
      <Link
  to="/realtime-teacher"
  className="inline-block w-full rounded-2xl border border-cyan-400/40 px-6 py-4 text-center font-bold text-cyan-300 transition hover:bg-cyan-400/10"
>
  Start Realtime Voice Teacher
</Link>
    </section>
  );
};

export default DashboardPage;