import { useMemo, useState } from "react";
import {
  FaBookOpen,
  FaBriefcase,
  FaCheckCircle,
  FaGraduationCap,
  FaHeadphones,
  FaPlane,
  FaRegBuilding,
  FaUsers,
  FaVolumeUp,
} from "react-icons/fa";
import { storyLessons } from "../data/stories";

const levels = ["A1-A2", "B1-B2", "C1-C2"];

const categories = [
  { label: "Travel", icon: FaPlane },
  { label: "Daily life", icon: FaBookOpen },
  { label: "Business", icon: FaRegBuilding },
  { label: "Career", icon: FaBriefcase },
  { label: "Social", icon: FaUsers },
  { label: "Study", icon: FaGraduationCap },
];

const StoriesPage = () => {
  const [selectedLevel, setSelectedLevel] = useState("A1-A2");
  const [selectedCategory, setSelectedCategory] = useState("Travel");
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);

  const filteredStories = useMemo(() => {
    return storyLessons.filter(
      (story) =>
        story.level === selectedLevel && story.category === selectedCategory
    );
  }, [selectedLevel, selectedCategory]);

  const selectedStory =
    storyLessons.find((story) => story.id === selectedStoryId) ||
    filteredStories[0];

  const speakText = (sentences: string[]) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(sentences.join(" "));
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold text-blue-500">Stories & Listening</p>

        <h1 className="mt-3 text-4xl font-black text-slate-950">Stories</h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
          Read short stories, listen to natural English, learn useful words, and
          test your understanding.
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
        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            {filteredStories.map((story) => {
              const active = selectedStory?.id === story.id;

              return (
                <button
                  key={story.id}
                  onClick={() => setSelectedStoryId(story.id)}
                  className={`w-full rounded-[28px] border p-5 text-left transition ${
                    active
                      ? "border-blue-200 bg-blue-50 shadow-md"
                      : "border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-600">
                      {story.level}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                      {story.category}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-black text-slate-950">
                    {story.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {story.description}
                  </p>

                  <p className="mt-4 text-xs font-black text-blue-500">
                    {story.story.English.length} sentences
                  </p>
                </button>
              );
            })}
          </div>

          {selectedStory && (
            <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-blue-500">
                    {selectedStory.category} Story
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-950">
                    {selectedStory.title}
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                    {selectedStory.description}
                  </p>
                </div>

                <button
                  onClick={() => speakText(selectedStory.story.English)}
                  className="flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-600"
                >
                  <FaHeadphones />
                  Listen
                </button>
              </div>

              <div className="mt-6 rounded-[28px] bg-slate-950 p-5 text-white">
                {selectedStory.videoUrl ? (
                  <video
                    controls
                    className="h-[260px] w-full rounded-2xl object-cover"
                    src={selectedStory.videoUrl}
                  />
                ) : (
                  <div className="grid h-[260px] place-items-center rounded-2xl border border-white/10 bg-white/5 text-center">
                    <div>
                      <FaVolumeUp className="mx-auto text-4xl text-blue-300" />
                      <p className="mt-4 text-lg font-black">
                        HeyGen video will appear here
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        For now, students can use Listen mode.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowTranslation((prev) => !prev)}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-blue-300"
                >
                  {showTranslation ? "Hide translation" : "Show translation"}
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {selectedStory.story.English.map((sentence, index) => (
                  <div
                    key={`${selectedStory.id}-${index}`}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
  <p className="text-base font-black leading-8 text-slate-950">
    {index + 1}. {sentence}
  </p>

  <button
    onClick={() => speakText([sentence])}
    className="shrink-0 rounded-2xl bg-blue-500 px-4 py-2 text-xs font-black text-white transition hover:bg-blue-600"
  >
    Listen
  </button>
</div>

                    {showTranslation && (
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <p className="rounded-2xl bg-white p-4 text-sm font-bold leading-7 text-slate-600">
                          Arabic: {selectedStory.story.Arabic[index]}
                        </p>

                        <p className="rounded-2xl bg-white p-4 text-sm font-bold leading-7 text-slate-600">
                          Hebrew: {selectedStory.story.Hebrew[index]}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                  <h3 className="text-xl font-black text-slate-950">
                    Vocabulary
                  </h3>

                  <div className="mt-4 space-y-3">
                    {selectedStory.vocabulary.map((item) => (
                      <div
                        key={item.word}
                        className="rounded-2xl bg-slate-50 p-4"
                      >
                        <p className="font-black text-slate-950">
                          {item.word}
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-500">
                          Arabic: {item.Arabic}
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-500">
                          Hebrew: {item.Hebrew}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                  <h3 className="text-xl font-black text-slate-950">
                    Questions
                  </h3>

                  <div className="mt-4 space-y-3">
                    {selectedStory.questions.map((item, index) => (
                      <div
                        key={item.question}
                        className="rounded-2xl bg-slate-50 p-4"
                      >
                        <p className="font-black text-slate-950">
                          {index + 1}. {item.question}
                        </p>

                        <p className="mt-2 text-sm font-bold leading-7 text-slate-500">
                          Answer: {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800">
                <FaCheckCircle />
                Mark story as done
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default StoriesPage;