import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TestBank.css";
import { useDispatch, useSelector } from "react-redux";
import { Button, ModalContent, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { setExam } from "../../../redux/examSlice";
import { Pagination } from "@mantine/core";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";
import { ModalCloseButton, ModalOverlay, Stack } from "@chakra-ui/react";

const TestBank = ({ activeNavItem, onNavItemClick }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [examData, setExamData] = useState([]);
  const [selectedExam, setSelectedExam] = useState([]);
  const [pageFocus, setPageFocus] = useState(1);
  const examsPerPage = 6;
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleInfoOpenModal = (quizId) => {
    setSelectedExam(examData.filter((e) => e._id === quizId));
    setIsInfoOpen(true);
  };

  const handleInfoCloseModal = () => {
    setIsInfoOpen(false);
  };

  const displayNotification = (message, status) => {
    toast({
      description: message,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          "https://quiz-app-zainabidinov-api.onrender.com/api/quizzes/getStudentQuizzes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { data } = response.data;

        setExamData(data);
      } catch (error) {
        displayNotification(error.message, "error");
      }
    };

    fetchExamData();
  }, []);

  const onClick = (quizId) => {
    onNavItemClick(`exam-session/${quizId}`);
  };

  const pageSwitchHandler = (value) => {
    setPageFocus(value);
  };

  const convertSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
  };

  const formatTime = (time) => {
    const hoursText =
      time.hours > 0 ? `${time.hours} hour${time.hours !== 1 ? "s" : ""}` : "";
    const minutesText =
      time.minutes > 0
        ? `${time.minutes} minute${time.minutes !== 1 ? "s" : ""}`
        : "";

    return `${hoursText} ${minutesText}`.trim();
  };

  const lastIndex = pageFocus * examsPerPage;
  const firstIndex = lastIndex - examsPerPage;
  const currentExams = examData.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(examData.length / examsPerPage);

  return (
    <div className="examMainContainer">
      <div className="examMainContent">
        <div className="examMainContent__header">
          <h1>Available Exams</h1>
        </div>

        <div className="examMainContent__content">
          {currentExams &&
            currentExams.map((exam, index) => (
              <div className="examMainContent__content-item" key={exam._id}>
                  <h1>{exam.name}</h1>
                  <div className="exam-info">
                    <p>Subject: {exam.subject}</p>
                    <p>Number of Questions: {exam.numberOfQuestions}</p>
                    <p>
                      Duration of Exam:{" "}
                      {formatTime(convertSecondsToTime(exam.duration))}
                    </p>
                  </div>

                <Button
                  style={{ width: "125px", height: "30px", fontSize: "15px" }}
                  colorScheme="teal"
                  variant="outline"
                  mt={2}
                  className={
                    activeNavItem === "exam-session/:id" ? "active" : ""
                  }
                  type="button"
                  onClick={() => handleInfoOpenModal(exam._id)}
                >
                  Attempt exam
                </Button>
              </div>
            ))}
        </div>
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

      <Modal  isOpen={isInfoOpen} onClose={handleInfoCloseModal}>
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader>{selectedExam[0]?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={2}>
              <p>
                This exam is designed to test your knowledge in{" "}
                {selectedExam[0]?.subject}
              </p>
              <p>
                You have{" "}
                {formatTime(convertSecondsToTime(selectedExam[0]?.duration))} to
                complete this exam
              </p>
              <p>
                There are {selectedExam[0]?.numberOfQuestions} questions in the
                exam
              </p>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handleInfoCloseModal}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              variant="outline"
              type="submit"
              onClick={() => onClick(selectedExam[0]?._id)}
            >
              Start exam now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TestBank;
