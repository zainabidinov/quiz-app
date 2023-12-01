import React from "react";
import loginPic from "../../assets/images/login.svg";
import "./Login.css";
import { logIn } from "../../components/Auth/userAuth";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.email) {
        errors.email = "Email is required";
      }
      if (!values.password) {
        errors.password = "Password is required";
      }

      return errors;
    },
    onSubmit: async (values) => {
      const formValues = {
        email: values.email,
        password: values.password,
      };

      try {
        const response = await logIn(formValues);
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
    },
  });

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-form">
          <form onSubmit={formik.handleSubmit}>
            <Stack direction="column">
              <span>
                <h1 className="login-header">Welcome to OneQuiz!</h1>
              </span>

              <FormControl
                isInvalid={formik.errors.email && formik.touched.email}
              >
                <Stack
                  direction="row"
                  alignItems="baseline"
                  justifyContent="space-between"
                  spacing="0.5"
                >
                  <FormLabel>Email</FormLabel>
                  <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                </Stack>
                <Input
                  size="sm"
                  autoComplete="off"
                  type="email"
                  id="email"
                  placeholder="Type your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></Input>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.password && formik.touched.password}
              >
                <Stack
                  direction="row"
                  alignItems="baseline"
                  justifyContent="space-between"
                  spacing="0.5"
                >
                  <FormLabel>Password</FormLabel>
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </Stack>
                <Input
                  size="sm"
                  autoComplete="off"
                  type="password"
                  id="password"
                  placeholder="Type your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></Input>
              </FormControl>

              <div className="login-form__btn">
                <Button
                  colorScheme="teal"
                  isDisabled={!formik.isValid}
                  type="submit"
                >
                  Sign in
                </Button>

                <span className="login-link__content">
                  Don't have an account yet?{" "}
                  <Link className="login-link" to="/signup">
                    Sign Up
                  </Link>
                </span>
              </div>
            </Stack>
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
