import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

interface ConversationLine {
  speaker: string;
  text: string;
}

interface Lesson {
  _id: string;
  title: string;
  description: string;
  level: string;
  vocabulary: string[];
  grammarFocus: string;
  speakingPrompt: string;
  exampleConversation: ConversationLine[];
  completed: boolean;
  xpReward: number;
}

const LessonDetailsPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  

  const token = localStorage.getItem("token");

  const fetchLesson = async () => {
    const res = await api.get("/lessons", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const foundLesson = res.data.lessons.find(
      (item: Lesson) => item._id === lessonId
    );

    setLesson(foundLesson || null);
  };

  useEffect(() => {
    fetchLesson();
  }, []);

  const completeLesson = async () => {
    if (!lesson) return;

    await api.put(
      `/lessons/${lesson._id}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    navigate("/lessons");
  };

  if (!lesson) {
    return <p className="text-slate-600">Loading lesson...</p>;
  }

  return (
    <section className="space-y-8">
      <button
        onClick={() => navigate("/lessons")}
        className="text-sm font-semibold text-cyan-300"
      >
        ← Back to lessons
      </button>

     <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-cyan-300">{lesson.level}</p>
        <h1 className="mt-3 text-5xl font-black">{lesson.title}</h1>
       <p className="mt-4 max-w-3xl text-slate-500">{lesson.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
       <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Vocabulary</h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {lesson.vocabulary.map((word) => (
              <span
                key={word}
                className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-blue-600 font-bold"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Grammar Focus</h2>
         <p className="mt-4 text-slate-600">{lesson.grammarFocus}</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold">Example Conversation</h2>

        <div className="mt-6 space-y-4">
          {lesson.exampleConversation.map((line, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-slate-900 p-4"
            >
              <p className="text-sm font-semibold text-cyan-300">
                {line.speaker}
              </p>
             <p className="mt-2 text-slate-700">{line.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold">Speaking Practice</h2>

       <p className="mt-4 text-slate-600">{lesson.speakingPrompt}</p>

        <textarea
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          placeholder="Write your answer here..."
          className="mt-6 min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-blue-500"
        />

        {feedback && (
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-slate-800">
            {feedback}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => setFeedback("AI feedback will be connected in the next step.")}
            disabled={!studentAnswer.trim()}
            className="flex-1 rounded-2xl border border-blue-200 px-6 py-4 font-bold text-blue-600 transition hover:bg-blue-50 disabled:opacity-40"
          >
            Get AI Feedback
          </button>

          <button
            onClick={completeLesson}
            className="flex-1 rounded-2xl bg-blue-500 px-6 py-4 font-bold text-white transition hover:bg-blue-600"
          >
            Complete Lesson +{lesson.xpReward} XP
          </button>
        </div>
      </div>
    </section>
  );
};

export default LessonDetailsPage;