import { useState } from "react";
import { useNavigate } from "react-router-dom";

type AnswerValue = string | string[];

type Question = {
  id: string;
  title: string;
  subtitle?: string;
  type: "single" | "multi" | "select" | "info" | "loading";
  options?: string[];
};

const questions: Question[] = [
  {
    id: "ageRange",
    title: "Let's personalize your English journey",
    subtitle: "Choose your age range to start your learning profile.",
    type: "single",
    options: ["18–24", "25–34", "35–44", "45+"],
  },
  {
    id: "nativeLanguage",
    title: "What is your native language?",
    type: "select",
    options: ["Arabic", "Hebrew", "English", "Russian", "French", "Spanish", "Other"],
  },

  {
  id: "targetLanguage",
  title: "What language do you want to learn?",
  type: "select",
  options: ["English", "Hebrew", "Arabic", "Spanish", "French", "German", "Italian"],
},
  {
    id: "englishLevel",
    title: "What is your current English level?",
    type: "single",
    options: [
      "Beginner",
      "Pre Intermediate",
      "Intermediate",
      "Upper Intermediate",
      "Advanced",
      "Fluent",
    ],
  },
  {
    id: "mainGoal",
    title: "Why do you want to improve your English?",
    type: "single",
    options: [
      "Career and job",
      "Travel",
      "Study",
      "Family and friends",
      "Business",
      "Personal growth",
    ],
  },
  {
    id: "workField",
    title: "What kind of work do you do?",
    type: "single",
    options: [
      "Technology",
      "Finance & Business",
      "Education",
      "Marketing & Sales",
      "Healthcare",
      "Service & Hospitality",
      "Freelance",
      "Other",
    ],
  },
  {
    id: "targetResult",
    title: "What result do you want to achieve?",
    type: "single",
    options: [
      "Speak confidently",
      "Understand movies and videos",
      "Read English easily",
      "Improve work conversations",
      "Prepare for interviews",
      "Become fluent",
    ],
  },
  {
    id: "speakingProblems",
    title: "Which problems describe you?",
    subtitle: "Select all that apply.",
    type: "multi",
    options: [
      "I understand but cannot speak",
      "I forget words while speaking",
      "I make grammar mistakes",
      "I don't understand fast English",
      "I need someone to practice with",
      "I want better pronunciation",
    ],
  },
  {
    id: "improveAreas",
    title: "What areas do you want to improve?",
    type: "multi",
    options: ["Speaking", "Listening", "Vocabulary", "Grammar", "Pronunciation", "Confidence"],
  },
  {
    id: "dailyGoal",
    title: "What is your daily practice goal?",
    type: "single",
    options: ["5 min/day", "10 min/day", "15 min/day", "30 min/day"],
  },
  {
    id: "interests",
    title: "What topics do you like?",
    subtitle: "This helps your AI teacher create better lessons.",
    type: "multi",
    options: [
      "Business",
      "Technology",
      "Travel",
      "Movies",
      "Sports",
      "Food",
      "Culture",
      "Daily life",
    ],
  },
  {
    id: "aiIntro",
    title: "Your AI teacher will build lessons around your goals",
    subtitle: "Practice real conversations, get corrections, and improve step by step.",
    type: "info",
  },
  {
    id: "loading",
    title: "Creating your personal learning plan...",
    type: "loading",
  },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const currentAnswer = answers[currentQuestion.id];

  const selectSingle = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const toggleMulti = (value: string) => {
    const oldValues = Array.isArray(currentAnswer) ? currentAnswer : [];

    const exists = oldValues.includes(value);

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: exists
        ? oldValues.filter((item) => item !== value)
        : [...oldValues, value],
    }));
  };

  const canContinue =
    currentQuestion.type === "info" ||
    currentQuestion.type === "loading" ||
    Boolean(currentAnswer);

  const handleNext = () => {
    if (currentQuestion.type === "loading") {
      localStorage.setItem("onboardingAnswers", JSON.stringify(answers));
      navigate("/register");
      return;
    }

    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <section className="mx-auto flex min-h-[78vh] max-w-2xl flex-col">
      <div className="mb-10 flex items-center gap-4">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className="text-2xl text-slate-400 transition hover:text-white disabled:opacity-20"
        >
          ←
        </button>

        <div className="h-2 flex-1 rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-cyan-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="text-center">
          <h1 className="text-4xl font-black leading-tight text-white">
            {currentQuestion.title}
          </h1>

          {currentQuestion.subtitle && (
            <p className="mx-auto mt-4 max-w-md text-slate-300">
              {currentQuestion.subtitle}
            </p>
          )}
        </div>

        <div className="mt-10">
          {currentQuestion.type === "select" && (
            <select
              value={(currentAnswer as string) || ""}
              onChange={(e) => selectSingle(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-white outline-none focus:border-cyan-400"
            >
              <option value="">Choose language</option>
              {currentQuestion.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {currentQuestion.type === "single" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {currentQuestion.options?.map((option) => {
                const selected = currentAnswer === option;

                return (
                  <button
                    key={option}
                    onClick={() => selectSingle(option)}
                    className={`rounded-3xl border p-5 text-left text-lg font-semibold transition ${
                      selected
                        ? "border-cyan-400 bg-cyan-400 text-slate-950"
                        : "border-white/10 bg-white/[0.04] text-white hover:border-cyan-400/60"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === "multi" && (
            <div className="space-y-4">
              {currentQuestion.options?.map((option) => {
                const selected =
                  Array.isArray(currentAnswer) && currentAnswer.includes(option);

                return (
                  <button
                    key={option}
                    onClick={() => toggleMulti(option)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left text-lg transition ${
                      selected
                        ? "border-cyan-400 bg-cyan-400 text-slate-950"
                        : "border-white/10 bg-white/[0.04] text-white hover:border-cyan-400/60"
                    }`}
                  >
                    <span>{option}</span>
                    <span>{selected ? "✓" : "○"}</span>
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === "info" && (
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
              <div className="text-6xl">🤖</div>
              <p className="mt-6 text-lg text-slate-200">
                Your lessons will be based on your level, goals, work field,
                weak points, and daily practice time.
              </p>
            </div>
          )}

          {currentQuestion.type === "loading" && (
            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              {[
                "Analyzing your goals",
                "Creating speaking practice",
                "Building vocabulary path",
                "Preparing your AI teacher",
              ].map((item, index) => (
                <div key={item} className="flex items-center justify-between">
                  <span className="text-slate-200">{item}</span>
                  <span className="text-cyan-300">
                    {index < 2 ? "Done" : "Loading..."}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto pt-10">
          <button
            disabled={!canContinue}
            onClick={handleNext}
            className="w-full rounded-2xl bg-cyan-400 px-6 py-4 text-lg font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {currentQuestion.type === "loading"
              ? "Save my plan"
              : step === questions.length - 1
              ? "Continue"
              : "Continue"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default OnboardingPage;