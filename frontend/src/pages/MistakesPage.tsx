import { useEffect, useState } from "react";
import api from "../services/api";

type Mistake = {
  _id: string;
  originalText: string;
  correction: string;
  explanation: string;
  type: string;
  reviewed: boolean;
};

const MistakesPage = () => {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMistakes = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/mistakes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMistakes(res.data.mistakes || []);
    } catch (error) {
      console.log("LOAD MISTAKES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const markReviewed = async (mistakeId: string) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/mistakes/${mistakeId}/review`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMistakes((prev) =>
        prev.map((item) =>
          item._id === mistakeId ? { ...item, reviewed: true } : item
        )
      );
    } catch (error) {
      console.log("REVIEW MISTAKE ERROR:", error);
    }
  };

  useEffect(() => {
    loadMistakes();
  }, []);

  return (
    <section className="mx-auto max-w-6xl space-y-6 text-slate-950">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-blue-500">Mistakes Review</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Review your weak points
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
          These are the grammar, vocabulary, and sentence mistakes Lerni AI
          saved from your speaking lessons.
        </p>
      </div>

      {loading && (
        <div className="rounded-[28px] bg-white p-6 text-sm font-bold text-slate-500">
          Loading mistakes...
        </div>
      )}

      {!loading && mistakes.length === 0 && (
        <div className="rounded-[28px] bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            No mistakes yet 🎉
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Start a live lesson and Lerni AI will save your mistakes here.
          </p>
        </div>
      )}

      <div className="grid gap-5">
        {mistakes.map((mistake) => (
          <div
            key={mistake._id}
            className={`rounded-[28px] border p-5 shadow-sm ${
              mistake.reviewed
                ? "border-green-100 bg-green-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">
                  {mistake.type || "general"}
                </span>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl bg-red-50 p-4">
                    <p className="text-xs font-black text-red-500">
                      Your sentence
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-800">
                      {mistake.originalText}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-xs font-black text-blue-500">
                      Correction
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-800">
                      {mistake.correction}
                    </p>
                  </div>

                  {mistake.explanation && (
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-black text-slate-500">
                        Explanation
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {mistake.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => markReviewed(mistake._id)}
                disabled={mistake.reviewed}
                className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                  mistake.reviewed
                    ? "cursor-not-allowed bg-green-100 text-green-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {mistake.reviewed ? "Reviewed" : "Mark Reviewed"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MistakesPage;