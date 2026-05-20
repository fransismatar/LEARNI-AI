import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const teachers = [
  { name: "Learni-X", role: "Friendly AI teacher" },
  { name: "Maya", role: "Calm conversation coach" },
  { name: "Adam", role: "Professional speaking coach" },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const profile = user?.learningProfile || {};
  const [selectedTeacher, setSelectedTeacher] = useState("Learni-X");

  return (
    <section className="mx-auto max-w-5xl space-y-6">
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
            to="/avatar-teacher"
            className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300"
          >
            Start Lesson
          </Link>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-6 py-4 text-center font-bold text-cyan-300">
            5 min free practice
          </div>
        </div>
      </div>

      <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
        <p className="text-sm font-bold text-cyan-300">Choose your teacher</p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {teachers.map((teacher) => {
            const selected = selectedTeacher === teacher.name;

            return (
              <button
                key={teacher.name}
                onClick={() => setSelectedTeacher(teacher.name)}
                className={`cursor-pointer rounded-3xl border p-5 text-left transition ${
                  selected
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-white/10 bg-slate-950/50 hover:border-cyan-400/40"
                }`}
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400/10 text-xl font-black text-cyan-300">
                  {teacher.name.charAt(0)}
                </div>

                <h2 className="mt-4 text-2xl font-black">{teacher.name}</h2>
                <p className="mt-2 text-sm text-slate-400">{teacher.role}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
        <p className="text-sm font-bold text-cyan-300">Today’s path</p>

        <div className="mt-5 grid gap-3">
          {[
            "Warm up conversation",
            "New vocabulary",
            "Speaking practice",
            "AI corrections",
          ].map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 text-sm font-black text-slate-950">
                {index + 1}
              </div>

              <p className="font-bold">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;