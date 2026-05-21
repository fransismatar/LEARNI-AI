import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DailyIframe from "@daily-co/daily-js";
import { DailyProvider } from "@daily-co/daily-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LessonRobot from "../assets/LessonRobot.png";
import {
  useObservableEvent,
  useSendAppMessage,
} from "../components/cvi/hooks/cvi-events-hooks";
import { useClosedCaption } from "../components/cvi/hooks/use-closed-caption";

type TavusChatMessage = {
  id: string;
  role: "user" | "replica";
  text: string;
};

const TavusChatPanel = ({
  teacherId,
  conversationId,
  targetLanguage,
}: {
  teacherId: string;
  conversationId: string;
  targetLanguage: string;
}) => {
  const sendAppMessage = useSendAppMessage();
  const caption = useClosedCaption();


  const [messages, setMessages] = useState<TavusChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useObservableEvent<never>(
    useCallback((event) => {
      if (event.event_type !== "conversation.utterance") return;

      const role = event.properties.role;
      const speech = event.properties.speech;

      if ((role !== "user" && role !== "replica") || !speech) return;

      const id = `${event.inference_id}:${role}`;

      setMessages((prev) => {
        const cleaned =
          role === "user"
            ? prev.filter(
                (msg) =>
                  !(
                    msg.id.startsWith("local-") &&
                    msg.text.trim() === speech.trim()
                  )
              )
            : prev;

        const exists = cleaned.findIndex((msg) => msg.id === id);

        if (exists >= 0) {
          const next = [...cleaned];
          next[exists] = { id, role, text: speech };
          return next;
        }

        return [...cleaned, { id, role, text: speech }];
      });
    }, [])
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, caption]);

  const sendToTavus = () => {
    const text = input.trim();

    if (!text) return;

    if (!conversationId) {
      setError("Start the video lesson first.");
      return;
    }

    setError("");
    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        role: "user",
        text,
      },
    ]);

    sendAppMessage({
      message_type: "conversation",
      event_type: "conversation.respond",
      conversation_id: conversationId,
      properties: {
        text,
      },
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col rounded-[32px] border border-white/10 bg-white/[0.04] shadow-2xl">
      <div className="border-b border-white/10 p-5">
        <p className="text-sm font-bold text-cyan-300">Teacher Chat</p>
        <h2 className="mt-1 text-2xl font-black">{teacherId}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Type here and {teacherId} will answer by video and text.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-5 text-sm leading-7 text-slate-400">
            Start the video lesson, then write a message to your teacher.
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-3xl p-4 text-sm leading-7 ${
              msg.role === "user"
                ? "ml-auto max-w-[85%] bg-cyan-400 text-slate-950"
                : "mr-auto max-w-[90%] border border-white/10 bg-slate-950/60 text-slate-200"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {caption && (
          <div className="mr-auto max-w-[90%] rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm leading-7 text-cyan-100">
            <span className="font-bold">
              {caption.role === "replica" ? teacherId : "You"}:
            </span>{" "}
            {caption.text}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 p-4">
        {error && (
          <div className="mb-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendToTavus();
            }}
            placeholder={`Write to ${teacherId} in ${targetLanguage}...`}
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <button
            onClick={sendToTavus}
            className="cursor-pointer rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Send
          </button>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          This chat is connected directly to Tavus video teacher.
        </p>
      </div>
    </div>
  );
};

const AvatarTeacherPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const teacherId = searchParams.get("teacher") || "Maya";
  const profile = user?.learningProfile || {};
  const sendAppMessage = useSendAppMessage();

  const [conversationUrl, setConversationUrl] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [callObject, setCallObject] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (callObject) {
        callObject.destroy();
      }
    };
  }, [callObject]);

  const startAvatarSession = async () => {
    try {
      setAvatarLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/avatar/session",
        { teacherId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConversationUrl(res.data.conversation_url);
      setConversationId(res.data.conversation_id);

      setTimeout(() => {
  const welcomeMessage = `Start the lesson now. Greet ${user?.name || "the student"} warmly, mention their goal: ${
    profile.mainGoal || "language practice"
  }, and ask the first simple question.`;

  sendAppMessage({
    message_type: "conversation",
    event_type: "conversation.respond",
    conversation_id: res.data.conversation_id,
    properties: {
      text: welcomeMessage,
    },
  });
}, 3000);

      if (videoContainerRef.current) {
        const call = DailyIframe.createFrame(videoContainerRef.current, {
          iframeStyle: {
            width: "100%",
            height: "100%",
            border: "0",
          },
          showLeaveButton: true,
        });

        await call.join({
          url: res.data.conversation_url,
        });
          
         setTimeout(() => {
  call.sendAppMessage(
    {
      message_type: "conversation",
      event_type: "conversation.respond",
      conversation_id: res.data.conversation_id,
      properties: {
        text: `Start the lesson now. Greet ${user?.name || "the student"} warmly. The student's native language is ${
          profile.nativeLanguage || "Arabic"
        }. The target language is ${
          profile.targetLanguage || "English"
        }. Their goal is ${
          profile.mainGoal || "language practice"
        }. Say hello, mention the goal, and ask the first simple question.`,
      },
    },
    "*"
  );
}, 4000);

        setCallObject(call);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to start avatar teacher");
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <DailyProvider callObject={callObject}>
      <section className="space-y-6">
        <div className="rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-blue-500/10 p-6 shadow-2xl sm:p-8">
          <p className="text-sm font-bold text-cyan-300">Lesson Room</p>

          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                Learn with{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  {teacherId}
                </span>
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                Video teacher, connected chat, and live captions in one place.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center font-bold text-slate-200 transition hover:bg-white/[0.08]"
            >
              Change teacher
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl">
            <div ref={videoContainerRef} className="h-[72vh] w-full" />

            {!conversationUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black p-8 text-center">
                <div className="h-40 w-40 overflow-hidden rounded-[32px] border border-cyan-400/20 bg-cyan-400/5 shadow-2xl shadow-cyan-500/10">
                  <img
                    src={LessonRobot}
                    alt="AI Teacher"
                    className="h-full w-full object-cover"
                  />
                </div>

                <h2 className="mt-6 text-3xl font-black">
                  Ready to meet {teacherId}?
                </h2>

                <p className="mt-4 max-w-md leading-7 text-slate-400">
                  Start the video call, then type in chat and your teacher will
                  answer by video.
                </p>

                <button
                  onClick={startAvatarSession}
                  disabled={avatarLoading}
                  className="mt-8 cursor-pointer rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {avatarLoading ? "Starting lesson..." : "Start Video Lesson"}
                </button>
              </div>
            )}
          </div>

          <div className="hidden h-[72vh] xl:block">
            <TavusChatPanel
              teacherId={teacherId}
              conversationId={conversationId}
              targetLanguage={profile.targetLanguage || "English"}
            />
          </div>
        </div>

        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-24 right-4 z-50 rounded-2xl bg-cyan-400 px-5 py-4 font-bold text-slate-950 shadow-2xl shadow-cyan-400/30 xl:hidden"
        >
          Open Chat
        </button>

        {isChatOpen && (
          <div className="fixed inset-0 z-[100] flex items-end bg-black/70 p-3 backdrop-blur-md xl:hidden">
            <div className="h-[82vh] w-full overflow-hidden rounded-[32px] bg-slate-950">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <p className="font-bold text-cyan-300">Teacher chat</p>

                <button
                  onClick={() => setIsChatOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 text-xl text-slate-300"
                >
                  ×
                </button>
              </div>

              <div className="h-[calc(82vh-73px)]">
                <TavusChatPanel
                  teacherId={teacherId}
                  conversationId={conversationId}
                  targetLanguage={profile.targetLanguage || "English"}
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </DailyProvider>
  );
};

export default AvatarTeacherPage;