import { Link, Navigate } from "react-router-dom";

const HomePage = () => {
 const token = localStorage.getItem("token");

if (token) {
  return <Navigate to="/dashboard" replace />;
}
  return (
    <section className="grid min-h-[75vh] items-center gap-12 lg:grid-cols-2">
      <div className="max-w-2xl">
        <div className="mb-6 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
          AI language learning platform
        </div>

        <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
          Learn languages with your own{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            AI teacher
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
          Build a personal learning plan, practice speaking, correct grammar,
          and improve pronunciation with an AI teacher that remembers your goals.
        </p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <Link
           to="/onboarding"
            className="rounded-2xl bg-cyan-400 px-7 py-4 text-center font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300"
          >
            Start Learning
          </Link>

          <Link
            to="/login"
            className="rounded-2xl border border-white/10 px-7 py-4 text-center font-semibold text-white transition hover:bg-white/10"
          >
            I already have an account
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
        <div className="rounded-2xl bg-slate-900 p-6">
          <p className="text-sm text-cyan-300">Today’s lesson</p>
          <h2 className="mt-3 text-2xl font-bold">English for Work</h2>
          <p className="mt-3 text-slate-300">
            Practice real conversations for interviews, meetings, and daily work.
          </p>

          <div className="mt-6 space-y-3">
            {["Speaking practice", "Grammar correction", "Personal plan"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-200"
                >
                  ✅ {item}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;