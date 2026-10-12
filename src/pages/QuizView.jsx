import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { useTimer } from "../hooks/useTimer";
import { CheckCircle2, XCircle, Clock, ArrowRight, RefreshCw, LogOut, Award } from "lucide-react";

export const QuizView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quizzes, submitQuizResult } = useQuiz();
  
  const quiz = quizzes.find((q) => q.id === id);

  // States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]); // Array of selected option indices
  const [isSubmitted, setIsSubmitted] = useState(false); // Has the entire quiz finished?
  const [showExplanation, setShowExplanation] = useState(false); // Explanation after answering
  const [hasConfirmedAnswer, setHasConfirmedAnswer] = useState(false); // Clicked 'Confirm Answer'
  const [quizScore, setQuizScore] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [isLevelUp, setIsLevelUp] = useState(false);

  // Redirect if quiz not found
  useEffect(() => {
    if (!quiz) {
      navigate("/");
    }
  }, [quiz, navigate]);

  const handleQuizEnd = async () => {
    pause();
    
    // Calculate final score
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctOptionIndex) {
        score += 1;
      }
    });

    const finalScore = score;
    setQuizScore(finalScore);

    // Save result to Context / API
    const response = await submitQuizResult(quiz.id, quiz.title, finalScore, quiz.questions.length);
    
    setXpGained(finalScore * 10);
    if (response && response.user) {
      const previousXP = response.user.xp - (finalScore * 10);
      const previousLevel = Math.floor(previousXP / 100) + 1;
      if (response.user.level > previousLevel) {
        setIsLevelUp(true);
      }
    }

    setIsSubmitted(true);
  };

  // Timer handling
  const handleTimeUp = () => {
    handleQuizEnd();
  };

  const { timeLeft, start, pause, formatTime } = useTimer(
    quiz ? quiz.timeLimit : 60,
    handleTimeUp
  );

  // Start timer on mount
  useEffect(() => {
    if (quiz && !isSubmitted) {
      start();
    }
    return () => pause();
  }, [quiz, isSubmitted]);

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex) => {
    if (hasConfirmedAnswer) return; // cannot change after confirming
    setSelectedOption(optionIndex);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    
    setHasConfirmedAnswer(true);
    setShowExplanation(true);
    
    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setHasConfirmedAnswer(false);
    setShowExplanation(false);

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizEnd();
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIsSubmitted(false);
    setShowExplanation(false);
    setHasConfirmedAnswer(false);
    setIsLevelUp(false);
    // reset timer is handled by useTimer hook automatically when initialTime matches
  };

  // Render assessment complete layout
  if (isSubmitted) {
    const percentage = Math.round((quizScore / quiz.questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="quiz-result-page animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {isLevelUp && (
          <div className="glass-card level-up-banner" style={{ textAlign: "center", border: "2px solid var(--color-warning)", marginBottom: "2rem", animation: "pulseGlow 2s infinite" }}>
            <h2 style={{ color: "var(--color-warning)", fontSize: "2rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
              <Award size={32} /> LEVEL UP!
            </h2>
            <p style={{ marginTop: "0.5rem" }}>Congratulations! You have advanced on your journey to mastering JavaScript!</p>
          </div>
        )}

        <div className="glass-card" style={{ textAlign: "center", padding: "3rem 2rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Assessment Complete</h2>
          <div style={{ fontSize: "4rem", fontWeight: "800", color: passed ? "var(--color-success)" : "var(--color-warning)", margin: "1.5rem 0" }}>
            {percentage}%
          </div>
          
          <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            You scored {quizScore} out of {quiz.questions.length} correct!
          </h3>

          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            XP Earned: <strong style={{ color: "var(--color-warning)" }}>+{xpGained} XP</strong>
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button onClick={handleRetry} className="btn btn-secondary">
              <RefreshCw size={16} />
              <span>Retry Quiz</span>
            </button>
            <Link to="/" className="btn btn-primary">
              <LogOut size={16} />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Detailed assessment breakdown */}
        <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Review Answers</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {quiz.questions.map((q, qIndex) => {
            const userAnswerIndex = answers[qIndex];
            const isCorrect = userAnswerIndex === q.correctOptionIndex;

            return (
              <div key={q.id} className="glass-card" style={{ borderLeft: `4px solid ${isCorrect ? "var(--color-success)" : "var(--color-danger)"}` }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  {isCorrect ? <CheckCircle2 className="logo-icon" style={{ color: "var(--color-success)", flexShrink: 0 }} size={20} /> : <XCircle style={{ color: "var(--color-danger)", flexShrink: 0 }} size={20} />}
                  <span>{qIndex + 1}. {q.text}</span>
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                  {q.options.map((opt, oIndex) => {
                    let borderCol = "var(--border-glass)";
                    let bgCol = "transparent";

                    if (oIndex === q.correctOptionIndex) {
                      borderCol = "var(--color-success)";
                      bgCol = "rgba(16, 185, 129, 0.1)";
                    } else if (oIndex === userAnswerIndex && !isCorrect) {
                      borderCol = "var(--color-danger)";
                      bgCol = "rgba(239, 68, 68, 0.1)";
                    }

                    return (
                      <div
                        key={oIndex}
                        style={{
                          padding: "0.75rem 1rem",
                          borderRadius: "8px",
                          border: `1px solid ${borderCol}`,
                          backgroundColor: bgCol,
                          fontSize: "0.95rem"
                        }}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>

                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontStyle: "italic", background: "rgba(0,0,0,0.2)", padding: "0.75rem", borderRadius: "6px" }}>
                  <strong>Explanation:</strong> {q.explanation}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    );
  }

  // Active quiz game engine render
  const progressPercent = Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100);

  return (
    <div className="quiz-session animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
      
      {/* Quiz Session Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem" }}>{quiz.title}</h2>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
        </div>

        {/* Timer UI */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "9999px", background: timeLeft < 30 ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.05)", border: `1px solid ${timeLeft < 30 ? "var(--color-danger)" : "var(--border-glass)"}` }}>
          <Clock size={16} style={{ color: timeLeft < 30 ? "var(--color-danger)" : "var(--text-secondary)" }} />
          <span style={{ fontWeight: "700", fontSize: "1rem", color: timeLeft < 30 ? "var(--color-danger)" : "var(--text-primary)" }}>{formatTime()}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: "6px", width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: "3px", marginBottom: "2.5rem", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progressPercent}%`, background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))", transition: "width 0.3s ease" }}></div>
      </div>

      {/* Question Card */}
      <div className="glass-card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.35rem", marginBottom: "1.5rem", fontWeight: "600" }}>{currentQuestion.text}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = currentQuestion.correctOptionIndex === index;
            
            let cardStyle = {
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              border: "1px solid var(--border-glass)",
              background: "rgba(255, 255, 255, 0.02)",
              cursor: hasConfirmedAnswer ? "default" : "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            };

            if (isSelected) {
              cardStyle.borderColor = "var(--color-primary)";
              cardStyle.background = "rgba(139, 92, 246, 0.1)";
            }

            if (hasConfirmedAnswer) {
              if (isCorrect) {
                cardStyle.borderColor = "var(--color-success)";
                cardStyle.background = "rgba(16, 185, 129, 0.15)";
              } else if (isSelected) {
                cardStyle.borderColor = "var(--color-danger)";
                cardStyle.background = "rgba(239, 68, 68, 0.15)";
              }
            }

            return (
              <div
                key={index}
                style={cardStyle}
                onClick={() => handleOptionSelect(index)}
              >
                <span>{option}</span>
                {hasConfirmedAnswer && isCorrect && (
                  <CheckCircle2 size={20} style={{ color: "var(--color-success)" }} />
                )}
                {hasConfirmedAnswer && isSelected && !isCorrect && (
                  <XCircle size={20} style={{ color: "var(--color-danger)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation details block */}
      {showExplanation && (
        <div className="glass-card animate-fade-in" style={{ marginBottom: "1.5rem", borderLeft: `4px solid ${answers[currentQuestionIndex] === currentQuestion.correctOptionIndex ? "var(--color-success)" : "var(--color-danger)"}` }}>
          <h4 style={{ marginBottom: "0.5rem" }}>
            {answers[currentQuestionIndex] === currentQuestion.correctOptionIndex ? "Correct Answer!" : "Incorrect Answer!"}
          </h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => { if (window.confirm("Are you sure you want to quit the quiz? Your progress will be lost.")) navigate("/"); }}
          className="btn btn-secondary"
        >
          Quit Quiz
        </button>

        {!hasConfirmedAnswer ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={selectedOption === null}
            className="btn btn-primary"
          >
            Confirm Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="btn btn-primary"
          >
            <span>{currentQuestionIndex + 1 === quiz.questions.length ? "Submit Quiz" : "Next Question"}</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

    </div>
  );
};
