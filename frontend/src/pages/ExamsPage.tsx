import { useState } from "react";
import api from "../services/api";

type ExamQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

type Exam = {
  title: string;
  level: string;
  topic: string;
  questions: ExamQuestion[];
};

type ExamResult = {
  score: number;
  correctCount: number;
  total: number;
  results: {
    id: number;
    question: string;
    correctAnswer: string;
    studentAnswer: string;
    isCorrect: boolean;
  }[];
};

const ExamsPage = () => {
  const [topic, setTopic] = useState("");
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const generateExam = async (mode: "daily" | "custom") => {
    try {
      setLoading(true);
      setResult(null);
      setAnswers({});
      setExam(null);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/exams/generate",
        { topic, mode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExam(res.data.exam);
    } catch (error) {
      console.log(error);
      alert("Failed to generate exam");
    } finally {
      setLoading(false);
    }
  };

  const submitExam = async () => {
    if (!exam) return;

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/exams/submit",
        {
          questions: exam.questions,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to submit exam");
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <section className="mx-auto max-w-7xl space-y-6 text-slate-950">
      <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-black text-blue-600">AI Exams</p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Test your English with AI
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Start an exam from today’s lesson, or create a custom exam by
              topic. The daily exam uses what the student learned today.
            </p>
          </div>

          <div className="rounded-[28px] bg-slate-50 p-4 sm:p-5">
            <p className="text-sm font-black text-slate-700">
              Today’s Lesson Exam
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Test yourself on today’s speaking task, vocabulary, story, and
              quiz.
            </p>

            <button
              onClick={() => generateExam("daily")}
              disabled={loading}
              className="mt-4 w-full rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Generating exam..." : "Start Today’s Lesson Exam"}
            </button>

            <div className="mt-5 border-t border-slate-200 pt-5">
              <label className="text-sm font-black text-slate-700">
                Custom exam topic
              </label>

              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Example: travel, work, school, grammar..."
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold outline-none transition focus:border-blue-400"
              />

              <button
                onClick={() => generateExam("custom")}
                disabled={loading}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Generate Custom Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      {exam && (
        <div className="rounded-[34px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black text-blue-600">
                {exam.level} Exam
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-950">
                {exam.title}
              </h2>

              <p className="mt-2 text-sm font-bold text-slate-400">
                Topic: {exam.topic}
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 px-5 py-3 text-sm font-black text-blue-600">
              {answeredCount}/{exam.questions.length} answered
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {exam.questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-5"
              >
                <p className="text-sm font-black text-blue-600">
                  Question {index + 1}
                </p>

                <h3 className="mt-2 text-lg font-black text-slate-950">
                  {question.question}
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const selected = answers[question.id] === option;

                    return (
                      <button
                        key={option}
                        onClick={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: option,
                          }))
                        }
                        disabled={!!result}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                          selected
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {result && (
                  <div
                    className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${
                      result.results.find((item) => item.id === question.id)
                        ?.isCorrect
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    Correct answer: {question.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!result && (
            <button
              onClick={submitExam}
              disabled={submitting || answeredCount !== exam.questions.length}
              className="mt-6 w-full rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Checking answers..." : "Submit Exam"}
            </button>
          )}
        </div>
      )}

      {result && (
        <div className="rounded-[34px] border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-7">
          <p className="text-sm font-black text-blue-600">Your Result</p>

          <h2 className="mt-3 text-5xl font-black text-slate-950">
            {result.score}%
          </h2>

          <p className="mt-3 text-sm font-bold text-slate-500">
            {result.correctCount}/{result.total} correct answers
          </p>

          <button
            onClick={() => generateExam("daily")}
            className="mt-6 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
          >
            Generate New Daily Exam
          </button>
        </div>
      )}
    </section>
  );
};

export default ExamsPage;