import { Link, Navigate } from "react-router-dom";
import HomeBackground from "../assets/HomeBackground.png";

const HomePage = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main
      className="relative h-screen overflow-x-hidden bg-[length:260%] bg-[position:62%_center] bg-no-repeat px-5 py-10 sm:bg-[length:190%] sm:bg-[position:65%_center] md:bg-[length:150%] lg:bg-[length:120%] lg:bg-[position:75%_center] lg:px-6 lg:py-16"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.96) 0%, rgba(2,6,23,0.78) 48%, rgba(2,6,23,0.35) 100%), url(${HomeBackground})`,
      }}
    >
      <section className="mx-auto grid h-full max-w-7xl items-center lg:grid-cols-2">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-300 backdrop-blur-md sm:text-sm">
            AI language learning platform
          </div>

          <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-7xl">
            Learn languages with your own{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              AI teacher
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base md:text-lg">
            Build a personal learning plan, practice speaking, correct grammar,
            and improve pronunciation with an AI teacher that remembers your goals.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/onboarding"
              className="rounded-2xl bg-cyan-400 px-6 py-3.5 text-center font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300"
            >
              Start Learning
            </Link>

            <Link
              to="/login"
              className="rounded-2xl border border-white/10 bg-slate-950/40 px-6 py-3.5 text-center font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
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