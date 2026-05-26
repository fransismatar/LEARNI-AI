import { storyLessons } from "../data/stories";

const StoriesPage = () => {
  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold text-blue-500">
          Stories & Listening
        </p>

        <h1 className="mt-3 text-4xl font-black text-slate-950">
          Stories
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
          Read stories, listen to pronunciation, and improve your English with AI.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {storyLessons.map((story) => (
          <div
            key={story.id}
            className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-500">
              {story.level}
            </span>

            <h2 className="mt-4 text-2xl font-black text-slate-950">
              {story.title}
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              {story.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoriesPage;