# JavaScript Quiz and Assessment Portal 🚀

A modern, responsive, and feature-rich Single Page Application (SPA) designed for evaluating developer knowledge in **Core JavaScript (ES6+)**, **Asynchronous Programming**, and **React.js**.

Built for **Advanced Web Technologies (MCA) — Formative Assessment (FA-1 & FA-2)**.

- 🌐 **Live Deployed Application:** [https://js-quiz-portal.vercel.app/](https://js-quiz-portal.vercel.app/)
- 💻 **GitHub Repository:** [https://github.com/Bhakti-debug/js-quiz-portal](https://github.com/Bhakti-debug/js-quiz-portal)

---

## 🌟 Key Features

- **🔐 User Authentication & Role-Based Access Control (RBAC):**
  - Sign In (`/login`) & Sign Up (`/register`) with input validations.
  - Role management: **Student / Candidate** vs. **Faculty / Admin**.
  - **One-Click Demo Accounts** for immediate assessment and viva evaluation.
  - Protected routes (`ProtectedRoute.jsx`) preventing unauthorized access to assessment tests and administration tools.
- **⏱️ Timed Assessment Engine:**
  - Automated countdown timer hook (`useTimer.js`) with formatting (`MM:SS`).
  - Auto-submission on timeout.
  - Instant question feedback and comprehensive code explanation popups.
- **🏆 Gamification & Progress Tracking:**
  - XP (Experience Points) system: 10 XP per correct response.
  - Dynamic Level progression formula (`Level = floor(XP / 100) + 1`).
  - Per-user assessment history, percentage scores, and average performance metrics.
- **🛠️ Admin Management Portal (`/admin`):**
  - Complete **CRUD Operations** for quizzes and questions.
  - Add, edit, view, and delete questions with option validations.
  - Create new timed quiz categories with difficulty tiers (Beginner, Intermediate, Advanced).
- **🎨 Modern Glassmorphic Dark UI:**
  - Built with pure CSS3 variables, gradients, and backdrop blur (`backdrop-filter`).
  - Fully responsive across desktop, tablet, and mobile screens.
- **💾 Local API Simulation Layer:**
  - Async/await mock service layer (`services/api.js`) simulating server latency and persisting to browser `localStorage`.

---

## 👥 Demo Credentials

For quick evaluation and testing without registering:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `student@quiz.com` | `student123` | Take tests, view user XP, earn level badges, view attempt history |
| **Faculty / Admin** | `admin@quiz.com` | `admin123` | All student features + Admin CRUD workbench (`/admin`) |

*Tip: On the Sign In page, click the **One-Click Demo Access** buttons to log in instantly.*

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 19 (Functional Components, Hooks, Context API)
- **Routing:** React Router v7 (`react-router-dom`)
- **Build System:** Vite 8 (Ultra-fast HMR and Rollup build bundling)
- **Icons:** Lucide React
- **Styling:** Custom CSS3 (Glassmorphism, Flexbox, CSS Grid)
- **Code Linter:** Oxlint

---

## 📁 Project Structure

```
c:/quiz/
├── public/                 # Static public assets
├── docs/                   # Academic reports & presentation materials
│   ├── FA1_Progress_Report.md
│   ├── FA2_Project_Report.md
│   └── Presentation_Slides.md
├── src/
│   ├── assets/             # Images and SVG icons
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation bar with user profile & auth status
│   │   └── ProtectedRoute.jsx # Route guards for auth & admin permissions
│   ├── context/            # React Context state management
│   │   └── QuizContext.jsx # Global provider for auth, quizzes, and history
│   ├── hooks/              # Custom React hooks
│   │   └── useTimer.js     # Interval-based timer countdown hook
│   ├── pages/              # Main route views
│   │   ├── Dashboard.jsx   # Assessment catalog, search, and student stats
│   │   ├── QuizView.jsx    # Interactive assessment taking & grading view
│   │   ├── AdminPortal.jsx # CRUD management for quizzes & questions
│   │   ├── Login.jsx       # Authentication sign-in with demo buttons
│   │   └── Register.jsx    # User registration with role selection
│   ├── services/           # Service & persistence layer
│   │   └── api.js          # Mock async API & LocalStorage database
│   ├── App.jsx             # Root router & application routes
│   ├── index.css           # Global glassmorphism design system
│   └── main.jsx            # Application entry point
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` (comes with Node.js)

### 2. Installation
```bash
npm install
```

### 3. Run Locally (Development)
```bash
npm run dev
```
Open your browser and navigate to the local URL (usually `http://localhost:5173`).

### 4. Build for Production
```bash
npm run build
```
Generates optimized, minified production assets in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deployment Instructions

### Option A: Deploy to Vercel (Recommended)
1. Push your code to GitHub (see instructions below).
2. Go to [Vercel](https://vercel.com) and log in with GitHub.
3. Click **Add New...** > **Project**.
4. Import your `quiz` repository.
5. Vercel will auto-detect **Vite**. Keep standard settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click **Deploy**. Your site will be live within seconds!

### Option B: Deploy to Netlify
1. Go to [Netlify](https://www.netlify.com/) and sign in.
2. Click **Add new site** > **Import an existing project**.
3. Select your GitHub repository.
4. Set:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. For single-page routing on Netlify, a simple `_redirects` file in `public/` containing `/* /index.html 200` ensures all sub-routes work on refresh.
6. Click **Deploy Site**.
