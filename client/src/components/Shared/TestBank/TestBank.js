import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TestBank.css";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const TestBank = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = useState([]);

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

  return (
    <div className="examMainContaioner">
      <div className="examMainContent">
        <div className="examMainContent__header">
          <h1>Available Exams</h1>
        </div>
      </div>
    </div>
  );
};

export default TestBank;
