import React from "react";
import "./MobileMenu.css";
import { useNavigate } from "react-router-dom";

const MobileMenu = ({ currentUser, activeNavItem, onNavItemClick }) => {
  const navigate = useNavigate();

  return (
    <div className="mobileMenu">
      <h1>ONEQUIZ </h1>
      <nav className="mobileMenu-nav">
        {currentUser && currentUser.admin === true ? (
          <ul>
            <li
              className={activeNavItem === "home" ? "active" : ""}
              onClick={() => onNavItemClick("home")}
            >
              Users
            </li>
            <li
              className={activeNavItem === "quizzes" ? "active" : ""}
              onClick={() => onNavItemClick("quizzes")}
            >
              Exams
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
                  Home
                </li>

                <li
                  className={
                    activeNavItem === "student-results" ? "active" : ""
                  }
                  onClick={() => onNavItemClick("student-results")}
                >
                  My Results
                </li>
                <li
                  className={activeNavItem === "profile" ? "active" : ""}
                  onClick={() => onNavItemClick("profile")}
                >
                  My Profile
                </li>
              </ul>
            )}
            {currentUser && currentUser.userType === "teacher" && (
              <ul>
                <li
                  className={activeNavItem === "quizzes" ? "active" : ""}
                  onClick={() => onNavItemClick("home")}
                >
                  Manage Exams
                </li>
                <li
                  className={activeNavItem === "exam-results" ? "active" : ""}
                  onClick={() => onNavItemClick("exam-results")}
                >
                  Student Results
                </li>
                <li
                  className={activeNavItem === "profile" ? "active" : ""}
                  onClick={() => onNavItemClick("profile")}
                >
                  My Profile
                </li>
              </ul>
            )}
          </>
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
      </nav>
    </div>
  );
};

export default MobileMenu;
