import { useState, type ElementType } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Plane,
  GraduationCap,
  Heart,
  Building2,
  Sparkles,
  Code2,
  Landmark,
  BookOpen,
  Megaphone,
  Stethoscope,
  Coffee,
  Laptop,
  MessageCircle,
  Film,
  Dumbbell,
  Utensils,
  Globe2,
  Mic,
  Headphones,
  Brain,
  Check,
  Circle,
  ArrowLeft,
  Bot,
  Hotel,
  MapPin,
  ShoppingBag,
  AlertCircle,
  Users,
  Target,
  PenTool,
  UserCheck,
  Smile,
  MoreHorizontal,
  Presentation,
  Mail,
  School,
  ClipboardCheck,
  Handshake,
  Home,
  Phone,
  Calendar,
  Route,
} from "lucide-react";

import HomeBackground from "../assets/HomeBackground.png";

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
      "Other",
    ],
  },

  {
    id: "travelPurpose",
    title: "What is your main travel goal?",
    type: "single",
    options: [
      "Vacation",
      "Airport and flights",
      "Hotels and restaurants",
      "Ask for directions",
      "Shopping abroad",
      "Emergency help",
    ],
  },
  {
    id: "travelSituations",
    title: "Which travel conversations do you want to practice?",
    subtitle: "Select all that fit your travel needs.",
    type: "multi",
    options: [
      "Airport conversations",
      "Hotel check-in",
      "Restaurants and cafes",
      "Asking for directions",
      "Shopping",
      "Emergency situations",
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
    id: "careerSituations",
    title: "What career situations do you want to improve?",
    type: "multi",
    options: [
      "Job interviews",
      "Work meetings",
      "Emails and messages",
      "Presentations",
      "Speaking with coworkers",
      "Professional vocabulary",
    ],
  },

  {
    id: "studyType",
    title: "Where do you need English for study?",
    type: "single",
    options: [
      "School",
      "University",
      "Online course",
      "Exams",
      "Academic reading",
      "Self study",
    ],
  },
  {
    id: "studySituations",
    title: "What study skills do you want to practice?",
    type: "multi",
    options: [
      "Reading articles",
      "Writing assignments",
      "Class discussions",
      "Exams preparation",
      "Academic vocabulary",
      "Understanding lessons",
    ],
  },

  {
    id: "businessType",
    title: "What type of business English do you need?",
    type: "single",
    options: [
      "Clients",
      "Sales",
      "Meetings",
      "Negotiations",
      "Emails",
      "Networking",
    ],
  },
  {
    id: "businessSituations",
    title: "What business skills do you want to practice?",
    type: "multi",
    options: [
      "Client conversations",
      "Sales calls",
      "Negotiations",
      "Business emails",
      "Networking",
      "Presenting ideas",
    ],
  },

  {
    id: "familySituations",
    title: "What family or social situations do you want to practice?",
    type: "multi",
    options: [
      "Daily conversations",
      "Video calls",
      "Small talk",
      "Understanding relatives",
      "Text messages",
      "Making new friends",
    ],
  },

  {
    id: "growthSituations",
    title: "What personal growth goal fits you best?",
    type: "multi",
    options: [
      "Build confidence",
      "Speak naturally",
      "Improve thinking in English",
      "Learn new words daily",
      "Understand content online",
      "Create a strong routine",
    ],
  },

  {
    id: "otherGoal",
    title: "What do you want your AI teacher to focus on?",
    type: "multi",
    options: [
      "Daily conversation",
      "Better pronunciation",
      "Grammar mistakes",
      "New vocabulary",
      "Confidence",
      "Custom lessons",
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

const optionIcons: Record<string, ElementType> = {
  "Career and job": Briefcase,
  Travel: Plane,
  Study: GraduationCap,
  "Family and friends": Heart,
  Business: Building2,
  "Personal growth": Sparkles,
  Other: MoreHorizontal,

  Vacation: Route,
  "Airport and flights": Plane,
  "Hotels and restaurants": Hotel,
  "Ask for directions": MapPin,
  "Shopping abroad": ShoppingBag,
  "Emergency help": AlertCircle,
  "Airport conversations": Plane,
  "Hotel check-in": Hotel,
  "Restaurants and cafes": Coffee,
  "Asking for directions": MapPin,
  Shopping: ShoppingBag,
  "Emergency situations": AlertCircle,

  Technology: Code2,
  "Finance & Business": Landmark,
  Education: BookOpen,
  "Marketing & Sales": Megaphone,
  Healthcare: Stethoscope,
  "Service & Hospitality": Coffee,
  Freelance: Laptop,
  "Job interviews": UserCheck,
  "Work meetings": Users,
  "Emails and messages": Mail,
  Presentations: Presentation,
  "Speaking with coworkers": Users,
  "Professional vocabulary": BookOpen,

  School,
  University: GraduationCap,
  "Online course": Laptop,
  Exams: ClipboardCheck,
  "Academic reading": BookOpen,
  "Self study": Brain,
  "Reading articles": BookOpen,
  "Writing assignments": PenTool,
  "Class discussions": MessageCircle,
  "Exams preparation": Target,
  "Academic vocabulary": Brain,
  "Understanding lessons": Headphones,

  Clients: Users,
  Sales: Megaphone,
  Meetings: Users,
  Negotiations: Handshake,
  Emails: Mail,
  Networking: Users,
  "Client conversations": MessageCircle,
  "Sales calls": Phone,
  "Business emails": Mail,
  "Presenting ideas": Sparkles,

  "Daily conversations": Home,
  "Video calls": Phone,
  "Small talk": Smile,
  "Understanding relatives": Heart,
  "Text messages": MessageCircle,
  "Making new friends": Users,

  "Build confidence": Sparkles,
  "Speak naturally": Mic,
  "Improve thinking in English": Brain,
  "Learn new words daily": BookOpen,
  "Understand content online": Globe2,
  "Create a strong routine": Calendar,

  "Daily conversation": MessageCircle,
  "Better pronunciation": Mic,
  "Grammar mistakes": Brain,
  "New vocabulary": BookOpen,
  "Custom lessons": Bot,

  Speaking: Mic,
  Listening: Headphones,
  Vocabulary: BookOpen,
  Grammar: Brain,
  Pronunciation: Mic,
  Confidence: Sparkles,

  Movies: Film,
  Sports: Dumbbell,
  Food: Utensils,
  Culture: Globe2,
  "Daily life": Coffee,
};

const goalQuestionIds: Record<string, string[]> = {
  Travel: ["travelPurpose", "travelSituations"],
  "Career and job": ["workField", "careerSituations"],
  Study: ["studyType", "studySituations"],
  Business: ["businessType", "businessSituations"],
  "Family and friends": ["familySituations"],
  "Personal growth": ["growthSituations"],
  Other: ["otherGoal"],
};

const branchQuestionIds = [
  "travelPurpose",
  "travelSituations",
  "workField",
  "careerSituations",
  "studyType",
  "studySituations",
  "businessType",
  "businessSituations",
  "familySituations",
  "growthSituations",
  "otherGoal",
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const shouldShowQuestion = (question: Question) => {
    const mainGoal = answers.mainGoal as string | undefined;

    if (branchQuestionIds.includes(question.id)) {
      return goalQuestionIds[mainGoal || ""]?.includes(question.id) || false;
    }

    return true;
  };

  const visibleQuestions = questions.filter(shouldShowQuestion);
  const currentQuestion = visibleQuestions[step];
  const progress = ((step + 1) / visibleQuestions.length) * 100;
  const currentAnswer = answers[currentQuestion.id];

  const selectSingle = (value: string) => {
    setAnswers((prev) => {
      if (currentQuestion.id === "mainGoal") {
        const cleanAnswers = { ...prev };

        branchQuestionIds.forEach((id) => {
          delete cleanAnswers[id];
        });

        return {
          ...cleanAnswers,
          mainGoal: value,
        };
      }

      return {
        ...prev,
        [currentQuestion.id]: value,
      };
    });
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

  const hasAnswer = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : Boolean(currentAnswer);

  const canContinue =
    currentQuestion.type === "info" ||
    currentQuestion.type === "loading" ||
    hasAnswer;

  const handleNext = () => {
    if (currentQuestion.type === "loading") {
      localStorage.setItem("onboardingAnswers", JSON.stringify(answers));
      navigate("/register");
      return;
    }

    if (step < visibleQuestions.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[length:260%] bg-[position:65%_center] bg-no-repeat px-4 py-6 sm:bg-[length:190%] md:bg-[length:150%] lg:bg-[length:120%] lg:bg-[position:75%_center] lg:px-6 lg:py-10"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.98) 0%, rgba(2,6,23,0.88) 55%, rgba(2,6,23,0.55) 100%), url(${HomeBackground})`,
      }}
    >
      <section className="mx-auto flex min-h-[calc(100vh-48px)] max-w-3xl flex-col">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-slate-950/50 text-slate-300 backdrop-blur-xl transition hover:border-cyan-400/50 hover:text-white disabled:opacity-25"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>
                Step {step + 1} of {visibleQuestions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-[32px] border border-white/10 bg-slate-950/65 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <Bot size={28} />
            </div>

            <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">
              {currentQuestion.title}
            </h1>

            {currentQuestion.subtitle && (
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                {currentQuestion.subtitle}
              </p>
            )}
          </div>

          <div className="mt-8">
            {currentQuestion.type === "select" && (
              <select
                value={(currentAnswer as string) || ""}
                onChange={(e) => selectSingle(e.target.value)}
                className="w-full cursor-pointer rounded-2xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400"
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
                  const Icon = optionIcons[option] || Circle;

                  return (
                    <button
                      key={option}
                      onClick={() => selectSingle(option)}
                      className={`group flex cursor-pointer items-center gap-4 rounded-3xl border p-4 text-left transition ${
                        selected
                          ? "border-cyan-300 bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-400/20"
                          : "border-white/10 bg-white/[0.04] text-white hover:border-cyan-400/60 hover:bg-white/[0.07]"
                      }`}
                    >
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                          selected
                            ? "bg-slate-950/10"
                            : "bg-cyan-400/10 text-cyan-300"
                        }`}
                      >
                        <Icon size={22} />
                      </span>

                      <span className="font-semibold">{option}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "multi" && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => {
                  const selected =
                    Array.isArray(currentAnswer) && currentAnswer.includes(option);
                  const Icon = optionIcons[option] || Circle;

                  return (
                    <button
                      key={option}
                      onClick={() => toggleMulti(option)}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                        selected
                          ? "border-cyan-300 bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/10"
                          : "border-white/10 bg-white/[0.04] text-white hover:border-cyan-400/60 hover:bg-white/[0.07]"
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                            selected
                              ? "bg-slate-950/10"
                              : "bg-cyan-400/10 text-cyan-300"
                          }`}
                        >
                          <Icon size={20} />
                        </span>

                        <span className="font-semibold">{option}</span>
                      </span>

                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full border ${
                          selected
                            ? "border-slate-950/20 bg-slate-950/10"
                            : "border-white/20"
                        }`}
                      >
                        {selected ? <Check size={17} /> : <Circle size={12} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "info" && (
              <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-cyan-400/10 text-cyan-300">
                  <Bot size={42} />
                </div>

                <p className="mt-6 text-lg leading-8 text-slate-200">
                  Your lessons will be based on your level, goals, weak points,
                  and daily practice time.
                </p>
              </div>
            )}

            {currentQuestion.type === "loading" && (
              <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                {[
                  "Analyzing your goals",
                  "Creating speaking practice",
                  "Building vocabulary path",
                  "Preparing your AI teacher",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl bg-slate-950/40 px-4 py-4"
                  >
                    <span className="text-sm text-slate-200 sm:text-base">
                      {item}
                    </span>

                    <span className="text-sm font-bold text-cyan-300">
                      {index < 2 ? "Done" : "Loading..."}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-auto pt-8">
            <button
              disabled={!canContinue}
              onClick={handleNext}
              className="w-full cursor-pointer rounded-2xl bg-cyan-400 px-6 py-4 text-lg font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {currentQuestion.type === "loading" ? "Save my plan" : "Continue"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OnboardingPage;