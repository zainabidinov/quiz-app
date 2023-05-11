import React from "react";
import "./Home.css";
import Navigation from "../Navigation/Navigation";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="home">
      <div className="home-sidebar">
        <h1>ONEQUIZ</h1>
        <Navigation />
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Log out
        </button>
      </div>
      <div className="main-content">
        <div className="home-header-content">
          <p>Username</p>
        </div>
        <div className="home-content"></div>
      </div>
    </div>
  );
};

export default Home;
