import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { teachers } from "../data/teachers";

const practiceCards = [
  {
    title: "Live Teacher",
    description: "Continue your speaking lesson with your AI teacher.",
    action: "Start lesson",
    to: "/avatar-teacher",
  },
  {
    title: "Words Practice",
    description: "Train important words with sound and examples.",
    action: "Practice words",
    to: "#",
  },
  {
    title: "Stories",
    description: "Read simple stories by level with translation and audio.",
    action: "Open stories",
    to: "/stories",
  },
];

type DashboardData = {
  speakingScore: number;
  mistakesCount: number;
  currentTopic: string;
  currentDescription: string;
  completedLessons: number;
  totalLessons: number;
  currentLesson?: any;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const profile = user?.learningProfile || {};

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  const [selectedTeacherId, setSelectedTeacherId] = useState(
    localStorage.getItem("selectedTeacherId") || "zayed"
  );

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const teacher =
    teachers.find((item) => item.id === selectedTeacherId) || teachers[0];

  const targetLanguage = profile.targetLanguage || "English";
  const level = profile.englishLevel || profile.level || "Beginner";
  const mainGoal =
    profile.mainGoal || profile.goal || "Speaking confidence";

  const speakingScore = dashboardData?.speakingScore || 0;
  const progressWidth = `${speakingScore}%`;

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/dashboard/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDashboardData(res.data);
      } catch (error) {
        console.log("DASHBOARD LOAD ERROR:", error);
      }
    };

    loadDashboard();
  }, []);

  const getPracticeLink = (to: string) => {
    if (to === "/avatar-teacher") {
      return `/avatar-teacher?teacher=${teacher.id}`;
    }

    return to;
  };

  return (
    <section className="mx-auto max-w-6xl space-y-6 text-slate-950">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <p className="text-sm font-bold text-blue-500">
              Welcome back, {user?.name || "Student"}
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Continue learning {targetLanguage}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Your goal is {mainGoal}. Keep practicing with live speaking,
              words, stories, and AI corrections.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-600">
                Level: {level}
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600">
                Teacher: {teacher.name}
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600">
                Goal: {mainGoal}
              </span>
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-50 p-5">
            <p className="text-sm font-black text-slate-500">Today’s focus</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Speaking practice
            </h2>

            <Link
              to={`/avatar-teacher?teacher=${teacher.id}`}
              className="mt-5 block rounded-2xl bg-blue-500 px-6 py-4 text-center text-sm font-black text-white transition hover:bg-blue-600"
            >
              Continue Lesson
            </Link>

            <button
              onClick={() => setIsTeacherModalOpen(true)}
              className="mt-3 w-full cursor-pointer rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-100"
            >
              Change Teacher
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Speaking Score</p>
          <h3 className="mt-2 text-3xl font-black text-slate-950">
            {speakingScore}%
          </h3>
          <div className="mt-4 h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-blue-500"
              style={{ width: progressWidth }}
            />
          </div>
          <p className="mt-3 text-xs leading-6 text-slate-500">
            Based on your completed lessons and practice progress.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Current Topic</p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">
            {dashboardData?.currentTopic || "Start your first lesson"}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            {dashboardData?.currentDescription ||
              "Generate your first AI lesson."}
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Mistakes Review</p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">
            {dashboardData?.mistakesCount || 0} items
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Review weak words and corrected sentences.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-blue-500">Your teacher</p>

          <div className="mt-5 flex items-center gap-4 rounded-3xl bg-slate-50 p-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-blue-100">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-950">
                {teacher.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{teacher.role}</p>
              <p className="mt-2 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">
                {teacher.accent}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTeacherModalOpen(true)}
            className="mt-4 w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Choose another teacher
          </button>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-blue-500">Today</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            What do you want to practice?
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {practiceCards.map((card) =>
              card.to === "#" ? (
                <button
                  key={card.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <h3 className="text-lg font-black text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {card.description}
                  </p>
                  <p className="mt-5 text-sm font-black text-blue-500">
                    {card.action} →
                  </p>
                </button>
              ) : (
                <Link
                  key={card.title}
                  to={getPracticeLink(card.to)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <h3 className="text-lg font-black text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {card.description}
                  </p>
                  <p className="mt-5 text-sm font-black text-blue-500">
                    {card.action} →
                  </p>
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-500">Next improvement</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Review your mistakes
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
              After each lesson, Lerni AI will save your weak words, grammar
              mistakes, and pronunciation notes here.
            </p>
          </div>

          <Link
  to="/mistakes"
  className="rounded-2xl bg-blue-500 px-6 py-4 text-sm font-black text-white transition hover:bg-blue-600"
>
  Review Now
</Link>
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