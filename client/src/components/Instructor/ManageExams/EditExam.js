import React, { useState, useEffect } from "react";
import "./EditExam.css";
import { useSelector, useDispatch } from "react-redux";
import { setExam, setExamProperty } from "../../../redux/examSlice.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";

const EditExam = () => {
  const API_URL = "/api/quizzes";
  const currentExam = useSelector((state) => state.exam);
  const dispatch = useDispatch();
  const { name, numberOfQuestions, duration } = currentExam.exam;
  console.log(name, numberOfQuestions, duration);
  const [isOpen, setIsOpen] = useState(false);
  const [updatedExam, setUpdatedExam] = useState({
    name: "",
    numberOfQuestions: 1,
    duration: 1,
  });
  const params = useParams();
  const toast = useToast();

  const displayNotification = (message, status) => {
    toast({
      description: message,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    setUpdatedExam({
      name: currentExam.exam.name,
      numberOfQuestions: currentExam.exam.numberOfQuestions,
      duration: currentExam.exam.duration,
    });
  }, [currentExam.exam]);

  const handleExamOpenModal = () => {
    setIsOpen(true);
  };

  const handleExamCloseModal = () => {
    setIsOpen(false);
  };

  const onExamFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      dispatch(
        setExamProperty({
          type: "SET_EXAM_NAME",
          value: updatedExam.name,
        })
      );
      dispatch(
        setExamProperty({
          type: "SET_NUMBER_OF_QUESTIONS",
          value: updatedExam.numberOfQuestions,
        })
      );
      dispatch(
        setExamProperty({
          type: "SET_EXAM_DURATION",
          value: updatedExam.duration,
        })
      );

      let quizId = params.id;

      const response = await axios.put(
        `${API_URL}/update-quiz/${quizId}`,
        updatedExam,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        displayNotification(response.data.message, "success");

        const { name, numberOfQuestions, duration } = response.data.data;
        dispatch(setExam(response.data.data));
        setUpdatedExam({
          ...updatedExam,
          name: name,
          numberOfQuestions: numberOfQuestions,
          duration: duration,
        });
        setIsOpen(false);
      } else {
        displayNotification(response.data.message, "error");
      }
    } catch (error) {
      displayNotification(error.message, "error");
    }
  };

  return (
    <div className="editExamFormContainer">
      <form className="editExamForm">
        <Stack direction="row">
          <FormControl>
            <FormLabel>Name of Exam</FormLabel>

            <Text as="em" textDecoration="underline">
              {name}
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Number of Exam Questions</FormLabel>
            <Text as="em" textDecoration="underline">
              {numberOfQuestions}
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel>Duration of Exam</FormLabel>
            <Text as="em" textDecoration="underline">
              {duration}
            </Text>
          </FormControl>

          <Button
            type="button"
            colorScheme="teal"
            size="md"
            mt={8}
            width="50%"
            onClick={handleExamOpenModal}
          >
            Edit Exam
          </Button>
        </Stack>
      </form>

      <Modal isOpen={isOpen} onClose={handleExamCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Exam</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={onExamFormSubmit}>
            <ModalBody>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Name of Exam</FormLabel>
                  <Input
                    placeholder={name}
                    value={updatedExam.name}
                    onChange={(e) =>
                      setUpdatedExam({
                        ...updatedExam,
                        name: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Number of Exam Questions</FormLabel>
                  <NumberInput min={1}>
                    <NumberInputField
                      name="numberOfQuestions"
                      _focus={{ boxShadow: "none" }}
                      bg="white"
                      placeholder={numberOfQuestions}
                      value={updatedExam.numberOfQuestions}
                      onChange={(e) =>
                        setUpdatedExam({
                          ...updatedExam,
                          numberOfQuestions: parseInt(e.target.value),
                        })
                      }
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
                      placeholder={duration}
                      value={updatedExam.duration}
                      onChange={(e) =>
                        setUpdatedExam({
                          ...updatedExam,
                          duration: parseInt(e.target.value),
                        })
                      }
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="teal" mr={3} type="submit">
                Save
              </Button>
              <Button onClick={handleExamCloseModal}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditExam;
