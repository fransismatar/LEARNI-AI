import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { teachers } from "../data/teachers";

type DashboardData = {
  speakingScore: number;
  mistakesCount: number;
  currentTopic: string;
  currentDescription: string;
  completedLessons: number;
  totalLessons: number;
  currentLesson?: any;
};

type DailyLesson = {
  _id: string;
  topic: string;
  level: string;
  speakingTask: string;
  words: string[];
  storyTask: string;
  quiz: {
    question: string;
    options: string[];
    answer: string;
  };
  completed: {
    speaking: boolean;
    words: boolean;
    story: boolean;
    quiz: boolean;
  };
};

const DashboardPage = () => {
  const { user } = useAuth();
  const profile = user?.learningProfile || {};

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [dailyLesson, setDailyLesson] = useState<DailyLesson | null>(null);

  const [selectedTeacherId, setSelectedTeacherId] = useState(
    localStorage.getItem("selectedTeacherId") || "zayed"
  );

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const teacher =
    teachers.find((item) => item.id === selectedTeacherId) || teachers[0];

  const targetLanguage = profile.targetLanguage || "English";
  const level = profile.englishLevel || profile.level || "Beginner";
  const mainGoal = profile.mainGoal || profile.goal || "Speaking confidence";

  const speakingScore = dashboardData?.speakingScore || 0;
  const progressWidth = `${speakingScore}%`;

  const completedLessons = dashboardData?.completedLessons || 0;
  const totalLessons = dashboardData?.totalLessons || 0;

  const lessonProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const dailyTasks = dailyLesson
    ? [
        {
          key: "speaking",
          icon: "🎤",
          title: "5 min Speaking",
          description: dailyLesson.speakingTask,
          action: "Start speaking",
          to: `/avatar-teacher?teacher=${teacher.id}`,
          done: dailyLesson.completed.speaking,
        },
        {
          key: "words",
          icon: "Aa",
          title: "10 min Words",
          description:
            dailyLesson.words?.length > 0
              ? dailyLesson.words.join(", ")
              : "Practice today's important words.",
          action: "Practice words",
          to: "/words",
          done: dailyLesson.completed.words,
        },
        {
          key: "story",
          icon: "📖",
          title: "15 min Story",
          description: dailyLesson.storyTask,
          action: "Read story",
          to: "/stories",
          done: dailyLesson.completed.story,
        },
        {
          key: "quiz",
          icon: "✅",
          title: "Quick Quiz",
          description:
            dailyLesson.quiz?.question || "Answer a short daily question.",
          action: "Answer quiz",
          to: "/lessons",
          done: dailyLesson.completed.quiz,
        },
      ]
    : [];

  const dailyCompletedCount = dailyTasks.filter((task) => task.done).length;

  const dailyProgress = dailyTasks.length
    ? Math.round((dailyCompletedCount / dailyTasks.length) * 100)
    : 0;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadDashboard = async () => {
      try {
        const res = await api.get("/dashboard/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDashboardData(res.data);
      } catch (error) {
        console.log("DASHBOARD LOAD ERROR:", error);
      }
    };

    const loadDailyLesson = async () => {
      try {
        const res = await api.get("/daily-lesson/today", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDailyLesson(res.data.dailyLesson);
      } catch (error) {
        console.log("DAILY LESSON LOAD ERROR:", error);
      }
    };

    loadDashboard();
    loadDailyLesson();
  }, []);

  const completeTask = async (task: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        `/daily-lesson/complete/${task}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDailyLesson(res.data.dailyLesson);
    } catch (error) {
      console.log("COMPLETE DAILY TASK ERROR:", error);
    }
  };

  return (
    <section className="space-y-6 text-slate-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">
            Your learning dashboard
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
            Welcome back, {user?.name || "Student"} 👋
          </h1>
        </div>

        <button
          onClick={() => setIsTeacherModalOpen(true)}
          className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-slate-800 sm:w-auto"
        >
          Change Teacher
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-6 text-white shadow-[0_30px_90px_rgba(37,99,235,0.25)] sm:p-8">
          <div className="relative z-10 max-w-xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-100">
              Continue learning {targetLanguage}
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              {dailyLesson?.topic ||
                dashboardData?.currentTopic ||
                "Start your AI lesson"}
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-blue-100">
              Your goal is {mainGoal}. Practice with your selected teacher,
              complete today’s tasks, and review your weak points.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white">
                Level: {level}
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white">
                Teacher: {teacher.name}
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white">
                Goal: {mainGoal}
              </span>
            </div>

            <div className="mt-7">
              <div className="flex justify-between text-xs font-bold text-blue-100">
                <span>Today’s progress</span>
                <span>{dailyProgress}%</span>
              </div>
              <div className="mt-2 h-2.5 rounded-full bg-white/20">
                <div
                  className="h-2.5 rounded-full bg-white"
                  style={{ width: `${dailyProgress}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-bold text-blue-100">
                {dailyCompletedCount}/{dailyTasks.length || 0} tasks completed
              </p>
            </div>

            <Link
              to={`/avatar-teacher?teacher=${teacher.id}`}
              className="mt-7 inline-flex rounded-2xl bg-white px-6 py-4 text-sm font-black text-blue-700 transition hover:bg-blue-50"
            >
              ▶ Continue Lesson
            </Link>
          </div>

          <img
            src={teacher.image}
            alt={teacher.name}
            className="absolute bottom-0 right-3 hidden h-[85%] object-contain opacity-95 md:block"
          />

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="rounded-[34px] border border-slate-200/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-blue-600">
                Selected teacher
              </p>
              <h2 className="mt-1 text-2xl font-black">{teacher.name}</h2>
            </div>

            <div className="h-16 w-16 overflow-hidden rounded-3xl bg-blue-100">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {teacher.role}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-600">
              {teacher.accent}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-500">
              Live avatar
            </span>
          </div>

          <button
            onClick={() => setIsTeacherModalOpen(true)}
            className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-100"
          >
            Choose another teacher
          </button>

          <Link
            to={`/avatar-teacher?teacher=${teacher.id}`}
            className="mt-3 block w-full rounded-2xl bg-blue-600 px-5 py-4 text-center text-sm font-black text-white transition hover:bg-blue-700"
          >
            Start with {teacher.name}
          </Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[30px] border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Speaking Score</p>
          <h3 className="mt-2 text-4xl font-black">{speakingScore}%</h3>

          <div className="mt-5 h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-blue-600"
              style={{ width: progressWidth }}
            />
          </div>

          <p className="mt-3 text-xs leading-6 text-slate-500">
            Based on your real dashboard progress.
          </p>
        </div>

        <div className="rounded-[30px] border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Lessons Progress</p>
          <h3 className="mt-2 text-4xl font-black">
            {completedLessons}/{totalLessons || 0}
          </h3>

          <div className="mt-5 h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-indigo-600"
              style={{ width: `${lessonProgress}%` }}
            />
          </div>

          <p className="mt-3 text-xs leading-6 text-slate-500">
            {lessonProgress}% of your assigned lessons completed.
          </p>
        </div>

        <div className="rounded-[30px] border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Mistakes Review</p>
          <h3 className="mt-2 text-4xl font-black">
            {dashboardData?.mistakesCount || 0}
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            Saved weak words, grammar mistakes, and corrected sentences.
          </p>

          <Link
            to="/mistakes"
            className="mt-4 inline-flex rounded-2xl bg-slate-50 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100"
          >
            Review mistakes
          </Link>
        </div>
      </div>

      <div className="rounded-[34px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-500">
              Today’s AI Lesson
            </p>
            <h2 className="mt-1 text-2xl font-black">
              {dailyLesson?.topic || "Loading today’s lesson..."}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Complete your real daily tasks from the backend.
            </p>
          </div>

          <Link
            to="/onboarding"
            className="rounded-2xl bg-slate-100 px-6 py-4 text-center text-sm font-black text-slate-600 transition hover:bg-slate-200"
          >
            Change Plan
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dailyTasks.map((task) => (
            <div
              key={task.key}
              className={`rounded-[28px] border p-5 transition ${
                task.done
                  ? "border-green-200 bg-green-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-lg shadow-sm">
                  {task.icon}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    task.done
                      ? "bg-green-100 text-green-700"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {task.done ? "Done" : "Pending"}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-black">{task.title}</h3>

              <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
                {task.description}
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <Link
                  to={task.to}
                  className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-blue-700"
                >
                  {task.action}
                </Link>

                <button
                  onClick={() => completeTask(task.key)}
                  disabled={task.done}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    task.done
                      ? "cursor-not-allowed bg-green-100 text-green-600"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {task.done ? "Done" : "Mark Done"}
                </button>
              </div>
            </div>
          ))}

          {!dailyTasks.length && (
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 sm:col-span-2 xl:col-span-4">
              <h3 className="text-lg font-black">No daily lesson yet</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                When your daily lesson loads from the backend, your tasks will
                appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[34px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-bold text-blue-500">Smart AI lesson</p>

          <h2 className="mt-2 text-2xl font-black">
            Learn based on your goal
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            Your current goal is{" "}
            <span className="font-black text-slate-700">{mainGoal}</span>.
            Continue with AI lessons, stories, words, and speaking practice.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-600">
              {targetLanguage}
            </span>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600">
              {level}
            </span>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600">
              {mainGoal}
            </span>
          </div>

          <Link
            to="/lessons"
            className="mt-6 block rounded-2xl bg-blue-600 px-5 py-4 text-center text-sm font-black text-white transition hover:bg-blue-700"
          >
            Open Lessons
          </Link>
        </div>

        <div className="rounded-[34px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-bold text-blue-500">Current Topic</p>

          <h2 className="mt-2 text-2xl font-black">
            {dailyLesson?.topic ||
              dashboardData?.currentTopic ||
              "Start your first lesson"}
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {dailyLesson?.speakingTask ||
              dashboardData?.currentDescription ||
              "Generate your first AI lesson and start practicing."}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Link
              to={`/avatar-teacher?teacher=${teacher.id}`}
              className="rounded-2xl bg-blue-600 px-5 py-4 text-center text-sm font-black text-white transition hover:bg-blue-700"
            >
              Speaking
            </Link>

            <Link
              to="/words"
              className="rounded-2xl bg-slate-100 px-5 py-4 text-center text-sm font-black text-slate-700 transition hover:bg-slate-200"
            >
              Words
            </Link>

            <Link
              to="/stories"
              className="rounded-2xl bg-slate-100 px-5 py-4 text-center text-sm font-black text-slate-700 transition hover:bg-slate-200"
            >
              Stories
            </Link>
          </div>
        </div>
      </div>

      <footer className="flex flex-col gap-3 border-t border-slate-200 py-6 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p>© {new Date().getFullYear()} Lerni AI. Learn languages with AI.</p>

        <div className="flex justify-center gap-4 font-bold text-slate-500">
          <span>Instagram</span>
          <span>TikTok</span>
          <span>Facebook</span>
        </div>
      </footer>

      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end bg-black/50 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
          <div className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-[32px] bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-blue-500">
                  Choose your teacher
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  Pick your AI teacher
                </h2>
              </div>

              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-2xl bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teachers.map((item) => {
                const selected = selectedTeacherId === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedTeacherId(item.id);
                      localStorage.setItem("selectedTeacherId", item.id);
                      setIsTeacherModalOpen(false);
                    }}
                    className={`cursor-pointer overflow-hidden rounded-3xl border text-left transition ${
                      selected
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="h-52 overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-5">
                      <h3 className="text-2xl font-black text-slate-950">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {item.role}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">
                          {item.accent}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                          Video
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                          Arabic support
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardPage;