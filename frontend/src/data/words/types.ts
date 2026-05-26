export type WordLevel = "A1-A2" | "B1-B2" | "C1-C2";

export type WordCategory =
  | "Travel"
  | "Career and job"
  | "Study"
  | "Family and friends"
  | "Business"
  | "Personal growth";

export type WordLesson = {
  id: string;
  category: WordCategory;
  level: WordLevel;
  topic: string;
  type: "word" | "sentence";
  difficulty: "Easy" | "Medium" | "Hard";
  word: string;
  translations: {
    Arabic: string;
    Hebrew: string;
    English: string;
  };
  example: string;
  tip: string;
};