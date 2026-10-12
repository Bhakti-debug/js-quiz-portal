import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, loading } = useQuiz();
  const location = useLocation();

  if (loading) {
    return (
      <div className="glass-card" style={{ textAlign: "center", padding: "3rem", margin: "2rem auto", maxWidth: "450px" }}>
        <p style={{ color: "var(--text-secondary)" }}>Verifying authentication credentials...</p>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin route requested but user is not admin
  if (requireAdmin && user?.role !== "admin") {
    return (
      <div className="glass-card unauthorized-card" style={{ maxWidth: "550px", margin: "3rem auto", textAlign: "center", padding: "2.5rem" }}>
        <div style={{ display: "inline-flex", padding: "1rem", borderRadius: "50%", background: "rgba(239, 68, 68, 0.15)", color: "var(--color-danger)", marginBottom: "1.25rem" }}>
          <ShieldAlert size={48} />
        </div>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "0.75rem", color: "var(--text-primary)" }}>
          Administrator Access Required
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
          You are currently signed in as <strong>{user.username}</strong> with role <span className="badge badge-student">Student</span>. 
          The Admin Portal is restricted to authorized faculty and administrators.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>
          <Link to="/login" className="btn btn-primary">
            <LogIn size={16} />
            <span>Switch to Admin Account</span>
          </Link>
        </div>
      </div>
    );
  }

  return children;
};
