import React from "react";
import "./Navigation.css";

const Navigation = () => {
  return (
    <div className="sidebar-navigation">
      <nav>
        <ul>
          <li>Home</li>
          <li>Test Bank</li>
          <li>My Results</li>
          <li>My Profile</li>
          <li>Log out</li>
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
