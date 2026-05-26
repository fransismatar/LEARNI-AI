import type { WordLesson } from "./types";

export const familyWords: WordLesson[] = [
  {
    id: "family-a1-001",
    category: "Family and friends",
    level: "A1-A2",
    topic: "Family",
    type: "word",
    difficulty: "Easy",
    word: "Brother",
    translations: {
      Arabic: "أخ",
      Hebrew: "אח",
      English: "Brother",
    },
    example: "He is my brother.",
    tip: "Use this when talking about family.",
  },
  {
    id: "family-a1-002",
    category: "Family and friends",
    level: "A1-A2",
    topic: "Friends",
    type: "sentence",
    difficulty: "Easy",
    word: "This is my friend.",
    translations: {
      Arabic: "هذا صديقي.",
      Hebrew: "זה החבר שלי.",
      English: "This is my friend.",
    },
    example: "This is my friend Adam.",
    tip: "Useful when introducing people.",
  },
];