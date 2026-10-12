// Mock API and LocalStorage database service for the JavaScript Quiz Portal

const INITIAL_QUIZZES = [
  {
    id: "js-es6",
    title: "JavaScript ES6+ Essentials",
    description: "Test your knowledge of arrow functions, destructuring, template literals, and modern ES6+ features.",
    category: "JavaScript",
    difficulty: "Beginner",
    timeLimit: 120, // seconds
    questions: [
      {
        id: "q1",
        text: "Which of the following is NOT a valid way to declare a variable in ES6?",
        options: ["var", "let", "const", "define"],
        correctOptionIndex: 3,
        explanation: "'define' is not a variable declaration keyword in JavaScript. ES6 uses var, let, and const."
      },
      {
        id: "q2",
        text: "What is the output of: const square = x => x * x; console.log(square(5));",
        options: ["5", "25", "undefined", "ReferenceError"],
        correctOptionIndex: 1,
        explanation: "This is an arrow function with an implicit return. 5 * 5 = 25."
      },
      {
        id: "q3",
        text: "Which operator is used to unpack elements of an array or properties of an object?",
        options: ["Spread (...) operator", "Rest operator", "Destructuring syntax", "Both Spread and Destructuring"],
        correctOptionIndex: 3,
        explanation: "Destructuring extracts properties/elements, while the spread operator (...) expands arrays/objects."
      }
    ]
  },
  {
    id: "js-async",
    title: "Asynchronous JavaScript",
    description: "Master Promises, async/await, Event Loop, and fetch API.",
    category: "JavaScript",
    difficulty: "Intermediate",
    timeLimit: 180,
    questions: [
      {
        id: "q4",
        text: "What state is a Promise in when it is first created?",
        options: ["fulfilled", "rejected", "pending", "resolved"],
        correctOptionIndex: 2,
        explanation: "A Promise starts in the 'pending' state and later transitions to either 'fulfilled' or 'rejected'."
      },
      {
        id: "q5",
        text: "Which keyword must precede a function definition to allow the use of 'await' inside it?",
        options: ["promise", "defer", "async", "wait"],
        correctOptionIndex: 2,
        explanation: "The 'async' keyword must be placed before a function declaration to enable 'await' inside its body."
      }
    ]
  },
  {
    id: "react-core",
    title: "React.js Core Fundamentals",
    description: "Components, JSX, Props, State, and Event Handling.",
    category: "React",
    difficulty: "Intermediate",
    timeLimit: 150,
    questions: [
      {
        id: "q6",
        text: "What is the purpose of the 'key' prop in React lists?",
        options: [
          "To uniquely identify elements and help React identify which items changed, are added, or are removed.",
          "To apply specific styles to list elements.",
          "To bind event handlers to list elements.",
          "To fetch data for each item dynamically."
        ],
        correctOptionIndex: 0,
        explanation: "Keys help React identify which items have changed, been added, or been removed, optimizing DOM updates."
      },
      {
        id: "q7",
        text: "State in React is read-only. How should you update it?",
        options: [
          "By modifying the state variable directly (e.g., state = newValue).",
          "By calling the state updater function provided by useState.",
          "By refreshing the webpage.",
          "React state cannot be updated once set."
        ],
        correctOptionIndex: 1,
        explanation: "You must always use the state setter function (e.g., setState) so that React knows the state changed and schedules a re-render."
      }
    ]
  }
];

const STORAGE_KEYS = {
  QUIZZES: "js_quiz_portal_quizzes",
  HISTORY: "js_quiz_portal_history",
  USERS: "js_quiz_portal_users",
  CURRENT_SESSION: "js_quiz_portal_session"
};

const DEFAULT_USERS = [
  {
    id: "user-student-demo",
    username: "Bhakti Student",
    email: "student@quiz.com",
    password: "student123",
    role: "student",
    xp: 60,
    level: 1,
    createdAt: "2026-08-30"
  },
  {
    id: "user-admin-demo",
    username: "Admin Avinash",
    email: "admin@quiz.com",
    password: "admin123",
    role: "admin",
    xp: 300,
    level: 4,
    createdAt: "2026-08-30"
  }
];

const DEFAULT_HISTORY = [
  {
    id: "res-demo-1",
    userId: "user-student-demo",
    quizId: "js-es6",
    quizTitle: "JavaScript ES6+ Essentials",
    score: 3,
    totalQuestions: 3,
    percentage: 100,
    date: "10/10/2026"
  },
  {
    id: "res-demo-2",
    userId: "user-student-demo",
    quizId: "js-async",
    quizTitle: "Asynchronous JavaScript",
    score: 2,
    totalQuestions: 2,
    percentage: 100,
    date: "11/10/2026"
  }
];

// Seed database if empty
const seedDatabase = () => {
  if (!localStorage.getItem(STORAGE_KEYS.QUIZZES)) {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(INITIAL_QUIZZES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(DEFAULT_HISTORY));
  }
  // Default login session to student demo so initial view is instantly populated
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(DEFAULT_USERS[0]));
  }
};

seedDatabase();

// Helper delay to simulate API calls
const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- AUTHENTICATION & USERS ---
  
  getCurrentUser: async () => {
    await delay(100);
    const session = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (!session) return null;
    try {
      const userObj = JSON.parse(session);
      // Fetch fresh user data from users list
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
      const freshUser = users.find(u => u.id === userObj.id) || userObj;
      return freshUser;
    } catch {
      return null;
    }
  },

  login: async (email, password) => {
    await delay(300);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const matchedUser = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      throw new Error("Invalid email or password. Please try again.");
    }

    const { password: _, ...safeUser } = matchedUser;
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(safeUser));
    return safeUser;
  },

  register: async ({ username, email, password, role = "student" }) => {
    await delay(300);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: `user-${Date.now()}`,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: role || "student",
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(safeUser));
    return safeUser;
  },

  logout: async () => {
    await delay(150);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    return true;
  },

  updateUserProfile: async (userData) => {
    await delay();
    const currentSession = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION));
    if (!currentSession) throw new Error("Not logged in");

    let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const userIndex = users.findIndex(u => u.id === currentSession.id);
    if (userIndex === -1) throw new Error("User record not found");

    const updatedUser = { ...users[userIndex], ...userData };
    users[userIndex] = updatedUser;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const { password: _, ...safeUser } = updatedUser;
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(safeUser));
    return safeUser;
  },

  // --- QUIZZES ---

  getQuizzes: async () => {
    await delay();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES)) || [];
  },

  createQuiz: async (quiz) => {
    await delay();
    const quizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES)) || [];
    const newQuiz = {
      ...quiz,
      id: quiz.id || `quiz-${Date.now()}`,
      questions: quiz.questions || []
    };
    quizzes.push(newQuiz);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    return newQuiz;
  },

  deleteQuiz: async (quizId) => {
    await delay();
    let quizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES)) || [];
    quizzes = quizzes.filter(q => q.id !== quizId);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    return true;
  },

  createQuestion: async (quizId, question) => {
    await delay();
    const quizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES)) || [];
    const quizIndex = quizzes.findIndex(q => q.id === quizId);
    if (quizIndex === -1) throw new Error("Quiz not found");

    const newQuestion = {
      ...question,
      id: `q-${Date.now()}`
    };

    quizzes[quizIndex].questions.push(newQuestion);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    return newQuestion;
  },

  updateQuestion: async (quizId, questionId, updatedQuestion) => {
    await delay();
    const quizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES)) || [];
    const quizIndex = quizzes.findIndex(q => q.id === quizId);
    if (quizIndex === -1) throw new Error("Quiz not found");

    const questionIndex = quizzes[quizIndex].questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) throw new Error("Question not found");

    quizzes[quizIndex].questions[questionIndex] = {
      ...quizzes[quizIndex].questions[questionIndex],
      ...updatedQuestion,
      id: questionId
    };

    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    return quizzes[quizIndex].questions[questionIndex];
  },

  deleteQuestion: async (quizId, questionId) => {
    await delay();
    const quizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES)) || [];
    const quizIndex = quizzes.findIndex(q => q.id === quizId);
    if (quizIndex === -1) throw new Error("Quiz not found");

    quizzes[quizIndex].questions = quizzes[quizIndex].questions.filter(q => q.id !== questionId);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
    return true;
  },

  // --- RESULTS & HISTORY ---

  saveQuizResult: async (result) => {
    await delay();
    const currentSession = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION));
    const userId = currentSession ? currentSession.id : "guest";

    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY)) || [];
    const newResult = {
      ...result,
      userId,
      id: `res-${Date.now()}`,
      date: new Date().toLocaleDateString()
    };
    history.push(newResult);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

    let updatedSafeUser = currentSession;
    if (currentSession && currentSession.id) {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
      const userIndex = users.findIndex(u => u.id === currentSession.id);
      if (userIndex !== -1) {
        const xpAwarded = result.score * 10;
        users[userIndex].xp = (users[userIndex].xp || 0) + xpAwarded;
        users[userIndex].level = Math.floor(users[userIndex].xp / 100) + 1;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

        const { password: _, ...safeUser } = users[userIndex];
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(safeUser));
        updatedSafeUser = safeUser;
      }
    }

    return { result: newResult, user: updatedSafeUser };
  },

  getQuizHistory: async (userId = null) => {
    await delay();
    const allHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY)) || [];
    if (!userId) {
      const currentSession = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION));
      if (!currentSession) return [];
      // If admin, they could see all or their own; default to their own
      return allHistory.filter(h => h.userId === currentSession.id);
    }
    return allHistory.filter(h => h.userId === userId);
  }
};
