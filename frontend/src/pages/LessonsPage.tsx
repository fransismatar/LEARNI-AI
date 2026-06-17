import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        headers: { Authorization: `Bearer ${token}` },
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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
    <section className="mx-auto max-w-6xl space-y-6 text-slate-950">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-500">Your lessons</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              Personal English Lessons
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              AI-generated lessons based on your level, goals, and learning
              profile.
            </p>
          </div>

          <button
            onClick={generateLessons}
            disabled={loading}
            className="rounded-2xl bg-blue-500 px-6 py-4 text-sm font-black text-white transition hover:bg-blue-600 disabled:opacity-40"
          >
            {loading ? "Generating..." : "Generate Lessons"}
          </button>
        </div>
      </div>

      {lessons.length === 0 && (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            No lessons yet
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Click Generate Lessons to create your first AI learning path.
          </p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-blue-500">
                  {lesson.level}
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  {lesson.title}
                </h2>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  lesson.completed
                    ? "bg-green-50 text-green-600"
                    : "bg-yellow-50 text-yellow-600"
                }`}
              >
                {lesson.completed ? "Completed" : "Not completed"}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              {lesson.description}
            </p>

            <div className="mt-5">
              <p className="text-sm font-black text-blue-500">Vocabulary</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lesson.vocabulary.map((word) => (
                  <span
                    key={word}
                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-black text-blue-500">
                Speaking Prompt
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {lesson.speakingPrompt}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                to={`/lessons/${lesson._id}`}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-center text-sm font-black text-slate-700 transition hover:bg-slate-200"
              >
                Open Lesson
              </Link>

              <button
                onClick={() => completeLesson(lesson._id)}
                disabled={lesson.completed}
                className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-green-100 disabled:text-green-600"
              >
                {lesson.completed
                  ? "Lesson Completed"
                  : `Complete +${lesson.xpReward} XP`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LessonsPage;