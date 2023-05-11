import React from "react";
import "./Navigation.css";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-navigation">
      <nav>
        <ul>
          <li><span class="mdi mdi-home"></span> Home</li>
          <li><span class="mdi mdi-lead-pencil"></span> Test Bank</li>
          <li><span class="mdi mdi-list-status"></span> My Results</li>
          <li><span class="mdi mdi-account-circle"></span> My Profile</li>
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
