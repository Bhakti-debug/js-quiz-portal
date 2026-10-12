# Formative Assessment-1 (FA-1) Progress Report
**Course Name:** Advanced Web Technologies  
**Course Owner:** Dr. Avinash Chormale  
**Academic Year:** 2026 - 2027  
**Class / Sem:** SYMCA / Semester III  
**Student Name / Roll No:** MCA Student  
**Project Title:** JavaScript Quiz and Assessment Portal  

---

## Table of Contents
1. [Problem Statement](#1-problem-statement)
2. [Objectives](#2-objectives)
3. [Functional Requirements](#3-functional-requirements)
4. [Use Case Identification & Analysis](#4-use-case-identification--analysis)
5. [Wireframe & User Interface Design](#5-wireframe--user-interface-design)
6. [React Folder Structure & Architecture](#6-react-folder-structure--architecture)
7. [Phase-I Component Implementation](#7-phase-i-component-implementation)
8. [Conclusion & Next Steps](#8-conclusion--next-steps)

---

## 1. Problem Statement
Modern web development demands high proficiency in Core JavaScript (ES6+) and React.js. However, students and developers often struggle to find centralized, interactive assessment tools that test deep conceptual understanding (such as closures, event loops, component rendering lifecycle, hooks) with immediate pedagogical explanations. Standard generic assessment platforms lack context-specific debugging questions. 

The **JavaScript Quiz and Assessment Portal** solves this problem by providing a specialized, responsive, web-based assessment engine designed specifically for testing frontend developer competencies. It includes features to self-assess, earn experience points (XP), visualize performance trends, and manage quiz content dynamically.

---

## 2. Objectives
- **Interactive Self-Assessment:** Enable users to test knowledge of JavaScript (ES6+ basics, Asynchronous operations) and React Core.
- **Immediate Pedagogical Feedback:** Provide contextual, written explanations for every question immediately upon answer validation.
- **Progression Tracking:** Reward quiz completions with XP points to support gamified learning progress.
- **Extensible Database System:** Provide administrators with complete, user-friendly CRUD capability to modify questions without touching source code.
- **Responsive Premium Layouts:** Ensure mobile, tablet, and desktop compatibility using high-end CSS aesthetics (dark-theme, glassmorphism, responsive tables).

---

## 3. Functional Requirements
1. **User Authentication & Profile Setup:**
   - Default login for users to save custom usernames.
   - Profile tracker for accumulated XP and Level stats.
2. **Quiz Search and Categorization:**
   - Filter quizzes by Category (JavaScript, React) and Difficulty (Beginner, Intermediate, Advanced).
   - Real-time search indexing titles and descriptions.
3. **Assessment Engine (Core):**
   - Timing controller that monitors and enforces assessment constraints.
   - Multiple-choice layout with option selection tracking.
   - Confirmation step with instant correction status and developer explanations.
4. **Result Diagnostics:**
   - Final percentage score presentation with total correct answers indicator.
   - Comprehensive revision sheet detailing user choices vs. correct solutions.

---

## 4. Use Case Identification & Analysis
The system identifies two primary Actors:
1. **Student / Developer (Candidate)**
2. **Quiz Administrator**

### Student Use Cases:
- **Configure Profile**: Rename username.
- **Search & Filter Quizzes**: Navigate quizzes by difficulty or tag.
- **Take Quiz**: Select options, track remaining time, confirm answers.
- **Review History**: Browse previous attempts and performance statistics.

### Administrator Use Cases:
- **Create Quiz Database**: Initialize a new category/theme with a custom time limit.
- **Manage Questions (CRUD)**: Insert new questions, edit text/options/explanations, and delete questions from the active database.

---

## 5. Wireframe & User Interface Design
The application utilizes a glassmorphism interface backed by a dark space theme.

### Component Design Layout:
```
+-------------------------------------------------------------------------+
| [Logo] JS Quiz Portal          Dashboard    Admin Portal     Lvl 2 [XP] |
+-------------------------------------------------------------------------+
| Welcome back, Student! [Rename Profile]   Stats: 350XP | 3 Quizzes Done |
+-------------------------------------------------------------------------+
| Filters                 |  Available Assessments (3)                    |
| [Search Quiz.........]  |  +------------------------------------------+ |
| Category: [All      v]  |  | JavaScript ES6+ Essentials  [Beginner]   | |
| Difficulty: [All    v]  |  | 3 Questions | 2 Mins        [Start Quiz] | |
|                         |  +------------------------------------------+ |
| Recent Attempts         |  | Asynchronous JS             [Intermediate] | |
| - ES6 Essentials: 3/3   |  | 2 Questions | 3 Mins        [Start Quiz] | |
+-------------------------+----------------------------------------------+
```

---

## 6. React Folder Structure & Architecture
The project structure is built inside a Vite environment:
```
quiz/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── Navbar.jsx           # Global glass header
│   ├── context/
│   │   └── QuizContext.jsx      # Global React Context provider for state
│   ├── hooks/
│   │   └── useTimer.js          # Custom timing hook
│   ├── pages/
│   │   ├── Dashboard.jsx        # Landing page with stats, filters
│   │   ├── QuizView.jsx         # Core Assessment Engine & results review
│   │   └── AdminPortal.jsx      # CRUD panel for quizzes/questions
│   ├── services/
│   │   └── api.js               # LocalStorage mock database CRUD service
│   ├── index.css                # Premium custom CSS variables & animations
│   ├── main.jsx                 # Application entry root
│   └── App.jsx                  # React Router mapping
├── package.json
└── vite.config.js
```

---

## 7. Phase-I Component Implementation
The core React fundamentals are integrated as follows:
- **JSX & Functional Components:** Every layout block is constructed using modular, clean functional JSX components.
- **Props:** Passed to reuse icons and dynamic text structures.
- **State Management (`useState`):** Handled for local values (active choice index, modal states, search queries).
- **Conditional Rendering:** Toggles between quiz question screen and final results layout; filters display depending on selections.
- **Lists and Keys:** Renders lists of options, table rows, and quiz cards using distinct unique identifiers (`q.id`, `index`).

---

## 8. Conclusion & Next Steps
During Phase-I (FA-1), the core database setup, folder structure, styling guidelines, and state systems were completed. In Phase-II (FA-2), the application expands to integrate deep react hooks (`useContext`, `useReducer`), routing paths (`react-router-dom`), mock service API async CRUD controllers, and advanced input validation forms.
