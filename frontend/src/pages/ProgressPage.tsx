import { useEffect, useState } from "react";
import api from "../services/api";

interface Lesson {
  _id: string;
  completed: boolean;
  xpReward: number;
}

const ProgressPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const token = localStorage.getItem("token");

  const fetchLessons = async () => {
    const res = await api.get("/lessons", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setLessons(res.data.lessons);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const completedLessons = lessons.filter((lesson) => lesson.completed).length;

  const totalLessons = lessons.length;

  const totalXp = lessons
    .filter((lesson) => lesson.completed)
    .reduce((sum, lesson) => sum + lesson.xpReward, 0);

  const progressPercent =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-cyan-300">Your progress</p>
        <h1 className="mt-3 text-5xl font-black">Learning Progress</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Track your completed lessons, XP, and learning journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          ["Completed Lessons", `${completedLessons}/${totalLessons}`],
          ["Total XP", totalXp],
          ["Progress", `${progressPercent}%`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
          >
            <p className="text-sm text-cyan-300">{label}</p>
            <h2 className="mt-3 text-3xl font-black">{value}</h2>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Course completion</h2>
          <span className="text-cyan-300">{progressPercent}%</span>
        </div>

        <div className="mt-6 h-4 rounded-full bg-white/10">
          <div
            className="h-4 rounded-full bg-cyan-400 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default ProgressPage;