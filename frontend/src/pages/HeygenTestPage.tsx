import { useState } from "react";
import api from "../services/api";

const HeygenTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const testToken = async () => {
    try {
      setLoading(true);
      setResult("");

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/heygen/token",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("HeyGen token response:", res.data);
      setResult(JSON.stringify(res.data, null, 2));
    } catch (error: any) {
      console.log(error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6 p-6 text-white">
      <div className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6">
        <p className="text-sm font-bold text-cyan-300">HeyGen Test</p>
        <h1 className="mt-3 text-4xl font-black">LiveAvatar Token Test</h1>
        <p className="mt-3 text-slate-400">
          First we test if backend can get a HeyGen token.
        </p>
      </div>

      <button
        onClick={testToken}
        disabled={loading}
        className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 disabled:opacity-60"
      >
        {loading ? "Testing..." : "Test HeyGen Token"}
      </button>

      {result && (
        <pre className="overflow-auto rounded-3xl border border-white/10 bg-slate-950 p-5 text-sm text-slate-300">
          {result}
        </pre>
      )}
    </section>
  );
};

export default HeygenTestPage;