import React, { useEffect, useState } from "react";
import "./ManageExams.css";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ManageExams = ({ activeNavItem, onNavItemClick }) => {
  const BASE_API_URL = "/api/quizzes";
  const [examData, setExamData] = useState("");
  const navigate = useNavigate();
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
    const fetchExamData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const quizResponse = await axios.get("/api/quizzes/getQuizzes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { success, message, data } = quizResponse.data;

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

  const onButtonClick = () => {
    onNavItemClick("quizzes/create");
  };

  return (
    <>
      <div className="manage-exams">
        {examData ? (
          <div>
            <div>{examData.name}</div>
            <button className="btn_addExam">Add Exam</button>
          </div>
        ) : (
          <div>
            <p>No exams to show</p>
            <Button
              className={activeNavItem === "quizzes/create" ? "active" : ""}
              colorScheme="teal"
              size="sm"
              onClick={onButtonClick}
            >
              Add Exam
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageExams;
