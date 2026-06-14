export type StoryLevel = "A1-A2" | "B1-B2" | "C1-C2";

export type StoryCategory =
  | "Travel"
  | "Daily life"
  | "Business"
  | "Career"
  | "Social"
  | "Study";

export type StoryLesson = {
  id: string;
  title: string;
  level: StoryLevel;
  category: StoryCategory;
  description: string;


    image?: string;


  story: {
    English: string[];
    Arabic: string[];
    Hebrew: string[];
  };

  vocabulary: {
    word: string;
    Arabic: string;
    Hebrew: string;
  }[];

  questions: {
    question: string;
    answer: string;
  }[];

  videoUrl?: string;
  audioUrl?: string;
};