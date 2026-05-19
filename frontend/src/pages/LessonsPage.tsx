import { useEffect, useState } from "react";
import api from "../services/api";

interface Lesson {
  _id: string;
  title: string;
  description: string;
  level: string;
  vocabulary: string[];
  grammarFocus: string;
  speakingPrompt: string;
  completed: boolean;
  xpReward: number;
}

const LessonsPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchLessons = async () => {
    try {
      const res = await api.get("/lessons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLessons(res.data.lessons);
    } catch (error) {
      console.log(error);
    }
  };

  const generateLessons = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        "/lessons/generate",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLessons(res.data.lessons);
    } catch (error) {
      console.log(error);
      alert("Failed to generate lessons");
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = async (lessonId: string) => {
    try {
      await api.put(
        `/lessons/${lessonId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLessons();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-300">Your lessons</p>
          <h1 className="mt-3 text-5xl font-black">Personal English Lessons</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            AI-generated lessons based on your level, goals, and learning profile.
          </p>
        </div>

        <button
          onClick={generateLessons}
          disabled={loading}
          className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-40"
        >
          {loading ? "Generating..." : "Generate Lessons"}
        </button>
      </div>

      {lessons.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-bold">No lessons yet</h2>
          <p className="mt-3 text-slate-300">
            Click Generate Lessons to create your first AI learning path.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-cyan-300">{lesson.level}</p>
                <h2 className="mt-2 text-2xl font-bold">{lesson.title}</h2>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  lesson.completed
                    ? "bg-green-400/10 text-green-300"
                    : "bg-yellow-400/10 text-yellow-300"
                }`}
              >
                {lesson.completed ? "Completed" : "Not completed"}
              </span>
            </div>

            <p className="mt-4 text-slate-300">{lesson.description}</p>

            <div className="mt-5">
              <p className="text-sm font-semibold text-cyan-300">Vocabulary</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lesson.vocabulary.map((word) => (
                  <span
                    key={word}
                    className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-900 p-4">
              <p className="text-sm font-semibold text-cyan-300">
                Speaking Prompt
              </p>
              <p className="mt-2 text-slate-200">{lesson.speakingPrompt}</p>
            </div>

            <button
              onClick={() => completeLesson(lesson._id)}
              disabled={lesson.completed}
              className="mt-6 w-full rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {lesson.completed ? "Lesson Completed" : `Complete +${lesson.xpReward} XP`}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LessonsPage;