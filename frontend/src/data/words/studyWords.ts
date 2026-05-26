import type { WordLesson } from "./types";

export const studyWords: WordLesson[] = [
  {
    id: "study-a1-001",
    category: "Study",
    level: "A1-A2",
    topic: "Classroom",
    type: "word",
    difficulty: "Easy",
    word: "Book",
    translations: {
      Arabic: "كتاب",
      Hebrew: "ספר",
      English: "Book",
    },
    example: "This is my book.",
    tip: "A basic study word.",
  },
  {
    id: "study-a1-002",
    category: "Study",
    level: "A1-A2",
    topic: "Classroom",
    type: "sentence",
    difficulty: "Easy",
    word: "I do not understand.",
    translations: {
      Arabic: "أنا لا أفهم.",
      Hebrew: "אני לא מבין.",
      English: "I do not understand.",
    },
    example: "Sorry, I do not understand.",
    tip: "Important sentence when learning.",
  },
];