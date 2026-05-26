export type NativeLanguage = "Arabic" | "Hebrew" | "English";

export type WordPracticeItem = {
  id: string;
  level: "A1-A2" | "B1-B2" | "C1-C2";
  category:
    | "Travel"
    | "Career and job"
    | "Study"
    | "Family and friends"
    | "Business"
    | "Personal growth";
  topic: string;
  type: "word" | "sentence";
  difficulty: "easy" | "medium" | "hard";
  word: string;
  translations: {
    Arabic: string;
    Hebrew?: string;
    English?: string;
  };
  example: string;
  tip: string;
};

export const wordLessons: WordPracticeItem[] = [
  // TRAVEL - EASY WORDS
  {
    id: "a1-travel-1",
    level: "A1-A2",
    category: "Travel",
    topic: "Airport",
    type: "word",
    difficulty: "easy",
    word: "Passport",
    translations: {
      Arabic: "جواز سفر",
      Hebrew: "דרכון",
      English: "Passport",
    },
    example: "Where is my passport?",
    tip: "Say it slowly: pass-port.",
  },
  {
    id: "a1-travel-2",
    level: "A1-A2",
    category: "Travel",
    topic: "Airport",
    type: "word",
    difficulty: "easy",
    word: "Ticket",
    translations: {
      Arabic: "تذكرة",
      Hebrew: "כרטיס",
      English: "Ticket",
    },
    example: "I have a ticket.",
    tip: "Focus on the short sound: ticket.",
  },
  {
    id: "a1-travel-3",
    level: "A1-A2",
    category: "Travel",
    topic: "Airport",
    type: "word",
    difficulty: "easy",
    word: "Gate",
    translations: {
      Arabic: "بوابة",
      Hebrew: "שער",
      English: "Gate",
    },
    example: "Where is the gate?",
    tip: "Gate sounds like: geit.",
  },
  {
    id: "a1-travel-4",
    level: "A1-A2",
    category: "Travel",
    topic: "Hotel",
    type: "word",
    difficulty: "easy",
    word: "Room",
    translations: {
      Arabic: "غرفة",
      Hebrew: "חדר",
      English: "Room",
    },
    example: "I need a room.",
    tip: "Make the word clear: room.",
  },
  {
    id: "a1-travel-5",
    level: "A1-A2",
    category: "Travel",
    topic: "Hotel",
    type: "word",
    difficulty: "easy",
    word: "Reservation",
    translations: {
      Arabic: "حجز",
      Hebrew: "הזמנה",
      English: "Reservation",
    },
    example: "I have a reservation.",
    tip: "This is very useful in hotels and restaurants.",
  },

  // TRAVEL - SENTENCES
  {
    id: "a1-travel-6",
    level: "A1-A2",
    category: "Travel",
    topic: "Airport",
    type: "sentence",
    difficulty: "medium",
    word: "I have a reservation.",
    translations: {
      Arabic: "لدي حجز",
      Hebrew: "יש לי הזמנה",
      English: "I have a reservation.",
    },
    example: "I have a reservation.",
    tip: "Do not forget the word: a.",
  },
  {
    id: "a1-travel-7",
    level: "A1-A2",
    category: "Travel",
    topic: "Airport",
    type: "sentence",
    difficulty: "medium",
    word: "Where is the gate?",
    translations: {
      Arabic: "أين البوابة؟",
      Hebrew: "איפה השער?",
      English: "Where is the gate?",
    },
    example: "Where is the gate?",
    tip: "Start clearly with: Where is...",
  },
  {
    id: "a1-travel-8",
    level: "A1-A2",
    category: "Travel",
    topic: "Hotel",
    type: "sentence",
    difficulty: "medium",
    word: "I need a room.",
    translations: {
      Arabic: "أحتاج غرفة",
      Hebrew: "אני צריך חדר",
      English: "I need a room.",
    },
    example: "I need a room.",
    tip: "Short and useful hotel sentence.",
  },

  // CAREER AND JOB
  {
    id: "a1-career-1",
    level: "A1-A2",
    category: "Career and job",
    topic: "Interview",
    type: "word",
    difficulty: "easy",
    word: "Job",
    translations: {
      Arabic: "وظيفة",
      Hebrew: "עבודה",
      English: "Job",
    },
    example: "I need a job.",
    tip: "Simple and important word.",
  },
  {
    id: "a1-career-2",
    level: "A1-A2",
    category: "Career and job",
    topic: "Interview",
    type: "sentence",
    difficulty: "medium",
    word: "I am looking for a job.",
    translations: {
      Arabic: "أنا أبحث عن وظيفة",
      Hebrew: "אני מחפש עבודה",
      English: "I am looking for a job.",
    },
    example: "I am looking for a job.",
    tip: "Say it slowly: looking for a job.",
  },

  // STUDY
  {
    id: "a1-study-1",
    level: "A1-A2",
    category: "Study",
    topic: "Classroom",
    type: "word",
    difficulty: "easy",
    word: "Teacher",
    translations: {
      Arabic: "معلم",
      Hebrew: "מורה",
      English: "Teacher",
    },
    example: "My teacher is helpful.",
    tip: "Teacher has a soft ch sound.",
  },
  {
    id: "a1-study-2",
    level: "A1-A2",
    category: "Study",
    topic: "Classroom",
    type: "sentence",
    difficulty: "medium",
    word: "I have a question.",
    translations: {
      Arabic: "لدي سؤال",
      Hebrew: "יש לי שאלה",
      English: "I have a question.",
    },
    example: "I have a question.",
    tip: "Very useful in class.",
  },

  // FAMILY AND FRIENDS
  {
    id: "a1-family-1",
    level: "A1-A2",
    category: "Family and friends",
    topic: "Daily talk",
    type: "word",
    difficulty: "easy",
    word: "Friend",
    translations: {
      Arabic: "صديق",
      Hebrew: "חבר",
      English: "Friend",
    },
    example: "He is my friend.",
    tip: "Friend starts with fr.",
  },
  {
    id: "a1-family-2",
    level: "A1-A2",
    category: "Family and friends",
    topic: "Daily talk",
    type: "sentence",
    difficulty: "easy",
    word: "Nice to meet you.",
    translations: {
      Arabic: "سعيد بلقائك",
      Hebrew: "נעים להכיר",
      English: "Nice to meet you.",
    },
    example: "Nice to meet you.",
    tip: "Use this when meeting someone new.",
  },

  // BUSINESS
  {
    id: "a1-business-1",
    level: "A1-A2",
    category: "Business",
    topic: "Basic business",
    type: "word",
    difficulty: "easy",
    word: "Client",
    translations: {
      Arabic: "عميل",
      Hebrew: "לקוח",
      English: "Client",
    },
    example: "The client is here.",
    tip: "Client means customer in business.",
  },
  {
    id: "a1-business-2",
    level: "A1-A2",
    category: "Business",
    topic: "Basic business",
    type: "sentence",
    difficulty: "medium",
    word: "Can we schedule a meeting?",
    translations: {
      Arabic: "هل يمكننا تحديد اجتماع؟",
      Hebrew: "אפשר לקבוע פגישה?",
      English: "Can we schedule a meeting?",
    },
    example: "Can we schedule a meeting?",
    tip: "Useful professional sentence.",
  },

  // PERSONAL GROWTH
  {
    id: "a1-growth-1",
    level: "A1-A2",
    category: "Personal growth",
    topic: "Confidence",
    type: "word",
    difficulty: "easy",
    word: "Confidence",
    translations: {
      Arabic: "ثقة بالنفس",
      Hebrew: "ביטחון עצמי",
      English: "Confidence",
    },
    example: "I want more confidence.",
    tip: "Break it: con-fi-dence.",
  },
  {
    id: "a1-growth-2",
    level: "A1-A2",
    category: "Personal growth",
    topic: "Confidence",
    type: "sentence",
    difficulty: "medium",
    word: "I can speak better every day.",
    translations: {
      Arabic: "أستطيع أن أتحدث بشكل أفضل كل يوم",
      Hebrew: "אני יכול לדבר טוב יותר כל יום",
      English: "I can speak better every day.",
    },
    example: "I can speak better every day.",
    tip: "Good sentence for confidence practice.",
  },
];