import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { Award, ShieldAlert, LayoutDashboard, BrainCircuit, LogIn, LogOut, UserPlus } from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useQuiz();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">
          <BrainCircuit size={28} className="logo-icon" />
          <span>JS Quiz Portal</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className={`nav-item ${location.pathname === "/admin" ? "active" : ""}`}>
              <ShieldAlert size={18} />
              <span>Admin Portal</span>
            </Link>
          )}
        </div>

        <div className="nav-profile-section">
          {isAuthenticated && user ? (
            <div className="nav-profile">
              <div className="profile-stats">
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span className="profile-name">{user.username}</span>
                  <span className={`role-pill ${user.role === "admin" ? "role-pill-admin" : "role-pill-student"}`}>
                    {user.role === "admin" ? "Faculty" : "Student"}
                  </span>
                </div>
                <div className="xp-badge">
                  <Award size={14} />
                  <span>Lvl {user.level || 1} • {user.xp || 0} XP</span>
                </div>
              </div>

              <div className="avatar" title={`${user.username} (${user.role})`}>
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>

              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={16} />
                <span className="logout-text">Logout</span>
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={15} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

