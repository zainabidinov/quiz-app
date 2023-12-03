import React from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { logIn, signUp } from "../../components/Auth/userAuth";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import signUpPic from "../../assets/images/signup.svg";
import { useFormik } from "formik";

const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      password2: "",
      userType: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.firstName) {
        errors.firstName = "First name is required";
      }
      if (!values.lastName) {
        errors.lastName = "Last name is required";
      }
      if (!values.email) {
        errors.email = "Email is required";
      }
      if (!values.password) {
        errors.password = "Password is required";
      }
      if (!values.userType) {
        errors.userType = "User role is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const formValues = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        userType: values.userType,
      };

      const loginVal = {
        email: formValues.email,
        password: formValues.password,
      };

      try {
        await signUp(formValues);
        const response = await logIn(loginVal);

        if (response.success) {
          localStorage.setItem("token", response.data);
          navigate("/home");
          formik.resetForm();
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
    },
  });

  return (
    <div className="signup">
      <div className="signup-container">
        <div className="signup-form">
          <form onSubmit={formik.handleSubmit}>
            <Stack direction="column">
              <span>
                <h1 className="signup-header">Ready? Sign Up!</h1>
              </span>
              <FormControl
                isInvalid={formik.errors.firstName && formik.touched.firstName}
              >
                <Stack
                  direction="row"
                  alignItems="baseline"
                  justifyContent="space-between"
                  spacing="0.5"
                >
                  <FormLabel>First Name </FormLabel>
                  <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
                </Stack>
                <Input
                  size="sm"
                  name="firstName"
                  autocomplete="off"
                  type="text"
                  id="firstName"
                  placeholder="Type your first name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </FormControl>

              <FormControl
                isInvalid={formik.errors.lastName && formik.touched.lastName}
              >
                <Stack
                  direction="row"
                  alignItems="baseline"
                  justifyContent="space-between"
                  spacing="0.5"
                >
                  <FormLabel>Last Name</FormLabel>
                  <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
                </Stack>
                <Input
                  size="sm"
                  autocomplete="off"
                  type="text"
                  placeholder="Type your last name"
                  id="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></Input>
              </FormControl>

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
                  autocomplete="off"
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
                  type="password"
                  id="password"
                  placeholder="Type your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></Input>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.userType && formik.touched.userType}
              >
                <Stack
                  direction="row"
                  alignItems="baseline"
                  justifyContent="space-between"
                  spacing="0.5"
                >
                  <FormLabel>User Type </FormLabel>
                  <FormErrorMessage>{formik.errors.userType}</FormErrorMessage>
                </Stack>
                <Select
                  size="sm"
                  placeholder="Select user type"
                  id="userType"
                  value={formik.values.userType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </Select>
              </FormControl>

              <div className="signup-form__btn">
                <Button
                  mt="10px"
                  type="submit"
                  isDisabled={!formik.isValid}
                  colorScheme="teal"
                >
                  Sign up
                </Button>

                <span className="login-link__content">
                  Already have an account?{" "}
                  <Link className="login-link" to="/">
                    Sign In
                  </Link>
                </span>
              </div>
            </Stack>
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
