import { useMemo, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaBookOpen,
  FaBriefcase,
  FaCheckCircle,
  FaGraduationCap,
  FaHeadphones,
  FaPlane,
  FaRegBuilding,
  FaUsers,
} from "react-icons/fa";
import { storyLessons } from "../data/stories";
import api from "../services/api";

const levels = ["A1-A2", "B1-B2", "C1-C2"];

const categories = [
  { label: "Travel", icon: FaPlane },
  { label: "Daily life", icon: FaBookOpen },
  { label: "Business", icon: FaRegBuilding },
  { label: "Career", icon: FaBriefcase },
  { label: "Social", icon: FaUsers },
  { label: "Study", icon: FaGraduationCap },
];

type Result = {
  score: number;
  expected: string;
  said: string;
  message: string;
};

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .replace(/[.,!?؟]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const getScore = (expected: string, said: string) => {
  const a = normalizeText(expected).split(" ");
  const b = normalizeText(said).split(" ");
  const matched = a.filter((word) => b.includes(word)).length;

  return Math.round((matched / Math.max(a.length, 1)) * 100);
};

const StoriesPage = () => {
  const [selectedLevel, setSelectedLevel] = useState("A1-A2");
  const [selectedCategory, setSelectedCategory] = useState("Travel");
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [completedStories, setCompletedStories] = useState<string[]>(() => {
  return JSON.parse(localStorage.getItem("completedStories") || "[]");
});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const filteredStories = useMemo(() => {
    return storyLessons.filter(
      (story) =>
        story.level === selectedLevel && story.category === selectedCategory
    );
  }, [selectedLevel, selectedCategory]);

  const selectedStory =
    storyLessons.find((story) => story.id === selectedStoryId) || null;

  const speakText = (sentences: string[]) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(sentences.join(" "));
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  const startRepeat = async (item: { id: string; sentence: string }) => {
    if (recordingId || checkingId) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstart = () => {
        setRecordingId(item.id);
      };

      recorder.onstop = async () => {
        setRecordingId(null);
        setCheckingId(item.id);

        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        stream.getTracks().forEach((track) => track.stop());

        const formData = new FormData();
        formData.append("audio", audioBlob, "voice.webm");

        try {
          const token = localStorage.getItem("token");

          const res = await api.post("/ai/transcribe-voice", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          const said = res.data?.text?.trim() || "";
          const score = getScore(item.sentence, said);

          setResults((prev) => ({
            ...prev,
            [item.id]: {
              score,
              expected: item.sentence,
              said,
              message:
                score >= 85
                  ? "Excellent! Your sentence is clear."
                  : score >= 65
                  ? "Good try. Repeat it a little more clearly."
                  : "Try again slowly and focus on the full sentence.",
            },
          }));
        } catch (error) {
          console.log("STORY REPEAT ERROR:", error);
        } finally {
          setCheckingId(null);
          mediaRecorderRef.current = null;
          audioChunksRef.current = [];
        }
      };

      recorder.start();
    } catch (error) {
      console.log("MIC ERROR:", error);
      setRecordingId(null);
      setCheckingId(null);
    }
  };

  const stopRepeat = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const markStoryDone = () => {
  if (!selectedStory) return;

  const updated = Array.from(new Set([...completedStories, selectedStory.id]));
  setCompletedStories(updated);
  localStorage.setItem("completedStories", JSON.stringify(updated));
};

  if (selectedStory) {
    const progress = Math.round(
      (Object.keys(results).filter((key) => key.startsWith(selectedStory.id))
        .length /
        Math.max(selectedStory.story.English.length, 1)) *
        100
    );

    return (
      <section className="space-y-6">
        <button
          onClick={() => {
            window.speechSynthesis.cancel();
            setSelectedStoryId(null);
          }}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
        >
          <FaArrowLeft />
          Back to books
        </button>

        <div className="overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-sm">
          <div className="relative min-h-[360px] overflow-hidden bg-slate-950">
            {selectedStory.image && (
              <img
                src={selectedStory.image}
                alt={selectedStory.title}
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/20" />

            <div className="relative z-10 flex min-h-[360px] flex-col justify-end p-7 text-white sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-200">
                {selectedStory.category} Interactive Story
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
                {selectedStory.title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-slate-200">
                {selectedStory.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-black">
                  {selectedStory.level}
                </span>
                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-black">
                  {selectedStory.story.English.length} lines
                </span>
                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-black">
                  Listen + Repeat + AI Check
                </span>
              </div>
            </div>
          </div>
          </div> {/* نهاية Hero */}

{selectedStory.videoUrl && (
  <div className="p-5 sm:p-7">
    <div className="rounded-[30px] bg-slate-950 p-4">
      <video
        controls
        className="h-[300px] w-full rounded-2xl object-cover"
        src={selectedStory.videoUrl}
      />
    </div>
  </div>
)}

<div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_320px]">

          <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="sticky top-4 z-20 mb-6 rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-500">
                      Reading Mode
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                      Read like a real story. Practice any line.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => speakText(selectedStory.story.English)}
                      className="flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-xs font-black text-white transition hover:bg-blue-600"
                    >
                      <FaHeadphones />
                      Listen full story
                    </button>

                    <button
                      onClick={() => setShowTranslation((prev) => !prev)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-700 transition hover:border-blue-300"
                    >
                      {showTranslation ? "Hide translation" : "Show translation"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <article className="rounded-[34px] border border-slate-200 bg-[#fffaf0] p-5 shadow-sm sm:p-8">
                <div className="mx-auto max-w-3xl">
                  <div className="mb-8 border-b border-amber-200 pb-6 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-700">
                      Story Book
                    </p>
                    <h2 className="mt-3 text-3xl font-black text-slate-950">
                      {selectedStory.title}
                    </h2>
                  </div>

                                   <div className="space-y-8">
                    {selectedStory.story.English.map((sentence: string, index: number) => {
                      const sentenceId = `${selectedStory.id}-sentence-${index}`;
                      const result = results[sentenceId];

                      return (
                        <div
                          key={sentenceId}
                          className="border-b border-amber-100 pb-6 last:border-0"
                        >
                          <p className="font-serif text-2xl font-semibold leading-[2.2] text-slate-900">
                            {sentence}
                          </p>

                          {showTranslation && (
                            <div className="mt-3 rounded-2xl bg-white/70 p-4">
                              <p className="text-sm font-bold leading-7 text-slate-600">
                                Arabic: {selectedStory.story.Arabic[index]}
                              </p>
                              <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                                Hebrew: {selectedStory.story.Hebrew[index]}
                              </p>
                            </div>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              onClick={() => speakText([sentence])}
                              className="rounded-xl bg-blue-500 px-4 py-2 text-xs font-black text-white"
                            >
                              Listen
                            </button>

                            <button
                              onMouseDown={() => startRepeat({ id: sentenceId, sentence })}
                              onMouseUp={stopRepeat}
                              onMouseLeave={stopRepeat}
                              onTouchStart={() => startRepeat({ id: sentenceId, sentence })}
                              onTouchEnd={stopRepeat}
                              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700"
                            >
                              {recordingId === sentenceId ? "Recording" : "Repeat"}
                            </button>
                          </div>

                          {checkingId === sentenceId && (
                            <p className="mt-3 text-sm font-bold text-blue-500">
                              AI is checking your voice...
                            </p>
                          )}

                          {result && (
                            <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                              <p className="text-sm font-black text-slate-700">
                                Score: {result.score}%
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                {result.message}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-black text-slate-950">
                  Vocabulary
                </h3>

                <div className="mt-4 space-y-3">
                  {selectedStory.vocabulary.map(
                    (item: {
                      word: string;
                      Arabic: string;
                      Hebrew: string;
                    }) => (
                      <div
                        key={item.word}
                        className="rounded-2xl bg-slate-50 p-4"
                      >
                        <p className="font-black text-slate-950">
                          {item.word}
                        </p>
                        <p className="mt-2 text-sm font-bold text-slate-500">
                          Arabic: {item.Arabic}
                        </p>
                        <p className="mt-1 text-sm font-bold text-slate-500">
                          Hebrew: {item.Hebrew}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-black text-slate-950">
                  Questions
                </h3>

                <div className="mt-4 space-y-3">
                  {selectedStory.questions.map(
                    (
                      item: { question: string; answer: string },
                      index: number
                    ) => (
                      <div
                        key={item.question}
                        className="rounded-2xl bg-slate-50 p-4"
                      >
                        <p className="font-black leading-7 text-slate-950">
                          {index + 1}. {item.question}
                        </p>
                        <p className="mt-2 text-sm font-bold leading-7 text-slate-500">
                          Answer: {item.answer}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <button
  onClick={markStoryDone}
  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-4 text-sm font-black text-white transition hover:bg-slate-800"
>
  <FaCheckCircle />
  {completedStories.includes(selectedStory.id)
    ? "Story completed"
    : "Mark story as done"}
</button>
            </aside>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold text-blue-500">
          Stories & Listening
        </p>

        <h1 className="mt-3 text-4xl font-black text-slate-950">
          Story Books
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
          Choose an English story book. Read, listen, repeat sentences, learn
          useful vocabulary, and answer questions.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const active = selectedCategory === category.label;

          return (
            <button
              key={category.label}
              onClick={() => {
                setSelectedCategory(category.label);
                setSelectedStoryId(null);
              }}
              className={`flex items-center gap-4 rounded-[24px] border p-4 text-left transition ${
                active
                  ? "border-blue-200 bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"
              }`}
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-blue-50 text-blue-500"
                }`}
              >
                <Icon />
              </span>

              <span className="font-black">{category.label}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setSelectedStoryId(null);
              }}
              className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                selectedLevel === level
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {filteredStories.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            No stories yet
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            We will add stories for this level and category soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredStories.map((story) => (
            <button
              key={story.id}
              onClick={() => setSelectedStoryId(story.id)}
              className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              {story.image ? (
                <div className="relative h-56 overflow-hidden rounded-[28px] shadow-inner">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-100">
                      {story.category}
                    </p>

                    <h2 className="mt-3 text-3xl font-black leading-tight">
                      {story.title}
                    </h2>

                    <p className="mt-3 text-xs font-bold text-blue-100">
                      English Story Book
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-56 items-end rounded-[28px] bg-gradient-to-br from-blue-500 via-blue-700 to-slate-950 p-6 text-white shadow-inner transition group-hover:scale-[1.01]">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-100">
                      {story.category}
                    </p>

                    <h2 className="mt-3 text-3xl font-black leading-tight">
                      {story.title}
                    </h2>

                    <p className="mt-3 text-xs font-bold text-blue-100">
                      English Story Book
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-600">
                  {story.level}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                  {story.story.English.length} sentences
                </span>
              </div>

              <p className="mt-4 text-sm font-bold leading-7 text-slate-500">
                {story.description}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs font-black text-blue-500">
                  Open story
                </span>

                <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">
                  Start
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default StoriesPage;