import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const fetchedQuizzes = await api.getQuizzes();
      const currentUser = await api.getCurrentUser();
      const fetchedHistory = await api.getQuizHistory();
      setQuizzes(fetchedQuizzes);
      setUser(currentUser);
      setHistory(fetchedHistory);
      setError(null);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to initialize system. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const authenticatedUser = await api.login(email, password);
      setUser(authenticatedUser);
      const userHistory = await api.getQuizHistory(authenticatedUser.id);
      setHistory(userHistory);
      return authenticatedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ username, email, password, role }) => {
    try {
      setLoading(true);
      const newUser = await api.register({ username, email, password, role });
      setUser(newUser);
      setHistory([]);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.logout();
      setUser(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const submitQuizResult = async (quizId, quizTitle, score, totalQuestions) => {
    try {
      const response = await api.saveQuizResult({
        quizId,
        quizTitle,
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100)
      });
      // Update global context states immediately
      setUser(response.user);
      setHistory(prev => [...prev, response.result]);
      return response;
    } catch (err) {
      console.error("Error saving result", err);
    }
  };

  const updateProfile = async (newProfile) => {
    try {
      const updatedUser = await api.updateUserProfile(newProfile);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const addQuestion = async (quizId, question) => {
    const newQuestion = await api.createQuestion(quizId, question);
    const updatedQuizzes = await api.getQuizzes();
    setQuizzes(updatedQuizzes);
    return newQuestion;
  };

  const editQuestion = async (quizId, questionId, updatedQuestion) => {
    const updated = await api.updateQuestion(quizId, questionId, updatedQuestion);
    const updatedQuizzes = await api.getQuizzes();
    setQuizzes(updatedQuizzes);
    return updated;
  };

  const removeQuestion = async (quizId, questionId) => {
    await api.deleteQuestion(quizId, questionId);
    const updatedQuizzes = await api.getQuizzes();
    setQuizzes(updatedQuizzes);
  };

  const addQuiz = async (quiz) => {
    const newQuiz = await api.createQuiz(quiz);
    const updatedQuizzes = await api.getQuizzes();
    setQuizzes(updatedQuizzes);
    return newQuiz;
  };

  const removeQuiz = async (quizId) => {
    await api.deleteQuiz(quizId);
    const updatedQuizzes = await api.getQuizzes();
    setQuizzes(updatedQuizzes);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        user,
        history,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshQuizzes: loadData,
        submitQuizResult,
        updateProfile,
        addQuestion,
        editQuestion,
        removeQuestion,
        addQuiz,
        removeQuiz
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
