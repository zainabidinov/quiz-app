import React from "react";
import "./Navigation.css";
import { useNavigate } from "react-router-dom";

const Navigation = ({ currentUser, activeNavItem, onNavItemClick }) => {
  const navigate = useNavigate();

  console.log("This is from Navigation.js", currentUser);

  return (
    <div className="sidebar-navigation">
      <nav>
        {currentUser && currentUser.userType === "student" && (
          <ul>
            <li
              className={activeNavItem === "home" ? "active" : ""}
              onClick={() => onNavItemClick("home")}
            >
              <span className="mdi mdi-home"></span> Home
            </li>

            <li
              className={activeNavItem === "student-results" ? "active" : ""}
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
              className={activeNavItem === "home" ? "active" : ""}
              onClick={() => onNavItemClick("home")}
            >
              <span className="mdi mdi-home"></span> Home
            </li>

            <li
              className={activeNavItem === "student-info" ? "active" : ""}
              onClick={() => onNavItemClick("student-info")}
            >
              <span className="mdi mdi-account-multiple-outline"></span>{" "}
              Students
            </li>
            <li
              className={activeNavItem === "manage-exams" ? "active" : ""}
              onClick={() => onNavItemClick("manage-exams")}
            >
              <span className="mdi mdi-pencil-box-multiple"></span> Manage Exams
            </li>
            <li
              className={activeNavItem === "exam-results" ? "active" : ""}
              onClick={() => onNavItemClick("exam-results")}
            >
              <span className="mdi mdi-monitor-multiple"></span> Student Results
            </li>
            <li
              className={activeNavItem === "profile" ? "active" : ""}
              onClick={() => onNavItemClick("profile")}
            >
              <span className="mdi mdi-account-circle"></span> My Profile
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
};

export default Navigation;

// {/* <li
//               className={activeNavItem === "testBank" ? "active" : ""}
//               onClick={() => onNavItemClick("testBank")}
//             >
//               <span className="mdi mdi-lead-pencil"></span> Test Bank
//             </li> */}
