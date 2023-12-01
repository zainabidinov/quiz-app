import React, { useState } from "react";
import {
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import "./CreateExam.css";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  Button,
  Input,
  Stack,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormik } from "formik";

const CreateExams = () => {
  const [subject, setSubject] = useState("");
  const [examName, setExamName] = useState("");
  const [examQuestions, setExamQuestions] = useState("");
  const [examDurationHours, setExamDurationHours] = useState("");
  const [examDurationMinutes, setExamDurationMinutes] = useState("");
  const BASE_API_URL =
    "https://quiz-app-zainabidinov-api.onrender.com/api/quizzes";
  const toast = useToast();

  const displayNotification = (message, status) => {
    toast({
      description: message,
      status: status,
      duration: 3000,
      isClosable: true,
      onCloseComplete: () => {
        window.location.href = "/home";
      },
    });
  };

  const formik = useFormik({
    initialValues: {
      subject: "",
      examName: "",
      examQuestions: "",
      examDurationHours: "",
      examDurationMinutes: "",
    },
    validate: (values) => {
      const errors = {};
      
      if (!values.subject) {
        errors.subject = "Please provide exam subject";
      }
      if (!values.examName) {
        errors.examName = "Please provide exam name";
      }
      if (!values.examQuestions) {
        errors.examQuestions = "Please provide number of questions";
      }
      if (!values.examDurationHours || !values.examDurationMinutes) {
        errors.examDuration = "Please provide exam duration both in hours and minutes";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const durationInSeconds =
        (parseInt(values.examDurationHours) * 60 +
          parseInt(values.examDurationMinutes)) *
        60;

      const formValues = {
        subject: values.subject,
        examName: values.examName,
        numberOfQuestions: values.examQuestions,
        examDuration: durationInSeconds,
      };

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.post(
          `${BASE_API_URL}/create`,
          formValues,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          displayNotification(response.data.message, "success");
        } else {
          displayNotification(response.data.message, "error");
        }
      } catch (error) {
        displayNotification(error.message, "error");
      }
    },
  });

  // const onSubmit = async (e) => {
  //   e.preventDefault();

  //   const durationInSeconds =
  //     (parseInt(examDurationHours) * 60 + parseInt(examDurationMinutes)) * 60;

  //   const formValues = {
  //     subject: subject,
  //     examName: examName,
  //     numberOfQuestions: examQuestions,
  //     examDuration: durationInSeconds,
  //   };
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       throw new Error("No token found");
  //     }

  //     const response = await axios.post(`${BASE_API_URL}/create`, formValues, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.data.success) {
  //       displayNotification(response.data.message, "success");
  //     } else {
  //       displayNotification(response.data.message, "error");
  //     }
  //   } catch (error) {
  //     displayNotification(error.message, "error");
  //   }
  // };

  return (
    <div className="createExamFormContainer">
      <form onSubmit={formik.handleSubmit} className="createExamForm">
        <Stack direction="column">
          <FormControl
            isInvalid={formik.errors.subject && formik.touched.subject}
          >
            <FormLabel>Subject</FormLabel>
            <Select
              placeholder="Select subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="subject"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Geography">Geography</option>
              <option value="History">History</option>
              <option value="English">English</option>
            </Select>
            <FormErrorMessage>{formik.errors.subject}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={formik.errors.examName && formik.touched.examName}
          >
            <FormLabel>Name of Exam</FormLabel>
            <Input
              type="text"
              name="examName"
              _focus={{ boxShadow: "none" }}
              bg="white"
              value={formik.values.examName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormErrorMessage>{formik.errors.examName}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.errors.examQuestions && formik.touched.examQuestions}>
            <FormLabel>Number of Exam Questions</FormLabel>
            <NumberInput min={1}>
              <NumberInputField
                name="examQuestions"
                _focus={{ boxShadow: "none" }}
                bg="white"
                value={formik.values.examQuestions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </NumberInput>
            <FormErrorMessage>{formik.errors.examQuestions}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={
              (formik.errors.examDurationHours && formik.touched.examDurationHours) ||
              (formik.errors.examDurationMinutes && formik.touched.examDurationMinutes)
            }>
            <FormLabel>Duration of Exam</FormLabel>
            <Stack direction="row">
              <NumberInput
                min={0}
                max={23}
                defaultValue={0}
                value={formik.values.examDurationHours}
                onChange={(value) => formik.setFieldValue("examDurationHours", value)}
                onBlur={formik.handleBlur}
              >
                <NumberInputField
                  name="examDurationHours"
                  _focus={{ boxShadow: "none" }}
                  placeholder="Hours"
                  bg="white"
                />
              </NumberInput>

              <span style={{ margin: "0 4px" }}>:</span>
              <NumberInput
                min={0}
                max={59}
                defaultValue={0}
                value={formik.values.examDurationMinutes}
                onChange={(value) => formik.setFieldValue("examDurationMinutes", value)}
                onBlur={formik.handleBlur}
              >
                <NumberInputField
                  name="examDurationMinutes"
                  _focus={{ boxShadow: "none" }}
                  placeholder="Minutes"
                  bg="white"
                />
              </NumberInput>
            </Stack>
            <FormErrorMessage>{formik.errors.examDuration}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="teal" size="md" mt={8} isDisabled={!formik.isValid}>
            Create Exam
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default CreateExams;
