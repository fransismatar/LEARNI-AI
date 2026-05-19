import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

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
    <section className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-10 lg:grid-cols-2">
      <div>
        <p className="text-sm font-semibold text-cyan-300">Start your journey</p>
        <h1 className="mt-4 text-5xl font-black">Create your account</h1>
        <p className="mt-5 max-w-md text-slate-300">
          Build your personal language plan with an AI teacher that remembers your goals.
        </p>
      </div>

      <form
        onSubmit={handleRegister}
        className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold">Register</h2>

        {error && (
          <div className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-white outline-none focus:border-cyan-400"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-white outline-none focus:border-cyan-400"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-white outline-none focus:border-cyan-400"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="text-sm text-slate-400">
            Password must be at least 8 characters and contain 1 capital letter.
          </p>          

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-cyan-300">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default RegisterPage;