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
  // console.log("Local state: ", examData);

  const handleInfoOpenModal = (quizId) => {
    setSelectedExam(examData.filter((e) => e._id === quizId));
    console.log("Filtered exam", selectedExam);
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

        const response = await axios.get("/api/quizzes/getStudentQuizzes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { success, message, data } = response.data;

        if (success) {
          displayNotification(message, "success");
          setExamData(data);
        } else {
          displayNotification(message, "error");
        }
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

  const lastIndex = pageFocus * examsPerPage;
  const firstIndex = lastIndex - examsPerPage;
  const currentExams = examData.slice(firstIndex, lastIndex);

  return (
    <div className="examMainContaioner">
      <div className="examMainContent">
        <div className="examMainContent__header">
          <h1>Available Exams</h1>
        </div>

        <div className="examMainContent__content">
          {currentExams &&
            currentExams.map((exam, index) => (
              <div className="examMainContent__content-items" key={exam._id}>
                <h1>{exam.name}</h1>
                <p>Subject: {exam.subject}</p>
                <p>Number of Questions: {exam.numberOfQuestions}</p>
                <p>Duration of Exam: {exam.duration}</p>
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
            total={examData.length}
            perPage={examsPerPage}
            value={pageFocus}
            onChange={pageSwitchHandler}
          />
        </div>
      </div>

      <Modal isOpen={isInfoOpen} onClose={handleInfoCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedExam[0]?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={2}>
              <p>
                This exam is designed to test your knowledge in{" "}
                {selectedExam[0]?.subject}
              </p>
              <p>
                You have {selectedExam[0]?.duration} minutes to
                complete this exam
              </p>
              <p>
                There are {selectedExam[0]?.numberOfQuestions}{" "}
                questions in this exam
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
