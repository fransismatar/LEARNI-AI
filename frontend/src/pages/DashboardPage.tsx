import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const teachers = [
  { name: "Maya", role: "Calm conversation coach", accent: "Confidence", image: "/teachers/maya.png" },
  { name: "Adam", role: "Professional speaking coach", accent: "Work / Interviews", image: "/teachers/adam.png" },
  { name: "Stephanie", role: "Warm daily conversation teacher", accent: "Daily talk", image: "/teachers/stephanie.png" },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const profile = user?.learningProfile || {};

  const [selectedTeacher, setSelectedTeacher] = useState("Maya");
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const teacher = teachers.find((item) => item.name === selectedTeacher) || teachers[0];

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-[36px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-blue-500/10 p-6 shadow-2xl sm:p-8">
        <p className="text-sm font-bold text-cyan-300">
          Welcome back, {user?.name || "Student"}
        </p>

        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
          Start your lesson with{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            {selectedTeacher}
          </span>
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          Practice {profile.targetLanguage || "English"} with video, voice,
          chat, and corrections in one lesson room.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/avatar-teacher?teacher=${selectedTeacher}`}
            className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300"
          >
            Start Lesson
          </Link>

          <button
            onClick={() => setIsTeacherModalOpen(true)}
            className="cursor-pointer rounded-2xl border border-cyan-400/40 bg-cyan-400/5 px-6 py-4 text-center font-bold text-cyan-300 transition hover:bg-cyan-400/10"
          >
            Change Teacher
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          <p className="text-sm font-bold text-cyan-300">Your teacher</p>

          <div className="mt-5 flex h-full flex-col justify-between gap-5 rounded-3xl border border-cyan-400/20 bg-slate-950/60 p-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-3xl border border-cyan-400/20">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-2xl font-black">{teacher.name}</h2>
                <p className="mt-1 text-sm text-slate-400">{teacher.role}</p>
                <p className="mt-2 w-fit rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                  {teacher.accent}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsTeacherModalOpen(true)}
              className="cursor-pointer rounded-2xl bg-white/[0.06] px-5 py-3 font-bold text-white transition hover:bg-white/[0.1]"
            >
              Choose teacher
            </button>
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
          <p className="text-sm font-bold text-cyan-300">Today’s path</p>

          <div className="mt-5 grid gap-3">
            {["Warm up conversation", "New vocabulary", "Speaking practice", "AI corrections"].map(
              (item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 text-sm font-black text-slate-950">
                    {index + 1}
                  </div>

                  <p className="font-bold">{item}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end bg-black/70 p-4 backdrop-blur-md sm:items-center sm:justify-center">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[32px] border border-white/10 bg-slate-950 p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-cyan-300">
                  Choose your teacher
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  Pick your AI teacher
                </h2>
              </div>

              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-2xl border border-white/10 text-xl text-slate-300 transition hover:bg-white/[0.06]"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teachers.map((item) => {
                const selected = selectedTeacher === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setSelectedTeacher(item.name);
                      setIsTeacherModalOpen(false);
                    }}
                    className={`cursor-pointer overflow-hidden rounded-3xl border text-left transition ${
                      selected
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-white/10 bg-white/[0.04] hover:border-cyan-400/40"
                    }`}
                  >
                    <div className="h-52 overflow-hidden bg-gradient-to-br from-blue-950 to-cyan-950">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-5">
                      <h3 className="text-2xl font-black">{item.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {item.role}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                          {item.accent}
                        </span>
                        <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-slate-300">
                          Video
                        </span>
                        <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-slate-300">
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