import React from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import myImg from "../../assets/images/woman_working.jpg";

function Signup() {
  return (
    <div className="signup">
      <div className="signup-form">
        <form>
          <span>
            <h1 className="signup-header">Welcome to OneQuiz!</h1>
          </span>
          <label for="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter your first name"
            required
          ></input>
          <label for="lastName">Last Name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            id="lastName"
            required
          ></input>
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your Email here"
            required
          ></input>
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your Password"
            required
          ></input>
          <div className="signup-from__btn">
            <button type="submit">Create Account</button>
            <span>
              Already have an account?{" "}
              <Link className="signup-link" to="/login">
                Log in
              </Link>
            </span>
          </div>
        </form>
      </div>

      <div>
        <img
          className="signup-pic"
          src={myImg}
          alt="Woman working on computer"
        />
      </div>
    </div>
  );
}

export default Signup;
