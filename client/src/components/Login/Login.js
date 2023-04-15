import React from "react";
import { Link } from "react-router-dom";
import loginImg from "../../assets/images/login-man.jpg"
import "./Login.css";

function Login() {
  return (
    <div className="login">
      <div className="login-form">
        <form>
          <span>
            <h1 className="login-header">Welcome back to OneQuiz!</h1>
          </span>
          
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
          <div className="login-from__btn">
            <button type="submit">Create Account</button>
            <span>
              Don't have an account yet?{" "}
              <Link className="login-link" to="/">
                Sign Up
              </Link>
            </span>
          </div>
        </form>
      </div>

      <div>
        <img
          className="login-pic"
          src={loginImg}
          alt="Man working on computer"
        />
      </div>
    </div>
  );
}

export default Login;
