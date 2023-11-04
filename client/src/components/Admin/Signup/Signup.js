import React from "react";
import "./Signup.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../Auth/userAuth";
import { useToast } from "@chakra-ui/react";
import signUpPic from "../../../assets/images/signup.svg";

const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    userType: "",
  });

  const { password, password2 } = formValues;

  function updateForm(value) {
    return setFormValues((prevState) => {
      let updatedFormValues = { ...prevState, ...value };

      if (updatedFormValues.userType === "undefined") {
        updatedFormValues.userType = "student";
      }

      return updatedFormValues;
    });
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const newUser = { ...formValues };

    if (password !== password2) {
      toast({
        title: "Passwords do not match!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      try {
        const response = await signUp(newUser);

        if (response.success) {
          toast({
            description: response.message,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          navigate("/home");
          setFormValues({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            password2: "",
            userType: "",
          });
        } else {
          toast({
            description: response.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <div className="signup">
      <div className="signup-container">
        <div className="signup-form">
          <form onSubmit={onSubmit}>
            <span>
              <h1 className="signup-header">Welcome to OneQuiz!</h1>
            </span>
            <label htmlFor="firstName">First Name</label>
            <input
              autocomplete="off"
              type="text"
              id="firstName"
              placeholder="Enter first name"
              required
              value={formValues.firstName}
              onChange={(e) => updateForm({ firstName: e.target.value })}
            ></input>
            <label htmlFor="lastName">Last Name</label>
            <input
              autocomplete="off"
              type="text"
              placeholder="Enter last name"
              id="lastName"
              required
              value={formValues.lastName}
              onChange={(e) => updateForm({ lastName: e.target.value })}
            ></input>
            <label htmlFor="email">Email</label>
            <input
              autocomplete="off"
              type="email"
              id="email"
              placeholder="Enter Email here"
              required
              value={formValues.email}
              onChange={(e) => updateForm({ email: e.target.value })}
            ></input>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              required
              value={formValues.password}
              onChange={(e) => updateForm({ password: e.target.value })}
            ></input>
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              id="password2"
              placeholder="Confirm Password"
              required
              value={formValues.password2}
              onChange={(e) => updateForm({ password2: e.target.value })}
            ></input>
            <div className="signup-form__user-type">
              <label htmlFor="userType">User Type </label>
              <select
                id="userType"
                value={formValues.userType}
                onChange={(e) => updateForm({ userType: e.target.value })}
              >
                <option value="">Select user type</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div className="signup-form__btn">
              <button type="submit">Sign up</button>
              <span className="login-link__content">
                Already have an account?{" "}
                <Link className="login-link" to="/">
                  Sign In
                </Link>
              </span>
            </div>
          </form>
        </div>

        <div className="signup-pic">
          <img src={signUpPic} alt="sign-up-vector" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
