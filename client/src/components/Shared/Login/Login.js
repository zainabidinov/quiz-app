import React from "react";
import loginPic from "../../../assets/images/login.svg";
import "./Login.css";
import { useState } from "react";
import { logIn } from "../../Auth/userAuth";
import { useToast } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const updateForm = (value) => {
    return setFormValues((prevValue) => {
      return { ...prevValue, ...value };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const newUser = { ...formValues };
    try {
      const response = await logIn(newUser);
      if (response.success) {
        toast({
          description: response.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        localStorage.setItem("token", response.data);
        navigate("/home");
      } else {
        toast({
          description: response.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-form">
          <form onSubmit={onSubmit}>
            <span>
              <h1 className="login-header">Welcome back to OneQuiz!</h1>
            </span>

            <label htmlFor="email">Email</label>
            <input
              autoComplete="off"
              type="email"
              id="email"
              placeholder="Enter your Email here"
              required
              value={formValues.email}
              onChange={(e) => updateForm({ email: e.target.value })}
            ></input>
            <label htmlFor="password">Password</label>
            <input
              autoComplete="off"
              type="password"
              id="password"
              placeholder="Enter your Password"
              onChange={(e) => updateForm({ password: e.target.value })}
              value={formValues.password}
              required
            ></input>
            <div className="login-form__btn">
              <button type="submit">Sign in</button>
              <span className="login-link__content">
                Don't have an account yet?{" "}
                <Link className="login-link" to="/signup">
                  Sign Up
                </Link>
              </span>
            </div>
          </form>
        </div>

        <div className="login-pic-container">
          <img
            className="login-pic"
            src={loginPic}
            alt="Man working on computer"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
