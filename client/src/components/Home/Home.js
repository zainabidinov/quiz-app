import React from "react";
import "./Home.css";
import Navigation from "../Navigation/Navigation";

const Home = () => {
  return (
    <div className="home">
      <div className="home-sidebar">
        <h1>ONEQUIZ</h1>
        <Navigation />
      </div>
      <div className="home-header-content">
        <p>Username</p>
        <div className="home-content"></div>
      </div>
    </div>
  );
};

export default Home;
