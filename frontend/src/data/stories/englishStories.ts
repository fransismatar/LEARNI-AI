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
      { word: "Airport", Arabic: "مطار", Hebrew: "שדה תעופה" },
      { word: "Passport", Arabic: "جواز سفر", Hebrew: "דרכון" },
      { word: "Ticket", Arabic: "تذكرة", Hebrew: "כרטיס" },
      { word: "Gate", Arabic: "بوابة", Hebrew: "שער" },
    ],
    questions: [
      {
        question: "Where is the person going?",
        answer: "The person is going to the airport.",
      },
      {
        question: "What does the person have?",
        answer: "The person has a passport and a ticket.",
      },
    ],
    videoUrl: "",
    audioUrl: "",
  },

  {
    id: "story-english-a1-daily-001",
    title: "A Morning Routine",
    level: "A1-A2",
    category: "Daily life",
    description: "A beginner story about a simple morning routine.",
    story: {
      English: [
        "I wake up at seven o'clock.",
        "I wash my face and brush my teeth.",
        "I eat breakfast with my family.",
        "Then I drink coffee and check my phone.",
        "After that, I go to work.",
      ],
      Arabic: [
        "أستيقظ في الساعة السابعة.",
        "أغسل وجهي وأنظف أسناني.",
        "أتناول الفطور مع عائلتي.",
        "ثم أشرب القهوة وأتفقد هاتفي.",
        "بعد ذلك، أذهب إلى العمل.",
      ],
      Hebrew: [
        "אני מתעורר בשעה שבע.",
        "אני שוטף פנים ומצחצח שיניים.",
        "אני אוכל ארוחת בוקר עם המשפחה שלי.",
        "אחר כך אני שותה קפה ובודק את הטלפון שלי.",
        "לאחר מכן, אני הולך לעבודה.",
      ],
    },
    vocabulary: [
      { word: "Wake up", Arabic: "يستيقظ", Hebrew: "להתעורר" },
      { word: "Breakfast", Arabic: "فطور", Hebrew: "ארוחת בוקר" },
      { word: "Family", Arabic: "عائلة", Hebrew: "משפחה" },
      { word: "Work", Arabic: "عمل", Hebrew: "עבודה" },
    ],
    questions: [
      {
        question: "What time does the person wake up?",
        answer: "The person wakes up at seven o'clock.",
      },
      {
        question: "Who does the person eat breakfast with?",
        answer: "The person eats breakfast with family.",
      },
    ],
    videoUrl: "",
    audioUrl: "",
  },

  {
    id: "story-english-a1-study-001",
    title: "My English Lesson",
    level: "A1-A2",
    category: "Study",
    description: "A simple story about learning English with a teacher.",
    story: {
      English: [
        "Today I have an English lesson.",
        "My teacher speaks slowly.",
        "I listen and repeat the sentences.",
        "Sometimes I make mistakes.",
        "My teacher helps me, and I feel better.",
      ],
      Arabic: [
        "اليوم لدي درس إنجليزي.",
        "معلمي يتحدث ببطء.",
        "أستمع وأكرر الجمل.",
        "أحيانًا أرتكب أخطاء.",
        "معلمي يساعدني، وأشعر بتحسن.",
      ],
      Hebrew: [
        "היום יש לי שיעור אנגלית.",
        "המורה שלי מדבר לאט.",
        "אני מקשיב וחוזר על המשפטים.",
        "לפעמים אני עושה טעויות.",
        "המורה שלי עוזר לי, ואני מרגיש טוב יותר.",
      ],
    },
    vocabulary: [
      { word: "Lesson", Arabic: "درس", Hebrew: "שיעור" },
      { word: "Teacher", Arabic: "معلم", Hebrew: "מורה" },
      { word: "Repeat", Arabic: "يكرر", Hebrew: "לחזור" },
      { word: "Mistake", Arabic: "خطأ", Hebrew: "טעות" },
    ],
    questions: [
      {
        question: "What lesson does the person have?",
        answer: "The person has an English lesson.",
      },
      {
        question: "What does the teacher do?",
        answer: "The teacher helps the person.",
      },
    ],
    videoUrl: "",
    audioUrl: "",
  },

  {
    id: "story-english-b1-career-001",
    title: "My First Job Interview",
    level: "B1-B2",
    category: "Career",
    description: "An intermediate story about preparing for a job interview.",
    story: {
      English: [
        "Tomorrow I have my first job interview.",
        "I prepare my resume and read about the company.",
        "I practice answering common interview questions.",
        "I feel a little nervous, but I am also excited.",
        "I want to speak clearly and show my motivation.",
        "This interview is an important step in my career.",
      ],
      Arabic: [
        "غدًا لدي أول مقابلة عمل.",
        "أحضّر سيرتي الذاتية وأقرأ عن الشركة.",
        "أتدرب على إجابة أسئلة المقابلات الشائعة.",
        "أشعر ببعض التوتر، لكنني متحمس أيضًا.",
        "أريد أن أتحدث بوضوح وأظهر دافعي.",
        "هذه المقابلة خطوة مهمة في مساري المهني.",
      ],
      Hebrew: [
        "מחר יש לי ראיון עבודה ראשון.",
        "אני מכין את קורות החיים שלי וקורא על החברה.",
        "אני מתרגל תשובות לשאלות נפוצות בראיונות.",
        "אני מרגיש קצת לחוץ, אבל גם מתרגש.",
        "אני רוצה לדבר ברור ולהראות את המוטיבציה שלי.",
        "הראיון הזה הוא צעד חשוב בקריירה שלי.",
      ],
    },
    vocabulary: [
      { word: "Interview", Arabic: "مقابلة", Hebrew: "ראיון" },
      { word: "Resume", Arabic: "سيرة ذاتية", Hebrew: "קורות חיים" },
      { word: "Company", Arabic: "شركة", Hebrew: "חברה" },
      { word: "Motivation", Arabic: "دافع", Hebrew: "מוטיבציה" },
    ],
    questions: [
      {
        question: "What does the person prepare?",
        answer: "The person prepares a resume and reads about the company.",
      },
      {
        question: "How does the person feel?",
        answer: "The person feels nervous but excited.",
      },
    ],
    videoUrl: "",
    audioUrl: "",
  },

  {
    id: "story-english-b1-business-001",
    title: "Meeting A New Client",
    level: "B1-B2",
    category: "Business",
    description: "A business story about meeting a client and discussing a project.",
    story: {
      English: [
        "Today our team is meeting a new client.",
        "The client wants a better website for his business.",
        "We ask questions about his goals and budget.",
        "He explains that he needs a clean design and fast performance.",
        "After the meeting, we prepare a proposal.",
        "If the client accepts, we will start the project next week.",
      ],
      Arabic: [
        "اليوم فريقنا يلتقي بعميل جديد.",
        "العميل يريد موقعًا أفضل لعمله.",
        "نسأل أسئلة عن أهدافه وميزانيته.",
        "يشرح أنه يحتاج إلى تصميم نظيف وأداء سريع.",
        "بعد الاجتماع، نجهز عرضًا.",
        "إذا وافق العميل، سنبدأ المشروع الأسبوع القادم.",
      ],
      Hebrew: [
        "היום הצוות שלנו נפגש עם לקוח חדש.",
        "הלקוח רוצה אתר טוב יותר לעסק שלו.",
        "אנחנו שואלים שאלות על המטרות והתקציב שלו.",
        "הוא מסביר שהוא צריך עיצוב נקי וביצועים מהירים.",
        "אחרי הפגישה, אנחנו מכינים הצעה.",
        "אם הלקוח יסכים, נתחיל את הפרויקט בשבוע הבא.",
      ],
    },
    vocabulary: [
      { word: "Client", Arabic: "عميل", Hebrew: "לקוח" },
      { word: "Budget", Arabic: "ميزانية", Hebrew: "תקציב" },
      { word: "Proposal", Arabic: "عرض / اقتراح", Hebrew: "הצעה" },
      { word: "Project", Arabic: "مشروع", Hebrew: "פרויקט" },
    ],
    questions: [
      {
        question: "What does the client want?",
        answer: "The client wants a better website for his business.",
      },
      {
        question: "What will the team prepare after the meeting?",
        answer: "The team will prepare a proposal.",
      },
    ],
    videoUrl: "",
    audioUrl: "",
  },

  {
    id: "story-english-b1-social-001",
    title: "Making New Friends",
    level: "B1-B2",
    category: "Social",
    description: "A social story about meeting new people in a language class.",
    story: {
      English: [
        "I joined a language class in the city.",
        "At first, I did not know anyone.",
        "During the break, I started talking to two students.",
        "We talked about our countries, hobbies, and goals.",
        "They were friendly and easy to talk to.",
        "Now we practice English together after class.",
      ],
      Arabic: [
        "انضممت إلى صف لغة في المدينة.",
        "في البداية، لم أكن أعرف أحدًا.",
        "خلال الاستراحة، بدأت أتحدث مع طالبين.",
        "تحدثنا عن بلداننا وهواياتنا وأهدافنا.",
        "كانوا ودودين وسهل التحدث معهم.",
        "الآن نتدرب على الإنجليزية معًا بعد الدرس.",
      ],
      Hebrew: [
        "הצטרפתי לשיעור שפה בעיר.",
        "בהתחלה לא הכרתי אף אחד.",
        "במהלך ההפסקה התחלתי לדבר עם שני תלמידים.",
        "דיברנו על המדינות שלנו, תחביבים ומטרות.",
        "הם היו ידידותיים וקל היה לדבר איתם.",
        "עכשיו אנחנו מתרגלים אנגלית יחד אחרי השיעור.",
      ],
    },
    vocabulary: [
      { word: "Join", Arabic: "ينضم", Hebrew: "להצטרף" },
      { word: "Break", Arabic: "استراحة", Hebrew: "הפסקה" },
      { word: "Hobby", Arabic: "هواية", Hebrew: "תחביב" },
      { word: "Friendly", Arabic: "ودود", Hebrew: "ידידותי" },
    ],
    questions: [
      {
        question: "Where did the person meet new people?",
        answer: "The person met new people in a language class.",
      },
      {
        question: "What do they do after class?",
        answer: "They practice English together.",
      },
    ],
    videoUrl: "",
    audioUrl: "",
  },

  {
    id: "story-english-c1-business-001",
    title: "A Business Trip Decision",
    level: "C1-C2",
    category: "Business",
    description: "An advanced story about making a strategic business decision.",
    story: {
      English: [
        "Our company is considering a business trip to meet potential partners.",
        "The goal is to understand the market and build stronger relationships.",
        "Before making a decision, we review the budget, schedule, and expected results.",
        "Some team members believe the trip could create valuable opportunities.",
        "Others think we should start with online meetings to reduce costs.",
        "After a long discussion, we decide to organize one online meeting first.",
        "If the meeting goes well, we will plan the trip for next month.",
      ],
      Arabic: [
        "شركتنا تفكر في رحلة عمل للقاء شركاء محتملين.",
        "الهدف هو فهم السوق وبناء علاقات أقوى.",
        "قبل اتخاذ القرار، نراجع الميزانية والجدول والنتائج المتوقعة.",
        "بعض أعضاء الفريق يعتقدون أن الرحلة قد تخلق فرصًا قيمة.",
        "آخرون يعتقدون أننا يجب أن نبدأ باجتماعات عبر الإنترنت لتقليل التكاليف.",
        "بعد نقاش طويل، نقرر تنظيم اجتماع واحد عبر الإنترنت أولًا.",
        "إذا سار الاجتماع بشكل جيد، سنخطط للرحلة في الشهر القادم.",
      ],
      Hebrew: [
        "החברה שלנו שוקלת נסיעת עסקים כדי לפגוש שותפים פוטנציאליים.",
        "המטרה היא להבין את השוק ולבנות קשרים חזקים יותר.",
        "לפני קבלת החלטה, אנחנו בודקים את התקציב, לוח הזמנים והתוצאות הצפויות.",
        "חלק מחברי הצוות מאמינים שהנסיעה יכולה ליצור הזדמנויות חשובות.",
        "אחרים חושבים שכדאי להתחיל בפגישות אונליין כדי להפחית עלויות.",
        "אחרי דיון ארוך, אנחנו מחליטים לארגן קודם פגישה אונליין אחת.",
        "אם הפגישה תלך טוב, נתכנן את הנסיעה לחודש הבא.",
      ],
    },
    vocabulary: [
      { word: "Potential", Arabic: "محتمل", Hebrew: "פוטנציאלי" },
      { word: "Market", Arabic: "سوق", Hebrew: "שוק" },
      { word: "Expected results", Arabic: "نتائج متوقعة", Hebrew: "תוצאות צפויות" },
      { word: "Opportunity", Arabic: "فرصة", Hebrew: "הזדמנות" },
    ],
    questions: [
      {
        question: "Why is the company considering the trip?",
        answer: "The company wants to understand the market and build stronger relationships.",
      },
      {
        question: "What does the team decide to do first?",
        answer: "The team decides to organize one online meeting first.",
      },
    ],
    videoUrl: "",
    audioUrl: "",
  },

  {
    id: "story-english-c1-study-001",
    title: "Learning With Discipline",
    level: "C1-C2",
    category: "Study",
    description: "An advanced story about discipline, consistency, and language learning.",
    story: {
      English: [
        "Learning a language is not only about memorizing words.",
        "It requires discipline, patience, and regular practice.",
        "Many students feel motivated at the beginning, but they stop when progress becomes slow.",
        "The successful learner understands that small improvements matter.",
        "Reading, listening, speaking, and reviewing must become part of a daily routine.",
        "With enough consistency, confidence grows naturally.",
        "Over time, the language becomes less frightening and more useful.",
      ],
      Arabic: [
        "تعلم اللغة لا يتعلق فقط بحفظ الكلمات.",
        "إنه يتطلب الانضباط والصبر والتدريب المنتظم.",
        "يشعر الكثير من الطلاب بالحماس في البداية، لكنهم يتوقفون عندما يصبح التقدم بطيئًا.",
        "المتعلم الناجح يفهم أن التحسينات الصغيرة مهمة.",
        "القراءة والاستماع والتحدث والمراجعة يجب أن تصبح جزءًا من روتين يومي.",
        "مع الاستمرارية الكافية، تنمو الثقة بشكل طبيعي.",
        "مع الوقت، تصبح اللغة أقل خوفًا وأكثر فائدة.",
      ],
      Hebrew: [
        "ללמוד שפה זה לא רק לשנן מילים.",
        "זה דורש משמעת, סבלנות ותרגול קבוע.",
        "הרבה תלמידים מרגישים מוטיבציה בהתחלה, אבל מפסיקים כשההתקדמות נהיית איטית.",
        "הלומד המצליח מבין ששיפורים קטנים חשובים.",
        "קריאה, האזנה, דיבור וחזרה חייבים להפוך לחלק משגרה יומית.",
        "עם מספיק עקביות, הביטחון גדל באופן טבעי.",
        "עם הזמן, השפה הופכת לפחות מפחידה ויותר שימושית.",
      ],
    },
    vocabulary: [
      { word: "Memorizing", Arabic: "حفظ", Hebrew: "שינון" },
      { word: "Discipline", Arabic: "انضباط", Hebrew: "משמעת" },
      { word: "Consistency", Arabic: "استمرارية", Hebrew: "עקביות" },
      { word: "Confidence", Arabic: "ثقة", Hebrew: "ביטחון" },
    ],
    questions: [
      {
        question: "What does language learning require?",
        answer: "It requires discipline, patience, and regular practice.",
      },
      {
        question: "What happens with enough consistency?",
        answer: "Confidence grows naturally.",
      },
    ],
    videoUrl: "",
    audioUrl: "",
  },
];