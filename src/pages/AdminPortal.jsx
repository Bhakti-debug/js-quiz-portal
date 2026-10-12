import React, { useState, useEffect } from "react";
import { useQuiz } from "../context/QuizContext";
import { Plus, Edit2, Trash2, X, Check, Save } from "lucide-react";

export const AdminPortal = () => {
  const { quizzes, addQuiz, removeQuiz, addQuestion, editQuestion, removeQuestion } = useQuiz();

  const [activeQuizId, setActiveQuizId] = useState(quizzes[0]?.id || "");
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(null); // Null for 'Add New'

  useEffect(() => {
    if ((!activeQuizId || !quizzes.some(q => q.id === activeQuizId)) && quizzes.length > 0) {
      setActiveQuizId(quizzes[0].id);
    }
  }, [quizzes, activeQuizId]);
  
  // Question Form Fields
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [errors, setErrors] = useState({});

  // Quiz Form Fields
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizCategory, setNewQuizCategory] = useState("JavaScript");
  const [newQuizDifficulty, setNewQuizDifficulty] = useState("Beginner");
  const [newQuizLimit, setNewQuizLimit] = useState(120);
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);

  const selectedQuiz = quizzes.find(q => q.id === activeQuizId);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!questionText.trim()) newErrors.questionText = "Question text is required";
    if (!explanation.trim()) newErrors.explanation = "Explanation is required";
    
    const validOptions = options.filter(opt => opt.trim() !== "");
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 non-empty options are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenAddForm = () => {
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectOption(0);
    setExplanation("");
    setErrors({});
    setCurrentQuestionId(null);
    setIsEditingQuestion(true);
  };

  const handleOpenEditForm = (q) => {
    setQuestionText(q.text);
    // Assure exactly 4 slots for options form simplicity
    const opts = [...q.options];
    while (opts.length < 4) opts.push("");
    setOptions(opts);
    setCorrectOption(q.correctOptionIndex);
    setExplanation(q.explanation);
    setErrors({});
    setCurrentQuestionId(q.id);
    setIsEditingQuestion(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Filter out blank options
    const finalOptions = options.filter(opt => opt.trim() !== "");

    const questionData = {
      text: questionText.trim(),
      options: finalOptions,
      correctOptionIndex: correctOption >= finalOptions.length ? 0 : correctOption,
      explanation: explanation.trim()
    };

    try {
      if (currentQuestionId) {
        await editQuestion(activeQuizId, currentQuestionId, questionData);
      } else {
        await addQuestion(activeQuizId, questionData);
      }
      setIsEditingQuestion(false);
    } catch (err) {
      alert("Failed to save question: " + err.message);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      await removeQuestion(activeQuizId, qId);
    }
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    if (!newQuizTitle.trim()) return;

    const quizData = {
      title: newQuizTitle.trim(),
      description: `Custom quiz about ${newQuizCategory}`,
      category: newQuizCategory,
      difficulty: newQuizDifficulty,
      timeLimit: Number(newQuizLimit),
      questions: []
    };

    const created = await addQuiz(quizData);
    setActiveQuizId(created.id);
    setNewQuizTitle("");
    setShowAddQuizModal(false);
  };

  const handleDeleteQuiz = async () => {
    if (window.confirm(`Are you sure you want to delete the entire quiz "${selectedQuiz.title}"?`)) {
      await removeQuiz(activeQuizId);
      // Select another quiz
      const remaining = quizzes.filter(q => q.id !== activeQuizId);
      if (remaining.length > 0) {
        setActiveQuizId(remaining[0].id);
      } else {
        setActiveQuizId("");
      }
    }
  };

  return (
    <div className="admin-portal-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Management Portal</h1>
          <p className="page-subtitle">Perform CRUD operations on assessment databases, create new quizzes, and add quiz questions.</p>
        </div>
        
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-secondary" onClick={() => setShowAddQuizModal(true)}>
            <Plus size={16} />
            <span>Create New Quiz</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Quiz selector on left, questions table/form on right */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem" }}>
        
        {/* Left column: Quiz list selector */}
        <div className="glass-card" style={{ padding: "1.5rem", height: "fit-content" }}>
          <h3 style={{ marginBottom: "1.25rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem" }}>Select Quiz Database</h3>
          <div style={{ display: "flex", flexRedirection: "column", gap: "0.5rem", flexDirection: "column" }}>
            {quizzes.map((q) => (
              <button
                key={q.id}
                onClick={() => { setActiveQuizId(q.id); setIsEditingQuestion(false); }}
                style={{
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border-glass)",
                  background: q.id === activeQuizId ? "rgba(139, 92, 246, 0.15)" : "transparent",
                  borderColor: q.id === activeQuizId ? "var(--color-primary)" : "var(--border-glass)",
                  color: q.id === activeQuizId ? "var(--text-primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.2s ease"
                }}
              >
                {q.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right column: CRUD operations area */}
        <div>
          {selectedQuiz ? (
            <>
              {/* Quiz Settings summary */}
              <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>{selectedQuiz.title}</span>
                    <span style={{ fontSize: "0.85rem" }} className="badge badge-js">{selectedQuiz.category}</span>
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
                    Difficulty: {selectedQuiz.difficulty} | Time Limit: {selectedQuiz.timeLimit}s | Total Questions: {selectedQuiz.questions.length}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={handleOpenAddForm} className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>
                    <Plus size={16} />
                    <span>Add Question</span>
                  </button>
                  <button onClick={handleDeleteQuiz} className="btn btn-danger" style={{ padding: "0.5rem 1rem" }}>
                    <Trash2 size={16} />
                    <span>Delete Quiz</span>
                  </button>
                </div>
              </div>

              {/* Add/Edit Form vs Table view */}
              {isEditingQuestion ? (
                <div className="glass-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3>{currentQuestionId ? "Edit Question" : "Add New Question"}</h3>
                    <button className="btn btn-secondary" style={{ padding: "0.25rem" }} onClick={() => setIsEditingQuestion(false)}>
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveQuestion}>
                    <div className="form-group">
                      <label className="form-label">Question Text</label>
                      <input
                        type="text"
                        className="form-input"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Enter the question query..."
                      />
                      {errors.questionText && <span className="form-error">{errors.questionText}</span>}
                    </div>

                    {/* Options configuration */}
                    <div className="form-group" style={{ marginTop: "1.5rem" }}>
                      <label className="form-label">Multiple Choice Options (Check the correct answer button)</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {options.map((opt, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <button
                              type="button"
                              onClick={() => setCorrectOption(idx)}
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                border: "1px solid var(--border-glass)",
                                background: correctOption === idx ? "var(--color-success)" : "rgba(255,255,255,0.02)",
                                color: correctOption === idx ? "#fff" : "var(--text-muted)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                              }}
                            >
                              <Check size={16} />
                            </button>
                            <input
                              type="text"
                              className="form-input"
                              style={{ flex: 1 }}
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...options];
                                newOpts[idx] = e.target.value;
                                setOptions(newOpts);
                              }}
                              placeholder={`Option ${idx + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      {errors.options && <span className="form-error">{errors.options}</span>}
                    </div>

                    <div className="form-group" style={{ marginTop: "1.5rem" }}>
                      <label className="form-label">Detailed Explanation (shown on results review)</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        placeholder="Explain why the correct answer is right..."
                      />
                      {errors.explanation && <span className="form-error">{errors.explanation}</span>}
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                      <button type="submit" className="btn btn-primary">
                        <Save size={16} />
                        <span>Save Question</span>
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setIsEditingQuestion(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Questions Table */
                <div className="table-container">
                  {selectedQuiz.questions.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
                      <h3 style={{ color: "var(--text-secondary)" }}>No Questions Yet</h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>Click "Add Question" above to start populating this quiz database.</p>
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Question</th>
                          <th>Options Count</th>
                          <th style={{ width: "120px" }}>Correct Index</th>
                          <th style={{ width: "120px", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedQuiz.questions.map((q) => (
                          <tr key={q.id}>
                            <td style={{ fontWeight: "500", fontSize: "0.95rem" }}>{q.text}</td>
                            <td>{q.options.length} options</td>
                            <td>Option {q.correctOptionIndex + 1}</td>
                            <td style={{ textAlign: "right" }}>
                              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                <button onClick={() => handleOpenEditForm(q)} style={{ background: "transparent", border: "none", color: "var(--color-secondary)", cursor: "pointer", padding: "0.25rem" }}>
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDeleteQuestion(q.id)} style={{ background: "transparent", border: "none", color: "var(--color-danger)", cursor: "pointer", padding: "0.25rem" }}>
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="glass-card" style={{ textAlign: "center", padding: "4rem" }}>
              <h3>No Quizzes Available</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Create a quiz using the "Create New Quiz" button.</p>
            </div>
          )}
        </div>

      </div>

      {/* Create Quiz Modal popup */}
      {showAddQuizModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000
        }}>
          <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "500px", position: "relative" }}>
            <button
              onClick={() => setShowAddQuizModal(false)}
              style={{ position: "absolute", right: "1.5rem", top: "1.5rem", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Create New Quiz Database</h3>
            
            <form onSubmit={handleAddQuiz}>
              <div className="form-group">
                <label className="form-label">Quiz Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  placeholder="e.g. JavaScript Arrays"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newQuizCategory}
                  onChange={(e) => setNewQuizCategory(e.target.value)}
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="React">React</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select
                  className="form-select"
                  value={newQuizDifficulty}
                  onChange={(e) => setNewQuizDifficulty(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Time Limit (seconds)</label>
                <input
                  type="number"
                  className="form-input"
                  value={newQuizLimit}
                  onChange={(e) => setNewQuizLimit(e.target.value)}
                  min={30}
                  max={900}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Quiz</button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddQuizModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
