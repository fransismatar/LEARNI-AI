import type { StoryLesson } from "./types";

export const businessStories: StoryLesson[] = [
  {
    id: "story-english-a1-business-001",
    title: "My First Customer",
    level: "A1-A2",
    category: "Business",
    description:
      "A beginner business story about helping a customer in a small shop.",

    story: {
      English: [
        "I work in a small shop.",
        "Every day many customers visit the store.",
        "One morning a new customer walks in.",
        "He looks around and smiles.",
        "I say hello and ask if he needs help.",
        "The customer wants to buy a gift for his friend.",
        "I show him several products.",
        "He asks questions about the prices.",
        "I explain the differences between the products.",
        "After a few minutes, he chooses one item.",
        "I take the product to the cashier.",
        "The customer pays and thanks me.",
        "Before leaving, he says he will come back again.",
        "I feel happy because I helped my first customer.",
      ],

      Arabic: [
        "أعمل في متجر صغير.",
        "كل يوم يزور العديد من الزبائن المتجر.",
        "في أحد الصباحات يدخل زبون جديد.",
        "ينظر حوله ويبتسم.",
        "أقول مرحبًا وأسأله إن كان يحتاج إلى مساعدة.",
        "يريد الزبون شراء هدية لصديقه.",
        "أعرض عليه عدة منتجات.",
        "يسأل عن الأسعار.",
        "أشرح له الفروقات بين المنتجات.",
        "بعد عدة دقائق يختار منتجًا واحدًا.",
        "آخذ المنتج إلى صندوق الدفع.",
        "يدفع الزبون ويشكرني.",
        "قبل أن يغادر يقول إنه سيعود مرة أخرى.",
        "أشعر بالسعادة لأنني ساعدت أول زبون لي.",
      ],

      Hebrew: [
        "אני עובד בחנות קטנה.",
        "בכל יום לקוחות רבים מבקרים בחנות.",
        "בוקר אחד נכנס לקוח חדש.",
        "הוא מסתכל סביב ומחייך.",
        "אני אומר שלום ושואל אם הוא צריך עזרה.",
        "הלקוח רוצה לקנות מתנה לחבר שלו.",
        "אני מראה לו כמה מוצרים.",
        "הוא שואל שאלות על המחירים.",
        "אני מסביר את ההבדלים בין המוצרים.",
        "אחרי כמה דקות הוא בוחר מוצר אחד.",
        "אני לוקח את המוצר לקופה.",
        "הלקוח משלם ומודה לי.",
        "לפני שהוא עוזב הוא אומר שיחזור שוב.",
        "אני מרגיש שמח כי עזרתי ללקוח הראשון שלי.",
      ],
    },

    vocabulary: [
      { word: "Customer", Arabic: "زبون", Hebrew: "לקוח" },
      { word: "Shop", Arabic: "متجر", Hebrew: "חנות" },
      { word: "Product", Arabic: "منتج", Hebrew: "מוצר" },
      { word: "Price", Arabic: "سعر", Hebrew: "מחיר" },
      { word: "Gift", Arabic: "هدية", Hebrew: "מתנה" },
      { word: "Cashier", Arabic: "صندوق الدفع", Hebrew: "קופה" },
      { word: "Pay", Arabic: "يدفع", Hebrew: "לשלם" },
      { word: "Help", Arabic: "مساعدة", Hebrew: "עזרה" },
    ],

    questions: [
      {
        question: "Where does the person work?",
        answer: "The person works in a small shop.",
      },
      {
        question: "What does the customer want to buy?",
        answer: "The customer wants to buy a gift.",
      },
      {
        question: "What does the worker explain?",
        answer: "The worker explains the differences between the products.",
      },
      {
        question: "How does the story end?",
        answer: "The customer buys the product and says he will return.",
      },
    ],

    videoUrl: "",
    audioUrl: "",
  },
];