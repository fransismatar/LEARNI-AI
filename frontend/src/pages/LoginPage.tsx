import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import RegisterBg from "../assets/Register-bg.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      setAuthData(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string | undefined) => {
    if (!credential) {
      setError("Google login failed");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/google", {
        credential,
      });

      setAuthData(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[length:220%] bg-[position:70%_center] bg-no-repeat px-4 py-8 sm:bg-[length:160%] lg:bg-[length:110%]"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.97) 0%, rgba(2,6,23,0.88) 45%, rgba(2,6,23,0.55) 100%), url(${RegisterBg})`,
      }}
    >
      <section className="mx-auto grid min-h-[90vh] max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 backdrop-blur-xl">
            Welcome back
          </div>

          <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-6xl">
            Continue learning with your{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              AI Teacher
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
            Continue your learning plan and practice real conversations with Lerni AI.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
        >
          <h2 className="text-3xl font-black text-white">Login</h2>

          <p className="mt-2 text-slate-400">
            Access your personal learning journey.
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
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

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                Forgot password?
              </Link>
            </div>

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="relative py-2">
              <div className="absolute left-0 top-1/2 h-px w-full bg-white/10" />

              <span className="relative mx-auto block w-fit bg-slate-950 px-4 text-sm text-slate-400">
                OR
              </span>
            </div>

            <div className="flex justify-center overflow-hidden rounded-2xl bg-white p-1">
              <GoogleLogin
                onSuccess={(credentialResponse) =>
                  handleGoogleSuccess(credentialResponse.credential)
                }
                onError={() => {
                  setError("Google login failed");
                }}
                theme="filled_black"
                size="large"
                width="100%"
                text="continue_with"
              />
            </div>
          </div>

          <p className="mt-7 text-center text-sm text-slate-400">
            New here?{" "}
            <Link to="/onboarding" className="font-semibold text-cyan-300">
              Create account
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;