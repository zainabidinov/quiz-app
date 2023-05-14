import React from "react";
import "./Navigation.css";
import { useNavigate } from "react-router-dom";

const Navigation = ({ currentUser }) => {
  const navigate = useNavigate();

  console.log("This is from Navigation.js", currentUser);

  return (
    <div className="sidebar-navigation">
      <nav>
        {currentUser && currentUser.userType === "student" && (
          <ul>
            <li>
              <span className="mdi mdi-home"></span> Home
            </li>
            <li>
              <span className="mdi mdi-lead-pencil"></span> Test Bank
            </li>
            <li>
              <span className="mdi mdi-list-status"></span> My Results
            </li>
            <li>
              <span className="mdi mdi-account-circle"></span> My Profile
            </li>
          </ul>
        )}
        {currentUser && currentUser.userType === "teacher" && (
          <ul>
            <li>
              <span className="mdi mdi-home"></span> Home
            </li>
            <li>
              <span className="mdi mdi-lead-pencil"></span> Test Bank
            </li>
            <li>
              <span className="mdi mdi-account-multiple-outline"></span>{" "}
              Students
            </li>
            <li>
              <span className="mdi mdi-pencil-box-multiple"></span> Manage Exams
            </li>
            <li>
              <span className="mdi mdi-monitor-multiple"></span> Student Results
            </li>
            <li>
              <span className="mdi mdi-account-circle"></span> My Profile
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
};

export default Navigation;
