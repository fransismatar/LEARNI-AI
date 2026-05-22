import { Link, Navigate } from "react-router-dom";
import HomeBackground from "../assets/bg-2.png";

const HomePage = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main
    className="relative min-h-screen overflow-hidden bg-no-repeat px-5 py-8
bg-[length:250%] bg-[position:92%_top]
sm:bg-[length:220%] sm:bg-[position:95%_top]
md:bg-[length:180%] md:bg-[position:95%_top]
lg:bg-[length:132%] lg:bg-[position:92%_center] lg:px-6 lg:py-16
xl:bg-[length:118%] xl:bg-[position:90%_center]
2xl:bg-cover 2xl:bg-[position:center]"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.98) 0%, rgba(2,6,23,0.90) 36%, rgba(2,6,23,0.45) 68%, rgba(2,6,23,0.18) 100%), url(${HomeBackground})`,
      }}
    >
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-end pt-[340px] sm:pt-[420px] md:pt-[520px] lg:grid lg:grid-cols-2 lg:items-center lg:pt-0">
        <div className="relative z-10 max-w-xl">
          <div className="mb-5 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-300 backdrop-blur-md sm:text-sm">
            AI language learning platform
          </div>

          <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Learn languages with your own{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              AI teacher
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200 sm:text-base md:text-lg">
            Build a personal learning plan, practice speaking, correct grammar,
            and improve pronunciation with an AI teacher that remembers your goals.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/onboarding"
              className="rounded-2xl bg-cyan-400 px-7 py-4 text-center font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300 sm:min-w-40"
            >
              Start Learning
            </Link>

            <Link
              to="/login"
              className="rounded-2xl border border-white/10 bg-slate-950/50 px-7 py-4 text-center font-semibold text-white backdrop-blur-md transition hover:bg-white/10 sm:min-w-56"
            >
              I already have an account
            </Link>
          </div>
        </div>

        <div />
      </section>
    </main>
  );
};

export default HomePage;