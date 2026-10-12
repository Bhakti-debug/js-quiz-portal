# Formative Assessment-2 (FA-2) Project Report
**Course Name:** Advanced Web Technologies (MCA)  
**Academic Year:** 2026 - 2027  
**Class & Semester:** SYMCA, Semester III  
**Project Title:** JavaScript Quiz and Assessment Portal  
**Course Owner & Evaluator:** Dr. Avinash Chormale  

---

## Executive Summary
The **JavaScript Quiz and Assessment Portal** is a production-ready, client-oriented single-page application (SPA) designed to test developers on core JavaScript (ES6+), async patterns, and React.js programming principles. Building on the core structures initialized in Phase-I (FA-1), Phase-II integrates user authentication with Role-Based Access Control (RBAC), protected routing, advanced React hooks, client-side routing, modular form structures with interactive field validations, state contexts, and mock API data services. The resulting application provides an automated gamified assessment flow (XP systems and Level indicators) coupled with an administrative backend for database modifications (Create, Read, Update, Delete operations).

### Project Links
- **GitHub Repository:** `[GITHUB_REPO_URL]`
- **Live Deployed Application:** `[DEPLOYED_APP_URL]`

---

## 1. Introduction & Background
### 1.1 Project Overview
In modern academic and professional settings, evaluating coding knowledge extends beyond simple syntax identification. Developers must comprehend runtime behaviors, call stacks, hook behaviors, and rendering lifecycles. Traditional multiple-choice systems rarely focus specifically on technical code comprehension. This application offers an interactive, styled, self-contained portal where candidates take timed tests and administrators manage the assessment database.

### 1.2 System Scope
The application covers:
- User Authentication (Login, Register, Logout) with Role-Based Access Control (Student vs Admin).
- Protected Routes safeguarding assessment sessions and administrative panels.
- Dynamic test execution with automated timers.
- Search indexes and metadata classification (category, difficulty, question volume, time-limit).
- Leaderboard tracker, XP points system, and per-user attempt history.
- Administrative CRUD portal to update, add, or delete quiz questions and quizzes.
- Standalone execution capabilities powered by local storage API simulation.

---

## 2. System Requirement Specifications (SRS)
### 2.1 Hardware Requirements
- **Processor:** Dual-core Intel/AMD CPU @ 2.0 GHz or higher.
- **Memory:** 4 GB RAM minimum.
- **Storage:** 200 MB free space (code repository).

### 2.2 Software Requirements
- **Operating System:** Windows, macOS, or Linux.
- **Runtime Environment:** Node.js v18.0.0 or higher.
- **Package Manager:** npm v9.0.0 or higher.
- **Browsers:** Google Chrome, Mozilla Firefox, Microsoft Edge, Safari (latest versions).

### 2.3 Non-Functional Requirements
- **Performance:** App screens load in < 500ms; filtering/sorting operations perform instantly.
- **Usability:** High-contrast dark theme with consistent margins, labels, and feedback.
- **Reliability:** Data persists reliably across browser reloads using the LocalStorage API.
- **Responsiveness:** Fluid styling layouts adapting automatically to mobile (320px+), tablet (768px+), and desktop resolutions.

---

## 3. System Design & Architecture
The portal operates as a client-side Single Page Application (SPA) structured around a centralized state context and local mock service API.

### 3.1 Component Architecture
```
       +------------------[ Router (App.jsx) ]------------------+
       |                                                         |
       v                                                         v
[ Navbar.jsx ]                                         [ Page Content Routes ]
(Global Stats, XP)                                               |
                                        +------------------------+------------------------+
                                        |                        |                        |
                                        v                        v                        v
                                [ Dashboard.jsx ]          [ QuizView.jsx ]       [ AdminPortal.jsx ]
                                (Filters, Stats)           (Timer, Engine)        (CRUD, Validations)
```

### 3.2 State Flow Diagram
```
+------------------+     Loads Init      +----------------------+
| LocalStorage DB  | ==================> |   QuizContext.jsx    |
| (Quizzes/Stats)  | <================== | (Global State Provider)|
+------------------+     Saves Update    +----------------------+
                                                    ||
                                                    || Exposes API & States
                                                    v
                                         +----------------------+
                                         | Pages & Components   |
                                         | (Dashboard, Admin,   |
                                         |  Quiz session cards) |
                                         +----------------------+
```

---

## 4. Advanced React Features & Implementation
This project utilizes advanced React features to satisfy the FA-2 evaluation rubric:

### 4.1 Client-Side Routing
Utilizes `react-router-dom` to implement clean URL structures, allowing bookmarking and decoupled page loading:
- `/` - Main Student Dashboard.
- `/quiz/:id` - Active quiz session matching parameter IDs.
- `/admin` - CRUD administration workbench.

### 4.2 State Management & Context (`QuizContext.jsx`)
Exposes shared states without prop drilling:
- `quizzes`: Array containing available quiz models and question trees.
- `user`: Tracks profile parameters (`username`, `xp`, `level`).
- `history`: Array tracking past scores, percentages, and completed dates.
- CRUD handles: `addQuiz`, `removeQuiz`, `addQuestion`, `editQuestion`, `removeQuestion`.

### 4.3 Custom Hook (`useTimer.js`)
Capsulates the timing mechanism using React `useEffect` hooks and reference wrappers. It keeps an accurate countdown running on intervals and invokes an automated submission callback once `timeLeft === 0`.

### 4.4 Local API Mocking Layer (`api.js`)
Simulates server-side latency using async/await promises:
```javascript
const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getQuizzes: async () => {
    await delay();
    return JSON.parse(localStorage.getItem("js_quiz_portal_quizzes"));
  },
  ...
};
```
This isolates the database interface so it can easily swap to real REST fetch calls (`axios` or `fetch`) in the future without editing UI code.

### 4.5 User Authentication & Role-Based Access Control (RBAC)
To ensure data security, multi-user tracking, and role separation, the portal integrates client-side authentication:
- **Authentication Views**:
  - `/login`: Form for existing users to sign in. Includes instant **One-Click Demo Access** buttons for examiners to test with pre-seeded Student and Faculty accounts without manual entry.
  - `/register`: Allows new users to create accounts with email, password validation (minimum 6 characters, confirmation match), and role selection.
- **Role Hierarchy**:
  - `student`: Standard candidate access. Can take timed quizzes, accumulate XP (10 XP per correct question), achieve level ranks, and track their personal assessment attempt history.
  - `admin`: Authorized instructor/evaluator access. In addition to all student features, possesses full access to the Admin Portal (`/admin`) to perform CRUD modifications.
- **Protected Routing (`ProtectedRoute.jsx`)**:
  - Verifies authentication status prior to loading assessment or administrative interfaces. Unauthenticated visits to `/quiz/:id` redirect users to `/login`.
  - Evaluates `requireAdmin={true}` on the `/admin` path. Non-admin users are blocked and presented with an informative "Administrator Access Required" prompt with single-click options to switch accounts or return to the dashboard.
- **Session Management**:
  - Active login state is maintained through browser session storage and synced with `QuizContext.jsx`.
  - Supports clean single-click session logout, wiping credentials from state and redirecting to the login interface.

---

## 5. Admin CRUD Operations & Validation
The `/admin` route renders the control center for editing quiz question nodes:

- **Create Quiz**: Initiates new quiz sheets defining category headers, difficulty, and duration variables.
- **Read Questions**: Renders data tables indexing current questions, option lists, and answer keys.
- **Update Question**: Automatically loads current question data into form fields, letting administrators modify parameters and write explanations.
- **Delete Question**: Removes questions from database trees with standard confirm prompts.

### Form Field Validations
Before submitting modifications, forms enforce checks:
- Text inputs must not be empty (prevents blank questions).
- Explanations must be populated.
- At least 2 options must contain non-empty strings.
- The correct option index is validated to ensure it falls within the range of valid options.

---

## 6. Testing & Build Optimization
### 6.1 Build Checks
The application uses Vite's rollup builder to package resources into optimized production assets. Running `npm run build` generates minimized HTML, CSS, and JS chunks under the `dist/` directory.

### 6.2 Error Handling
- Context initializers include try/catch structures. If loading from local storage fails, the app updates a global state `error` banner and presents user-friendly troubleshooting directions.
- Fallback structures prevent crashes if quiz questions or assets are requested with invalid URL parameters.

---

## 7. Conclusion & Future Enhancements
The completed **JavaScript Quiz and Assessment Portal** represents a responsive, feature-rich web platform. It addresses all grading parameters for MCA Advanced Web Technologies coursework. 

Future roadmap features include:
- Real-time online competitive matchmaking using WebSockets.
- Dynamic coding sandbox integration using systems like Monaco Editor to evaluate written code snippets.
- Authentication integration with OAuth providers (GitHub, Google).
