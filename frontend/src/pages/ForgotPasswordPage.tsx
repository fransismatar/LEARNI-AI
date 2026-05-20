import { useState } from "react";
import api from "../services/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "Reset link sent to your email");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-md items-center">
      <form onSubmit={handleSubmit} className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <h1 className="text-3xl font-black">Forgot password?</h1>
        <p className="mt-3 text-slate-300">Enter your email and we’ll send you a reset link.</p>

        {message && <div className="mt-5 rounded-xl bg-cyan-400/10 px-4 py-3 text-cyan-300">{message}</div>}
        {error && <div className="mt-5 rounded-xl bg-red-500/10 px-4 py-3 text-red-300">{error}</div>}

        <input
          className="mt-6 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-white outline-none focus:border-cyan-400"
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button disabled={loading} className="mt-5 w-full rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 disabled:opacity-60">
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </section>
  );
};

export default ForgotPasswordPage;