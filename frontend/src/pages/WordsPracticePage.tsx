import { useMemo, useState } from "react";
import { wordLessons } from "../data/wordLessons";

const levels = ["A1-A2", "B1-B2", "C1-C2"];

const WordsPracticePage = () => {
  const [selectedLevel, setSelectedLevel] = useState("A1-A2");
  const [selectedTopic, setSelectedTopic] = useState("All");

  const topics = useMemo(() => {
    const filtered = wordLessons.filter(
      (item) => item.level === selectedLevel
    );

    return [
      "All",
      ...new Set(filtered.map((item) => item.topic)),
    ];
  }, [selectedLevel]);

  const filteredLessons = useMemo(() => {
    return wordLessons.filter((item) => {
      const levelMatch = item.level === selectedLevel;

      const topicMatch =
        selectedTopic === "All"
          ? true
          : item.topic === selectedTopic;

      return levelMatch && topicMatch;
    });
  }, [selectedLevel, selectedTopic]);

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold text-blue-500">
          Speaking & Vocabulary
        </p>

        <h1 className="mt-3 text-4xl font-black text-slate-950">
          Words Practice
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
          Practice vocabulary, pronunciation, and useful daily sentences with AI.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => {
              setSelectedLevel(level);
              setSelectedTopic("All");
            }}
            className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
              selectedLevel === level
                ? "bg-blue-500 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
              selectedTopic === topic
                ? "bg-slate-950 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredLessons.map((item) => (
          <div
            key={item.id}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-500">
                {item.topic}
              </span>

              <span className="text-xs font-bold text-slate-400">
                {item.level}
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-black text-slate-950">
              {item.word}
            </h2>

            <p className="mt-2 text-lg font-bold text-slate-500">
              {item.meaning}
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm leading-7 text-slate-700">
                {item.example}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-600">
                Listen
              </button>

              <button className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-blue-300">
                Repeat
              </button>
            </div>

            <button className="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800">
              Done
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WordsPracticePage;