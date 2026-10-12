import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { Search, SlidersHorizontal, BookOpen, Clock, Award, History, Edit } from "lucide-react";

export const Dashboard = () => {
  const { quizzes, user, history, updateProfile } = useQuiz();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (newUsername.trim()) {
      updateProfile({ username: newUsername.trim() });
      setIsEditingProfile(false);
    }
  };

  // Filter logic
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || quiz.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || quiz.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyBadgeClass = (diff) => {
    switch (diff) {
      case "Beginner": return "badge-beginner";
      case "Intermediate": return "badge-intermediate";
      case "Advanced": return "badge-advanced";
      default: return "";
    }
  };

  const getCategoryBadgeClass = (cat) => {
    return cat.toLowerCase() === "react" ? "badge-react" : "badge-js";
  };

  // Calculation for stats
  const totalAttempts = history.length;
  const averagePercentage = totalAttempts > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.percentage, 0) / totalAttempts)
    : 0;

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card welcome-banner" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            {user ? (
              <>
                Welcome back, <span style={{ color: "var(--color-primary-hover)" }}>{user.username}</span>!
                <span className={`role-pill ${user.role === "admin" ? "role-pill-admin" : "role-pill-student"}`} style={{ marginLeft: "0.75rem", verticalAlign: "middle" }}>
                  {user.role === "admin" ? "Faculty Admin" : "Student"}
                </span>
              </>
            ) : (
              <>Welcome to <span style={{ color: "var(--color-primary-hover)" }}>JS Quiz Portal</span>!</>
            )}
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {user
              ? "Test your JavaScript and React capabilities, complete assessments, and level up your developer rank."
              : "Sign in or register to participate in timed developer assessments, earn XP, and unlock ranks."}
          </p>
        </div>
        
        <div className="profile-edit-box">
          {user ? (
            isEditingProfile ? (
              <form onSubmit={handleProfileSubmit} style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  className="form-input"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  maxLength={20}
                  required
                  style={{ padding: "0.5rem" }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>Save</button>
                <button type="button" className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }} onClick={() => setIsEditingProfile(false)}>Cancel</button>
              </form>
            ) : (
              <button className="btn btn-secondary" onClick={() => { setNewUsername(user?.username || ""); setIsEditingProfile(true); }}>
                <Edit size={16} />
                <span>Rename Profile</span>
              </button>
            )
          ) : (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link to="/login" className="btn btn-primary">Sign In</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        <div className="glass-card stats-card" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: "12px", background: "rgba(139, 92, 246, 0.15)", color: "var(--color-primary-hover)" }}>
            <Award size={28} />
          </div>
          <div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "600" }}>Total Points</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{user?.xp} XP</div>
          </div>
        </div>

        <div className="glass-card stats-card" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: "12px", background: "rgba(6, 182, 212, 0.15)", color: "var(--color-secondary)" }}>
            <History size={28} />
          </div>
          <div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "600" }}>Assessments Completed</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{totalAttempts}</div>
          </div>
        </div>

        <div className="glass-card stats-card" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem" }}>
          <div style={{ padding: "0.75rem", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", color: "var(--color-success)" }}>
            <BookOpen size={28} />
          </div>
          <div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "600" }}>Average Score</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{averagePercentage}%</div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Search/Filters & Quiz Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem" }}>
        
        {/* Sidebar Filters */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", fontSize: "1.1rem" }}>
              <SlidersHorizontal size={18} />
              <span>Filters</span>
            </h3>

            {/* Search */}
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Search Quiz</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ width: "100%", paddingLeft: "2.5rem" }}
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              </div>
            </div>

            {/* Category */}
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="JavaScript">JavaScript</option>
                <option value="React">React</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Mini-History Panel */}
          {history.length > 0 && (
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem" }}>Recent Attempts</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {history.slice(-3).reverse().map((h, i) => (
                  <div key={i} style={{ fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "600" }}>{h.quizTitle}</div>
                      <span style={{ color: "var(--text-muted)" }}>{h.date}</span>
                    </div>
                    <div style={{ fontWeight: "700", color: h.percentage >= 70 ? "var(--color-success)" : "var(--color-warning)" }}>
                      {h.score}/{h.totalQuestions}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quiz Grid */}
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Available Assessments ({filteredQuizzes.length})</h2>
          
          {filteredQuizzes.length === 0 ? (
            <div className="glass-card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <BookOpen size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
              <h3>No Quizzes Found</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid-cards" style={{ marginTop: "0" }}>
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="glass-card" style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                      <span className={`badge ${getCategoryBadgeClass(quiz.category)}`}>{quiz.category}</span>
                      <span className={`badge ${getDifficultyBadgeClass(quiz.difficulty)}`}>{quiz.difficulty}</span>
                    </div>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{quiz.title}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{quiz.description}</p>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <BookOpen size={16} />
                        {quiz.questions.length} Questions
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock size={16} />
                        {Math.round(quiz.timeLimit / 60)} mins
                      </span>
                    </div>
                    
                    {quiz.questions.length > 0 ? (
                      <Link to={`/quiz/${quiz.id}`} className="btn btn-primary" style={{ width: "100%" }}>
                        Start Assessment
                      </Link>
                    ) : (
                      <button className="btn btn-secondary" style={{ width: "100%" }} disabled>
                        No Questions Added
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
