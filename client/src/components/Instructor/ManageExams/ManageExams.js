import React, { useEffect, useState } from "react";
import "./ManageExams.css";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mantine/core";
import { useDispatch } from "react-redux";
import { setExam } from "../../../redux/examSlice";

const ManageExams = ({ activeNavItem, onNavItemClick }) => {
  const BASE_API_URL = "https://quiz-app-zainabidinov-api.onrender.com/api/quizzes";
  const [examData, setExamData] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const [pageFocus, setPageFocus] = useState(1);
  const examsPerPage = 5;

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

        const response = await axios.get("https://quiz-app-zainabidinov-api.onrender.com/api/quizzes/getQuizzes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = response.data;

        setExamData(data);
      } catch (error) {
        displayNotification(error.message, "error");
      }
    };

    fetchExamData();
  }, []);

  const onButtonClick = () => {
    onNavItemClick("quizzes/create");
  };

  const handleEditExamButton = async (quizId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(`https://quiz-app-zainabidinov-api.onrender.com/api/quizzes/getQuiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message, data } = response.data;

      if (success) {
        dispatch(setExam(data));
        onNavItemClick(`quizzes/edit-exam/${data._id}`);
      } else {
      }
    } catch (error) {
      displayNotification(error.message, "error");
    }
  };

  const pageSwitchHandler = (value) => {
    setPageFocus(value);
  };

  const handleDeleteExamButton = async (quizId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.delete(`https://quiz-app-zainabidinov-api.onrender.com/api/quizzes/deleteQuiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message, data } = response.data;

      if (success) {
        displayNotification(message, "success");
        dispatch(setExam(data));

        setExamData((prevExamData) =>
          prevExamData.filter((exam) => exam._id !== quizId)
        );

      } else {
        displayNotification(message, "error");
      }
    } catch (error) {
      displayNotification(error.message, "error");
    }
  };

  const lastIndex = pageFocus * examsPerPage;
  const firstIndex = lastIndex - examsPerPage;
  const currentExams = examData.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(examData.length / examsPerPage);

  return (
    <>
      <div className="manage-exams">
        {currentExams.length > 0 ? (
          <div className="examContent-block">
            {currentExams.map((exam) => (
              <div className="examContent">
                <div key={exam._id}>
                  <span className="examSubject">{exam.subject}</span>
                  <br />
                  <span className="examName">{exam.name}</span>
                </div>
                <div className="examContent__buttons">
                  <Button
                    className={
                      activeNavItem === "quizzes/edit-exam/:id" ? "active" : ""
                    }
                    margin={1}
                    size="sm"
                    colorScheme="teal"
                    variant="outline"
                    onClick={() => handleEditExamButton(exam._id)}
                  >
                    Edit Exam
                  </Button>
                  <Button
                    className={
                      activeNavItem === "quizzes/edit-exam/:id" ? "active" : ""
                    }
                    margin={1}
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => handleDeleteExamButton(exam._id)}
                  >
                    Delete Exam
                  </Button>
                </div>
              </div>
            ))}
            <Button
              className={activeNavItem === "quizzes/create" ? "active" : ""}
              colorScheme="teal"
              size="sm"
              onClick={() => onNavItemClick("quizzes/create")}
              ml={2}
            >
              Add Exam
            </Button>
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
        ) : (
          <div>
            <h1>No exams to show</h1>
            <Button
              className={activeNavItem === "quizzes/create" ? "active" : ""}
              colorScheme="teal"
              size="sm"
              onClick={() => onNavItemClick("quizzes/create")}
            >
              Add Exam
            </Button>
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
        )}
      </div>
    </>
  );
};

export default ManageExams;
