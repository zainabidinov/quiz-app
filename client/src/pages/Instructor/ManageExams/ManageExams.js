import React, { useEffect, useState } from "react";
import "./ManageExams.css";
import teacher from "../../../assets/images/teacher.svg";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "@mantine/core";
import { useDispatch } from "react-redux";
import { setExam } from "../../../redux/examSlice";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const ManageExams = ({ activeNavItem, onNavItemClick }) => {
  const BASE_API_URL =
    "https://quiz-app-zainabidinov-api.onrender.com/api/quizzes";
  const [examData, setExamData] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const [pageFocus, setPageFocus] = useState(1);
  const examsPerPage = 6;

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
          "https://quiz-app-zainabidinov-api.onrender.com/api/quizzes/getQuizzes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { data } = response.data;

        setExamData(data);
      } catch (error) {
        console.log("No exam found in the database", error);
      }
    };

    fetchExamData();
  }, []);

  // const onButtonClick = () => {
  //   onNavItemClick("quizzes/create");
  // };

  const handleEditExamButton = async (quizId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        `https://quiz-app-zainabidinov-api.onrender.com/api/quizzes/getQuiz/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { success, message, data } = response.data;

      if (success) {
        // dispatch(setExam(data));
        // onNavItemClick(`quizzes/edit-exam/${data._id}`);
        navigate(`quizzes/edit-exam/${data._id}`);
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

      const response = await axios.delete(
        `https://quiz-app-zainabidinov-api.onrender.com/api/quizzes/deleteQuiz/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
        <div className="manage-exams__header">Manage Exams</div>
        {currentExams.length > 0 ? (
          <div className="manage-exams__layout">
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="examContent">
                {currentExams.map((exam) => (
                  <div className="examContent-item">
                    <div key={exam._id}>
                      <p>
                        Subject:{" "}
                        <span className="examSubject">{exam.subject}</span>
                      </p>
                      <p>
                        Exam Name: <span className="examName">{exam.name}</span>
                      </p>
                      <p>
                        Total Questions:{" "}
                        <span className="examName">
                          {exam.numberOfQuestions}
                        </span>
                      </p>
                    </div>

                    <div className="examContent__buttons">
                      <Button
                        className={
                          activeNavItem === "quizzes/edit-exam/:id"
                            ? "active"
                            : ""
                        }
                        margin={1}
                        size="sm"
                        colorScheme="blue"
                        variant="solid"
                        leftIcon={<EditIcon boxSize={4} />}
                        onClick={() => handleEditExamButton(exam._id)}
                      >
                        Edit Exam
                      </Button>
                      <Button
                        className={
                          activeNavItem === "quizzes/edit-exam/:id"
                            ? "active"
                            : ""
                        }
                        margin={1}
                        size="sm"
                        colorScheme="red"
                        variant="solid"
                        leftIcon={<DeleteIcon boxSize={4} />}
                        onClick={() => handleDeleteExamButton(exam._id)}
                      >
                        Delete Exam
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="quizzes/create">
                <Button
                  className="btn-addExam"
                  colorScheme="teal"
                  size="sm"
                  ml={2}
                >
                  Add Exam
                </Button>
              </Link>
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
        ) : (
          <div className="results--content__empty">
            <img src={teacher} alt="teacher" />
            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              You haven't created any exams yet.
            </p>
            <p
              style={{
                marginBottom: "0.5rem",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {" "}
              Would you like to add one?
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageExams;
