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

  const featuredTeachers = teachers.slice(0, 4);

  const dailyTasks = dailyLesson
    ? [
        {
          key: "speaking",
          title: "Speaking",
          description: dailyLesson.speakingTask,
          action: "Start speaking",
          to: `/avatar-teacher?teacher=${teacher.id}`,
          done: dailyLesson.completed.speaking,
        },
        {
          key: "words",
          title: "Words",
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
          title: "Story",
          description: dailyLesson.storyTask,
          action: "Read story",
          to: "/stories",
          done: dailyLesson.completed.story,
        },
        {
          key: "quiz",
          title: "Quiz",
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
    <section className="mx-auto max-w-7xl space-y-4 overflow-x-hidden px-3 pb-8 text-slate-950 sm:space-y-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 xl:grid-cols-[1fr_1.15fr]">
        <div className="overflow-hidden rounded-[30px] bg-blue-600 shadow-[0_16px_45px_rgba(37,99,235,0.2)] sm:rounded-[32px]">
  <div className="relative min-h-[430px] overflow-hidden p-5 text-white sm:p-6 md:grid md:min-h-[260px] md:grid-cols-[1.1fr_0.9fr] md:gap-4 md:p-7">
    <div className="relative z-10 flex h-full flex-col justify-between">
      <div>
        <p className="text-sm font-black text-blue-100">
          Welcome back, {user?.name || "Student"} 👋
        </p>

        <h1 className="mt-3 max-w-[260px] text-3xl font-black tracking-tight sm:max-w-none sm:text-3xl lg:text-4xl">
          Continue your journey
        </h1>

        <p className="mt-2 text-base font-black text-blue-100">
          with Teacher {teacher.name}
        </p>

        <div className="mt-8">
          <p className="text-sm font-black text-blue-100">Resume Lesson</p>
          <h2 className="mt-2 max-w-[260px] text-3xl font-black">
            {dailyLesson?.topic ||
              dashboardData?.currentTopic ||
              "Daily practice"}
          </h2>
        </div>

        <div className="mt-5 flex max-w-[270px] items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
          <span className="text-xs font-black text-blue-100">
            {dailyProgress}% Complete
          </span>
        </div>

        <p className="mt-4 text-sm font-bold text-blue-100">
          Next: {dailyTasks.find((task) => !task.done)?.title || "Done"}
        </p>
      </div>

      <Link
        to={`/avatar-teacher?teacher=${teacher.id}`}
        className="mt-6 flex w-full max-w-[230px] items-center justify-center rounded-2xl bg-white px-6 py-4 text-center text-sm font-black text-blue-700 transition hover:bg-blue-50 sm:w-fit"
      >
        Continue Lesson
      </Link>
    </div>

    <div className="pointer-events-none absolute bottom-0 right-0 flex justify-end md:relative md:bottom-auto md:right-auto md:items-end md:justify-center">
      <img
        src={teacher.image}
        alt={teacher.name}
        className="h-[270px] w-[235px] rounded-tl-[34px] object-cover object-top shadow-2xl sm:h-56 sm:w-auto sm:max-w-[240px] sm:rounded-[24px] md:h-64"
      />
    </div>
  </div>
</div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:rounded-[32px] sm:p-6">
          <div className="flex items-start justify-between gap-3">
  <div className="min-w-0">
    <p className="text-lg font-black text-slate-950 sm:text-sm">
      Choose your AI teacher
    </p>
    <p className="mt-1 text-sm font-bold text-slate-400 sm:text-xs">
      Select teacher for today’s lesson
    </p>
  </div>

  <button
    onClick={() => setIsTeacherModalOpen(true)}
    className="shrink-0 rounded-2xl border border-blue-100 bg-white px-4 py-3 text-xs font-black text-blue-600 shadow-sm transition hover:bg-blue-50"
  >
    More teachers
  </button>
</div>

          <div className="-mx-4 mt-5 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {featuredTeachers.map((item) => {
              const selected = selectedTeacherId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedTeacherId(item.id);
                    localStorage.setItem("selectedTeacherId", item.id);
                  }}
                     className={`min-w-[190px] snap-start overflow-hidden rounded-[26px] border text-left transition hover:-translate-y-1 hover:shadow-lg sm:min-w-0 sm:rounded-[24px] ${
                  selected
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200 bg-slate-50 hover:bg-white"
                }`}
                >
                  <div className="h-28 overflow-hidden bg-white sm:h-32">
  <img
    src={item.image}
    alt={item.name}
    className="h-full w-full object-cover"
  />
</div>

                  <div className="p-4">
                    <h3 className="truncate text-base font-black text-slate-950">
                      {item.name}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs font-bold text-slate-500">
                      {item.role}
                    </p>
                    <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-black text-blue-600">
                      {item.accent}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">

  <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-5">
    <p className="text-sm font-bold text-slate-500">
      Speaking Score
    </p>

    <h3 className="mt-3 text-4xl font-black text-slate-950">
      {speakingScore}%
    </h3>

    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-blue-600"
        style={{ width: progressWidth }}
      />
    </div>
  </div>

        <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-5">
          <p className="text-sm font-bold text-slate-500">Lessons</p>
          <h3 className="mt-3 text-4xl font-black text-slate-950">
            {dashboardData?.completedLessons || 0}
            <span className="text-xl text-slate-400">
              /{dashboardData?.totalLessons || 0}
            </span>
          </h3>
          <p className="mt-5 text-sm font-bold text-slate-400">
            Completed / Total
          </p>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-5">
          <p className="text-sm font-bold text-slate-500">Mistakes Count</p>
          <h3 className="mt-3 text-4xl font-black text-slate-950">
            {dashboardData?.mistakesCount || 0}
          </h3>
          <p className="mt-5 text-sm font-bold text-slate-400">
            Saved for review
          </p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black text-blue-600">
              Today’s AI Lesson
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
              {dailyLesson?.topic || "Loading today’s lesson..."}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Complete your speaking, words, story, and quiz tasks.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-5 py-3 text-sm font-black text-slate-600">
            {dailyCompletedCount}/{dailyTasks.length || 4} completed
          </div>
        </div>

        <div className="-mx-4 mt-5 flex snap-x gap-3 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 xl:grid-cols-4">
          {dailyTasks.map((task) => (
  <div
    key={task.key}
    className={`min-w-[250px] snap-start rounded-[24px] border p-4 transition sm:p-5 md:min-w-0 md:rounded-[26px] ${
                task.done
                  ? "border-green-200 bg-green-50"
                  : "border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-black text-slate-950">
                  {task.title}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    task.done
                      ? "bg-green-100 text-green-700"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {task.done ? "Done" : "Open"}
                </span>
              </div>

              <p className="mt-4 line-clamp-4 min-h-24 text-sm leading-7 text-slate-500">
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
                      ? "cursor-not-allowed bg-green-100 text-green-700"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {task.done ? "Completed" : "Mark Done"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-6">
          <p className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">Current Topic</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950">
            {dashboardData?.currentTopic ||
              dailyLesson?.topic ||
              "Start your first lesson"}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            {dashboardData?.currentDescription ||
              dailyLesson?.speakingTask ||
              "Your AI lesson topic will appear here."}
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-6">
          <p className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">Learning Goal</p>

          <div className="mt-5 grid gap-3">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400">
                Target Language
              </p>
              <p className="mt-1 text-lg font-black text-slate-950">
                {targetLanguage}
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase text-slate-400">
                Level
              </p>
              <p className="mt-1 text-lg font-black text-slate-950">{level}</p>
            </div>

            <div className="rounded-3xl bg-blue-50 p-4">
              <p className="text-xs font-black uppercase text-blue-500">
                Main Goal
              </p>
              <p className="mt-1 text-lg font-black text-slate-950">
                {mainGoal}
              </p>
            </div>
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
          <div className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[32px] bg-white p-5 shadow-2xl sm:p-7">
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