import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { LogIn, UserCheck, Shield, KeyRound, Mail, AlertCircle, ArrowRight } from "lucide-react";

export const Login = () => {
  const { login, loading } = useQuiz();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
    setIsSubmitting(true);
    try {
      await login(demoEmail, demoPassword);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to log in with demo account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <LogIn size={28} />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your JavaScript Quiz Portal account</p>
        </div>

        {error && (
          <div className="auth-error-banner animate-fade-in">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Login Credentials Bar for Examiners/Testers */}
        <div className="demo-credentials-card">
          <div className="demo-credentials-title">
            <span>⚡ One-Click Demo Access</span>
          </div>
          <div className="demo-buttons-grid">
            <button
              type="button"
              className="btn btn-demo student-demo-btn"
              onClick={() => handleQuickDemo("student@quiz.com", "student123")}
              disabled={isSubmitting}
            >
              <UserCheck size={16} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>Student Demo</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.75 }}>student@quiz.com</div>
              </div>
            </button>
            <button
              type="button"
              className="btn btn-demo admin-demo-btn"
              onClick={() => handleQuickDemo("admin@quiz.com", "admin123")}
              disabled={isSubmitting}
            >
              <Shield size={16} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>Faculty / Admin Demo</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.75 }}>admin@quiz.com</div>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. yourname@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <KeyRound size={16} />
              <span>Password</span>
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={isSubmitting || loading}
          >
            <span>{isSubmitting ? "Signing in..." : "Sign In to Portal"}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account yet?{" "}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
