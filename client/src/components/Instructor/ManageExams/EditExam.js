import React, { useState, useEffect } from "react";
import "./EditExam.css";
import {
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
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { setExam, setExamProperty } from "../../../redux/examSlice.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  Button,
  NumberInput,
  NumberInputField,
  useToast,
  Select,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";

const EditExam = () => {
  const API_URL = "/api/quizzes";
  const currentExam = useSelector((state) => state.exam);
  const dispatch = useDispatch();
  const { name, numberOfQuestions, duration } = currentExam.exam;
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [updatedExam, setUpdatedExam] = useState({
    name: "",
    numberOfQuestions: null,
    duration: null,
  });
  const [newQuestion, setNewQuestion] = useState({
    questionName: "",
    questionType: "",
    options: [],
    correctOption: "",
  });
  const params = useParams();
  const toast = useToast();

  console.log("Current Redux: ", currentExam);

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
    setIsExamOpen(true);
  };

  const handleExamCloseModal = () => {
    setIsExamOpen(false);
  };

  const handleQuestionOpenModal = () => {
    setIsQuestionOpen(true);
  };

  const handleQuestionCloseModal = () => {
    setIsQuestionOpen(false);
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
        setIsExamOpen(false);
      } else {
        displayNotification(response.data.message, "error");
      }
    } catch (error) {
      displayNotification(error.message, "error");
    }
  };

  const onQuestionFormSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "This is the object newQuestion after submit button triggered",
      newQuestion
    );

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      let quizId = params.id;
      const response = await axios.post(
        `${API_URL}/add-question/${quizId}`,
        newQuestion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        displayNotification(response.data.message, "success");
        dispatch(setExam(response.data.data));
        console.log("The redux after update", currentExam.exam);
        setNewQuestion({
          questionName: "",
          questionType: "",
          options: [],
          correctOption: "",
        });
      } else {
        displayNotification(response.data.message, "error");
      }
    } catch (error) {
      displayNotification(error.message, "error");
    }
  };

  return (
    <>
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
      </div>

      <Modal isOpen={isExamOpen} onClose={handleExamCloseModal}>
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

      {currentExam.exam.questions.length > 0 ? (
        <div className="editQuestionsContainer">
          <div className="editQuestionsForm">
            <Stack direction="row">
              <p>Your question:</p>
              {currentExam.exam.questions[0].questionName}
            </Stack>
          </div>
        </div>
      ) : (
        <div className="editQuestionsContainer">
          <div className="editQuestionsForm">
            <Stack direction="row">
              <div className="editQuestionsForm__absence">
                <p>No Questions For Exam Added Yet</p>
                <Button
                  colorScheme="teal"
                  mr={3}
                  type="submit"
                  size="sm"
                  onClick={handleQuestionOpenModal}
                >
                  Add Question
                </Button>
              </div>
            </Stack>
          </div>
        </div>
      )}

      <Modal isOpen={isQuestionOpen} onClose={handleQuestionCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Question</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={onQuestionFormSubmit}>
            <ModalBody>
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Name of Question</FormLabel>
                  <Input
                    placeholder="Enter your question"
                    value={newQuestion.questionName}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        questionName: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Question Type</FormLabel>
                  <Select
                    placeholder="Select question type"
                    value={newQuestion.questionType}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        questionType: e.target.value,
                      })
                    }
                  >
                    <option value="multipleChoice">Multiple Choice</option>
                    <option value="trueFalse">True/False</option>
                    <option value="fillBlank">Fill In The Blank</option>
                  </Select>
                </FormControl>

                {newQuestion.questionType === "multipleChoice" && (
                  <>
                    <FormControl>
                      <FormLabel>Options</FormLabel>
                      <Stack spacing={1}>
                        <Input
                          value={newQuestion.options[0]}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              options: [
                                e.target.value,
                                newQuestion.options[1],
                                newQuestion.options[2],
                                newQuestion.options[3],
                              ],
                            })
                          }
                          placeholder="Option 1"
                        />
                        <Input
                          value={newQuestion.options[1]}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              options: [
                                newQuestion.options[0],
                                e.target.value,
                                newQuestion.options[2],
                                newQuestion.options[3],
                              ],
                            })
                          }
                          placeholder="Option 2"
                        />
                        <Input
                          value={newQuestion.options[2]}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              options: [
                                newQuestion.options[0],
                                newQuestion.options[1],
                                e.target.value,
                                newQuestion.options[3],
                              ],
                            })
                          }
                          placeholder="Option 3"
                        />
                        <Input
                          value={newQuestion.options[3]}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              options: [
                                newQuestion.options[0],
                                newQuestion.options[1],
                                newQuestion.options[2],
                                e.target.value,
                              ],
                            })
                          }
                          placeholder="Option 4"
                        />
                      </Stack>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Correct Option</FormLabel>
                      <Input
                        value={newQuestion.correctOption}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            correctOption: e.target.value,
                          })
                        }
                        placeholder="Correct option"
                      />
                    </FormControl>
                  </>
                )}

                {newQuestion.questionType === "trueFalse" && (
                  <>
                    <FormControl>
                      <FormLabel>Correct Option</FormLabel>
                      <RadioGroup
                        value={newQuestion.correctOption}
                        onChange={(value) =>
                          setNewQuestion({
                            ...newQuestion,
                            correctOption: value,
                          })
                        }
                      >
                        <Stack spacing={1}>
                          <Radio value="true">True</Radio>
                          <Radio value="false">False</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  </>
                )}

                {newQuestion.questionType === "fillBlank" && (
                  <>
                    <FormControl>
                      <FormLabel>Correct Option</FormLabel>
                      <Input
                        value={newQuestion.correctOption}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            correctOption: e.target.value,
                          })
                        }
                        placeholder="Correct option"
                      />
                    </FormControl>
                  </>
                )}

                {newQuestion.questionType && (
                  <Button type="submit" colorScheme="teal">
                    Submit
                  </Button>
                )}
              </Stack>
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditExam;
