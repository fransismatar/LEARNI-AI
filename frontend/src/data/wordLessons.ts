export type WordPracticeItem = {
  id: string;
  level: "A1-A2" | "B1-B2" | "C1-C2";
  topic: string;
  word: string;
  meaning: string;
  example: string;
};

export const wordLessons: WordPracticeItem[] = [
  {
    id: "a1-travel-1",
    level: "A1-A2",
    topic: "Travel",
    word: "Reservation",
    meaning: "حجز",
    example: "I have a reservation.",
  },
  {
    id: "a1-travel-2",
    level: "A1-A2",
    topic: "Travel",
    word: "Passport",
    meaning: "جواز سفر",
    example: "Where is my passport?",
  },
  {
    id: "a1-travel-3",
    level: "A1-A2",
    topic: "Travel",
    word: "Gate",
    meaning: "بوابة",
    example: "Where is the gate?",
  },
  {
    id: "a1-restaurant-1",
    level: "A1-A2",
    topic: "Restaurant",
    word: "Menu",
    meaning: "قائمة الطعام",
    example: "Can I see the menu?",
  },
  {
    id: "a1-restaurant-2",
    level: "A1-A2",
    topic: "Restaurant",
    word: "Water",
    meaning: "ماء",
    example: "Can I have water, please?",
  },
  {
    id: "a1-greetings-1",
    level: "A1-A2",
    topic: "Greetings",
    word: "Hello",
    meaning: "مرحبًا",
    example: "Hello, nice to meet you.",
  },
];