import React from "react";
import "./Signup.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myImg from "../../assets/images/woman_working.jpg";
import { signUp } from "../Auth/userAuth";
import { useToast } from "@chakra-ui/react";

const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
  });

  const { password, password2 } = formValues;

  function updateForm(value) {
    return setFormValues((prevState) => {
      return { ...prevState, ...value };
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
        console.log(e);
        const response = await signUp(newUser);

        if (response.success) {
          toast({
            description: response.message,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          navigate("/login");
          setFormValues({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            password2: "",
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
      <div className="signup-form">
        <form onSubmit={onSubmit}>
          <span>
            <h1 className="signup-header">Welcome to OneQuiz!</h1>
          </span>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter your first name"
            required
            value={formValues.firstName}
            onChange={(e) => updateForm({ firstName: e.target.value })}
          ></input>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            id="lastName"
            required
            value={formValues.lastName}
            onChange={(e) => updateForm({ lastName: e.target.value })}
          ></input>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your Email here"
            required
            value={formValues.email}
            onChange={(e) => updateForm({ email: e.target.value })}
          ></input>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your Password"
            required
            value={formValues.password}
            onChange={(e) => updateForm({ password: e.target.value })}
          ></input>
          <label htmlFor="password">Confirm Password</label>
          <input
            type="password"
            id="password2"
            placeholder="Confirm your Password"
            required
            value={formValues.password2}
            onChange={(e) => updateForm({ password2: e.target.value })}
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
};

export default Signup;
