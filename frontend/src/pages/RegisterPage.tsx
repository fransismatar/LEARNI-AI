import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import RegisterBg from "../assets/Register-bg.png";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const onboardingAnswers = localStorage.getItem("onboardingAnswers");

      const parsedOnboardingAnswers = onboardingAnswers
        ? JSON.parse(onboardingAnswers)
        : null;

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        onboardingAnswers: parsedOnboardingAnswers,
      });

      setAuthData(res.data.user, res.data.token);
      localStorage.removeItem("onboardingAnswers");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[length:240%] bg-[position:68%_center] bg-no-repeat px-4 py-8 sm:bg-[length:170%] md:bg-[length:140%] lg:bg-[length:110%] lg:bg-[position:75%_center] lg:px-6 lg:py-10"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.98) 0%, rgba(2,6,23,0.88) 48%, rgba(2,6,23,0.55) 100%), url(${RegisterBg})`,
      }}
    >
      <section className="mx-auto grid min-h-[90vh] max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 backdrop-blur-xl">
            Start your journey
          </div>

          <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Create your{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Learni AI
            </span>{" "}
            account
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Build your personal language plan with an AI teacher that remembers your goals.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
        >
          <h2 className="text-3xl font-black text-white">Register</h2>

          <p className="mt-2 text-sm text-slate-400">
            Join Learni AI and start your personalized plan.
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 font-semibold text-white transition hover:bg-white/[0.07]"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Continue with Google
            </button>

            <div className="relative py-2">
              <div className="absolute left-0 top-1/2 h-px w-full bg-white/10" />
              <span className="relative mx-auto block w-fit bg-slate-950 px-4 text-sm text-slate-400">
                OR
              </span>
            </div>

            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <p className="text-sm leading-6 text-slate-400">
              Password must be at least 8 characters and contain 1 capital letter.
            </p>

            <button
              disabled={loading}
              className="w-full cursor-pointer rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <p className="mt-7 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default RegisterPage;