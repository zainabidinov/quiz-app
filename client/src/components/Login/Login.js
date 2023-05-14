import React from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/login-man.jpg";
import "./Login.css";
import { useState } from "react";
import { logIn } from "../Auth/userAuth";
import { useToast } from "@chakra-ui/react";

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
        window.location.href = "/home";
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
      <div className="login-form">
        <form onSubmit={onSubmit}>
          <span>
            <h1 className="login-header">Welcome back to OneQuiz!</h1>
          </span>

          <label htmlFor="email">Email</label>
          <input
            autocomplete="off"
            type="email"
            id="email"
            placeholder="Enter your Email here"
            required
            value={formValues.email}
            onChange={(e) => updateForm({ email: e.target.value })}
          ></input>
          <label htmlFor="password">Password</label>
          <input
            autocomplete="off"
            type="password"
            id="password"
            placeholder="Enter your Password"
            onChange={(e) => updateForm({ password: e.target.value })}
            value={formValues.password}
            required
          ></input>
          <div className="login-from__btn">
            <button type="submit">Log in</button>
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
};

export default Login;
