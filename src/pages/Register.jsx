import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { UserPlus, User, Mail, KeyRound, Shield, AlertCircle, ArrowRight } from "lucide-react";

export const Register = () => {
  const { register, loading } = useQuiz();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ username, email, password, role });
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <UserPlus size={28} />
          </div>
          <h2>Create Account</h2>
          <p>Register as a candidate or course instructor</p>
        </div>

        {error && (
          <div className="auth-error-banner animate-fade-in">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <User size={16} />
              <span>Full Name / Username</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={16} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. candidate@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Shield size={16} />
              <span>Account Role</span>
            </label>
            <div className="role-selector-group">
              <label className={`role-option-card ${role === "student" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                />
                <div className="role-title">Student / Candidate</div>
                <div className="role-desc">Take tests, earn XP & level badges</div>
              </label>

              <label className={`role-option-card ${role === "admin" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                />
                <div className="role-title">Faculty / Admin</div>
                <div className="role-desc">Manage quizzes, questions & test sets</div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <KeyRound size={16} />
              <span>Password (min. 6 characters)</span>
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <KeyRound size={16} />
              <span>Confirm Password</span>
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Re-type your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={isSubmitting || loading}
          >
            <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
