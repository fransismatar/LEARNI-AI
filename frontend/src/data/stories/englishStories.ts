import type { StoryLesson } from "./types";

export const englishStories: StoryLesson[] = [
  {
    id: "story-english-a1-travel-001",
    title: "My First Flight",
    level: "A1-A2",
    category: "Travel",
    description: "A simple story about going to the airport for the first time.",

    story: {
      English: [
        "Today I am going to the airport.",
        "I have my passport and my ticket.",
        "I ask a worker where the gate is.",
        "The worker smiles and helps me.",
        "I feel happy because I am ready for my first flight.",
      ],

      Arabic: [
        "اليوم أنا ذاهب إلى المطار.",
        "لدي جواز سفري وتذكرتي.",
        "أسأل موظفًا أين البوابة.",
        "يبتسم الموظف ويساعدني.",
        "أشعر بالسعادة لأنني جاهز لرحلتي الأولى.",
      ],

      Hebrew: [
        "היום אני הולך לשדה התעופה.",
        "יש לי את הדרכון ואת הכרטיס שלי.",
        "אני שואל עובד איפה השער.",
        "העובד מחייך ועוזר לי.",
        "אני מרגיש שמח כי אני מוכן לטיסה הראשונה שלי.",
      ],
    },

    vocabulary: [
      {
        word: "Airport",
        Arabic: "مطار",
        Hebrew: "שדה תעופה",
      },
      {
        word: "Passport",
        Arabic: "جواز سفر",
        Hebrew: "דרכון",
      },
    ],

    questions: [
      {
        question: "Where is the person going?",
        answer: "The person is going to the airport.",
      },
    ],

    videoUrl: "",
    audioUrl: "",
  },
];