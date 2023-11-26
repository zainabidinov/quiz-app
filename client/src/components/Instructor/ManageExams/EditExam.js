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
import {
  setExam,
  setExamProperty,
  setQuestionProperty,
} from "../../../redux/examSlice.js";
import { Pagination } from "@mantine/core";
import axios from "axios";
import { Outlet, useParams } from "react-router-dom";
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
import { EditIcon } from "@chakra-ui/icons";

const EditExam = () => {
  const API_URL = "https://quiz-app-zainabidinov-api.onrender.com/api/quizzes";
  const params = useParams();
  const toast = useToast();
  const dispatch = useDispatch();
  const currentExam = useSelector((state) => state.exam);
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
  const isLimitReached = currentExam.exam.questions.length;

  const [pageFocus, setPageFocus] = useState(1);
  const questionsPerPage = 4;

  const [totalSeconds, setTotalSeconds] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const hours = Math.floor(currentExam.exam.duration / 3600);
    const minutes = Math.floor((currentExam.exam.duration % 3600) / 60);
    setHours(hours);
    setMinutes(minutes);
  }, [currentExam.exam.duration]);

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

      const totalSeconds = hours * 3600 + minutes * 60;

      const updatedExamData = {
        name: updatedExam.name,
        numberOfQuestions: updatedExam.numberOfQuestions,
        duration: totalSeconds,
      };

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
          value: totalSeconds,
        })
      );

      let quizId = params.id;

      const response = await axios.put(
        `${API_URL}/update-quiz/${quizId}`,
        updatedExamData,
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
        setNewQuestion({
          questionName: "",
          questionType: "",
          options: [],
          correctOption: "",
        });
        setIsQuestionOpen(false);
      } else {
        displayNotification(response.data.message, "error");
      }
    } catch (error) {
      displayNotification(error.message, "error");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      let quizId = params.id;

      const response = await axios.delete(
        `${API_URL}/delete-question/${quizId}/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        displayNotification(response.data.message, "success");
        dispatch(setExam(response.data.data));
      } else {
        displayNotification(response.data.message, "error");
      }
    } catch (error) {
      displayNotification(error.message, "error");
    }
  };

  const pageSwitchHandler = (value) => {
    setPageFocus(value);
  };

  const lastIndex = pageFocus * questionsPerPage;
  const firstIndex = lastIndex - questionsPerPage;
  const currentQuestions = currentExam.exam.questions.slice(
    firstIndex,
    lastIndex
  );
  const totalPages = Math.ceil(
    currentExam.exam.questions.length / questionsPerPage
  );

  return (
    <>
      <div className="editExam">
        <div className="editExam-container">
          <p>Number of Exam Questions: {numberOfQuestions}</p>

          <p>
            Duration of Exam:{" "}
            {hours > 0 && `${hours} hour${hours > 1 ? "s" : ""} `}
            {minutes} minute{minutes !== 1 ? "s" : ""}
          </p>

          <Button
            type="button"
            colorScheme="blue"
            size="md"
            leftIcon={<EditIcon boxSize={4} />}
            onClick={handleExamOpenModal}
          >
            Edit Exam
          </Button>
        </div>

        {/* Modal for editing main exam details */}
        <Modal isOpen={isExamOpen} onClose={handleExamCloseModal}>
          <ModalOverlay />
          <ModalContent mx={2}>
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
                    <Stack direction="row">
                      <NumberInput min={0}>
                        <NumberInputField
                          name="hours"
                          _focus={{ boxShadow: "none" }}
                          bg="white"
                          placeholder="Hours"
                          value={hours}
                          onChange={(e) => setHours(parseInt(e.target.value))}
                        />
                      </NumberInput>
                      <NumberInput min={0}>
                        <NumberInputField
                          name="minutes"
                          _focus={{ boxShadow: "none" }}
                          bg="white"
                          placeholder="Minutes"
                          value={minutes}
                          onChange={(e) => setMinutes(parseInt(e.target.value))}
                        />
                      </NumberInput>
                    </Stack>
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

        <div className="editQuestionsContainer">
          {currentQuestions.length > 0 ? (
            <div className="w-full grid">
              {currentQuestions.map((question) => (
                <div className="editQuestions-item" key={question._id}>
                  <div className="editQuestions-item__content">
                    <div>
                      <p>Question: {question.questionName}</p>
                      <p>Correct Option: {question.correctOption}</p>
                    </div>

                    <Button
                      colorScheme="red"
                      mr={3}
                      type="submit"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question._id)}
                    >
                      Delete Question
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="editQuestions">
                <div className="editQuestions__absence">
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
              </div>
            </div>
          )}
        </div>

        <div className="EditExamFormFooter">
          {currentQuestions.length > 0 ? (
            <div>
              {isLimitReached === numberOfQuestions ? (
                ""
              ) : (
                <Button
                  colorScheme="teal"
                  mt={3}
                  ml={5}
                  type="submit"
                  size="sm"
                  onClick={handleQuestionOpenModal}
                >
                  Add Question
                </Button>
              )}
            </div>
          ) : (
            <div>{""}</div>
          )}
        </div>

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
                            placeholder="a"
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
                            placeholder="b"
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
                            placeholder="c"
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
                            placeholder="d"
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

        <div className="paginationContainer">
          <Pagination
            style={{ marginTop: "16px" }}
            size="sm"
            total={totalPages}
            perPage={1}
            value={pageFocus}
            onChange={pageSwitchHandler}
            nextLabel={pageFocus === totalPages ? null : "Next"}
            prevLabel={pageFocus === 1 ? null : "Previous"}
            nextDisabled={pageFocus === totalPages}
            prevDisabled={pageFocus === 1}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default EditExam;
