import React, { useState } from "react";
import {
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import "./CreateExamForm.css";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Stack, Select } from "@chakra-ui/react";

const CreateExams = () => {
  const [subject, setSubject] = useState("");
  const [examName, setExamName] = useState("");
  const [examQuestions, setExamQuestions] = useState("");
  const [examDurationHours, setExamDurationHours] = useState("");
  const [examDurationMinutes, setExamDurationMinutes] = useState("");
  const BASE_API_URL = "https://techquiz-api.onrender.com/api/quizzes";
  const toast = useToast();
  const navigate = useNavigate();

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

  const onSubmit = async (e) => {
    e.preventDefault();

    const durationInSeconds =
      (parseInt(examDurationHours) * 60 + parseInt(examDurationMinutes)) * 60;

    const formValues = {
      subject: subject,
      examName: examName,
      numberOfQuestions: examQuestions,
      examDuration: durationInSeconds,
    };
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(`${BASE_API_URL}/create`, formValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        displayNotification(response.data.message, "success");
      } else {
        displayNotification(response.data.message, "error");
      }
    } catch (error) {
      displayNotification(error.message, "error");
    }
  };

  return (
    <div className="createExamFormContainer">
      <form onSubmit={onSubmit} className="createExamForm">
        <Stack direction="column">
          <FormControl>
            <FormLabel>Subject</FormLabel>
            <Select
              placeholder="Select subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Geography">Geography</option>
              <option value="History">History</option>
              <option value="English">English</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Name of Exam</FormLabel>
            <Input
              type="text"
              name="examName"
              _focus={{ boxShadow: "none" }}
              bg="white"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Number of Exam Questions</FormLabel>
            <NumberInput min={1}>
              <NumberInputField
                name="numberOfQuestions"
                _focus={{ boxShadow: "none" }}
                bg="white"
                value={examQuestions}
                onChange={(e) => setExamQuestions(e.target.value)}
              />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Duration of Exam</FormLabel>
            <Stack direction="row">
              <NumberInput
                min={0}
                max={23}
                defaultValue={0}
                value={examDurationHours}
                onChange={(value) => setExamDurationHours(value)}
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
                value={examDurationMinutes}
                onChange={(value) => setExamDurationMinutes(value)}
              >
                <NumberInputField
                  name="examDurationMinutes"
                  _focus={{ boxShadow: "none" }}
                  placeholder="Minutes"
                  bg="white"
                />
              </NumberInput>
            </Stack>
          </FormControl>

          <Button type="submit" colorScheme="teal" size="md" mt={8}>
            Create Exam
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default CreateExams;
