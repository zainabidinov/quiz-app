import React from "react";
import "./MobileMenu.css";
import { useNavigate } from "react-router-dom";

const MobileMenu = ({
  currentUser,
  activeNavItem,
  onNavItemClick,
  onToggleMenu,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mobileMenu">
      <div className="menu-icon-wrapper">
        <span
          class="mdi mdi-window-close menu-icon"
          onClick={() => onToggleMenu()}
        ></span>
      </div>

      <h1>ONEQUIZ </h1>
      <nav className="mobileMenu-nav">
        {currentUser && currentUser.admin === true ? (
          <ul>
            <li
              className={activeNavItem === "home" ? "active" : ""}
              onClick={() => {
                onNavItemClick("home");
                onToggleMenu();
              }}
            >
              Users
            </li>
            <li
              className={activeNavItem === "quizzes" ? "active" : ""}
              onClick={() => {
                onNavItemClick("quizzes");
                onToggleMenu();
              }}
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
                  onClick={() => {
                    onNavItemClick("home");
                    onToggleMenu();
                  }}
                >
                  Home
                </li>

                <li
                  className={
                    activeNavItem === "student-results" ? "active" : ""
                  }
                  onClick={() => {
                    onNavItemClick("student-results");
                    onToggleMenu();
                  }}
                >
                  My Results
                </li>
                <li
                  className={activeNavItem === "profile" ? "active" : ""}
                  onClick={() => {
                    onNavItemClick("profile");
                    onToggleMenu();
                  }}
                >
                  My Profile
                </li>
              </ul>
            )}
            {currentUser && currentUser.userType === "teacher" && (
              <ul>
                <li
                  className={activeNavItem === "quizzes" ? "active" : ""}
                  onClick={() => {
                    onNavItemClick("home");
                    onToggleMenu();
                  }}
                >
                  Manage Exams
                </li>
                <li
                  className={activeNavItem === "exam-results" ? "active" : ""}
                  onClick={() => {
                    onNavItemClick("exam-results");
                    onToggleMenu();
                  }}
                >
                  Student Results
                </li>
                <li
                  className={activeNavItem === "profile" ? "active" : ""}
                  onClick={() => {
                    onNavItemClick("profile");
                    onToggleMenu();
                  }}
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
