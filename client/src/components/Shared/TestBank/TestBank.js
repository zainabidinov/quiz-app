import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TestBank.css";
import { useDispatch, useSelector } from "react-redux";
import { Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { setExam } from "../../../redux/examSlice";
import { Pagination } from "@mantine/core";

const TestBank = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = useState([]);
  const [pageFocus, setPageFocus] = useState(1);
  const examsPerPage = 6;
  const retrievedExams = useSelector((state) => state.exam.exam);
  console.log("Redux state: ", examData);

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

        const response = await axios.get("/api/quizzes/getQuizzes", {
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
              <div className="examMainContent__content-items" key={index}>
                <h1>{exam.name}</h1>
                <p>Number of Questions: {exam.numberOfQuestions}</p>
                <p>Duration of Exam: {exam.numberOfQuestions}</p>
                <Button
                  style={{ width: "125px", height: "30px", fontSize: "15px" }}
                  colorScheme="teal"
                  variant="outline"
                  mt={2}
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
    </div>
  );
};

export default TestBank;
