import React, { useState } from "react";
import {
  Input,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import "./CreateExamForm.css";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CreateExams = () => {
  const [examName, setExamName] = useState("");
  const [examQuestions, setExamQuestions] = useState("");
  const [examDuration, setExamDuration] = useState("");
  const BASE_API_URL = "/api/quizzes";
  const toast = useToast();
  const navigate = useNavigate();

  const displayNotification = (message, status) => {
    toast({
      description: message,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formValues = {
      examName: examName,
      numberOfQuestions: examQuestions,
      examDuration: examDuration,
    };
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${BASE_API_URL}/create`, formValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        displayNotification(response.data.message, "success");
        window.location.href = "/home";
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
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Duration of Exam</FormLabel>
            <NumberInput min={1}>
              <NumberInputField
                name="examDuration"
                _focus={{ boxShadow: "none" }}
                bg="white"
                value={examDuration}
                onChange={(e) => setExamDuration(e.target.value)}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
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
