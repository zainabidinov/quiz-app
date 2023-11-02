import React from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ currentUser, activeNavItem, onNavItemClick }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-nav">
      <nav>
      <h1>ONEQUIZ</h1>

        {currentUser && currentUser.admin === true ? (
          <ul>
            <li
              className={activeNavItem === "home" ? "active" : ""}
              onClick={() => onNavItemClick("home")}
            >
              <span className="mdi mdi-account-multiple-outline"></span> Users
            </li>
            <li
              className={activeNavItem === "quizzes" ? "active" : ""}
              onClick={() => onNavItemClick("quizzes")}
            >
              <span className="mdi mdi-account-circle"></span> Exams
            </li>
          </ul>
        ) : (
          <>
            {currentUser && currentUser.userType === "student" && (
              <ul>
                <li
                  className={activeNavItem === "home" ? "active" : ""}
                  onClick={() => onNavItemClick("home")}
                >
                  <span className="mdi mdi-home"></span> Home
                </li>

                <li
                  className={
                    activeNavItem === "student-results" ? "active" : ""
                  }
                  onClick={() => onNavItemClick("student-results")}
                >
                  <span className="mdi mdi-list-status"></span> My Results
                </li>
                <li
                  className={activeNavItem === "profile" ? "active" : ""}
                  onClick={() => onNavItemClick("profile")}
                >
                  <span className="mdi mdi-account-circle"></span> My Profile
                </li>
              </ul>
            )}
            {currentUser && currentUser.userType === "teacher" && (
              <ul>
                <li
                  className={activeNavItem === "quizzes" ? "active" : ""}
                  onClick={() => onNavItemClick("home")}
                >
                  <span className="mdi mdi-home"></span> Manage Exams
                </li>
                <li
                  className={activeNavItem === "exam-results" ? "active" : ""}
                  onClick={() => onNavItemClick("exam-results")}
                >
                  <span className="mdi mdi-monitor-multiple"></span> Student
                  Results
                </li>
                <li
                  className={activeNavItem === "profile" ? "active" : ""}
                  onClick={() => onNavItemClick("profile")}
                >
                  <span className="mdi mdi-account-circle"></span> My Profile
                </li>
              </ul>
            )}
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Log out
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
