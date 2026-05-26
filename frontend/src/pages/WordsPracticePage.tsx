import { useMemo, useRef, useState } from "react";
import { FaCheckCircle, FaMicrophone, FaVolumeUp } from "react-icons/fa";
import api from "../services/api";
import { wordLessons } from "../data/wordLessons";

const levels = ["A1-A2", "B1-B2", "C1-C2"];

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

const WordsPracticePage = () => {
  const [selectedLevel, setSelectedLevel] = useState("A1-A2");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, Result>>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const activeItemRef = useRef<{ id: string; example: string } | null>(null);

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  const startRepeat = async (item: { id: string; example: string }) => {
    if (recordingId || checkingId) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      activeItemRef.current = item;

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "",
      });

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
          const score = getScore(item.example, said);

          setResults((prev) => ({
            ...prev,
            [item.id]: {
              score,
              expected: item.example,
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
          console.log("WORD REPEAT ERROR:", error);
        } finally {
          setCheckingId(null);
          mediaRecorderRef.current = null;
          audioChunksRef.current = [];
          activeItemRef.current = null;
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

  const topics = useMemo(() => {
    const filtered = wordLessons.filter((item) => item.level === selectedLevel);
    return ["All", ...new Set(filtered.map((item) => item.topic))];
  }, [selectedLevel]);

  const filteredLessons = useMemo(() => {
    return wordLessons.filter((item) => {
      const levelMatch = item.level === selectedLevel;
      const topicMatch =
        selectedTopic === "All" ? true : item.topic === selectedTopic;

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
          Listen, repeat, and let AI check your pronunciation.
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
                : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300"
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
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-400"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredLessons.map((item) => {
          const result = results[item.id];

          return (
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
                <button
                  onClick={() => speakText(item.example)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-600"
                >
                  <FaVolumeUp />
                  Listen
                </button>

                <button
                  onMouseDown={() =>
                    startRepeat({ id: item.id, example: item.example })
                  }
                  onMouseUp={stopRepeat}
                  onMouseLeave={stopRepeat}
                  onTouchStart={() =>
                    startRepeat({ id: item.id, example: item.example })
                  }
                  onTouchEnd={stopRepeat}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition ${
                    recordingId === item.id
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                  }`}
                >
                  <FaMicrophone />
                  {recordingId === item.id ? "Recording" : "Repeat"}
                </button>
              </div>

              {checkingId === item.id && (
                <p className="mt-4 text-center text-sm font-bold text-blue-500">
                  AI is checking your voice...
                </p>
              )}

              {result && (
                <div className="mt-4 rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-slate-700">
                      Pronunciation score
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        result.score >= 85
                          ? "bg-green-100 text-green-600"
                          : result.score >= 65
                          ? "bg-amber-100 text-amber-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {result.score}%
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {result.message}
                  </p>

                  <div className="mt-3 space-y-2 text-xs leading-6">
                    <p className="text-slate-500">
                      <span className="font-black text-slate-700">
                        Expected:
                      </span>{" "}
                      {result.expected}
                    </p>

                    <p className="text-slate-500">
                      <span className="font-black text-slate-700">
                        You said:
                      </span>{" "}
                      {result.said || "No clear speech detected"}
                    </p>
                  </div>
                </div>
              )}

              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800">
                <FaCheckCircle />
                Done
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WordsPracticePage;