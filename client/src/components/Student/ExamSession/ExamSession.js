import React, { useEffect, useState } from "react";
import "./ExamSession.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import Question from "./Question";

const ExamSession = () => {
  const params = useParams();
  const [quiz, setQuiz] = useState({});
  const [currentIndx, setCurrentIndx] = useState(0);
  const [chosenData, setChosenData] = useState({});

  useEffect(() => {
    const fetchExamSessionData = async () => {
      try {
        const quizId = params.id;
        const token = localStorage.getItem("token");

        const res = await axios.get(`/api/quizzes/getQuiz/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { success, message, data } = res.data;
        if (success) {
          console.log("If success message: ", message);
          setQuiz(data);
        } else {
          console.log("If error message: ", message);
        }
      } catch (error) {
        console.log("If catch error message: ", error.message);
      }
    };

    fetchExamSessionData();
  }, []);

  const nextQuestion = () => {
    if (currentIndx < quiz.questions.length - 1) {
      setCurrentIndx((prevIndex) => prevIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentIndx > 0) {
      setCurrentIndx((prevIndex) => prevIndex - 1);
    }
  };

  const renderedQuestion = quiz.questions ? quiz.questions[currentIndx] : null;

  return (
    <div className="exam-session">
      <div className="exam-session__header">
        {renderedQuestion && <h2>Question {currentIndx + 1}</h2>}
      </div>
      <div className="exam-session__body">
        {renderedQuestion && <Question question={renderedQuestion} />}
      </div>
      <div className="exam-session__footer">
        <Button
          colorScheme="purple"
          borderRadius="10px"
          onClick={previousQuestion}
          disabled={currentIndx === 0}
        >
          Previous
        </Button>
        <Button
          colorScheme="purple"
          borderRadius="10px"
          onClick={nextQuestion}
          disabled={currentIndx === quiz.questions?.length - 1}
        >
          Next
        </Button>
        {currentIndx === quiz.questions?.length - 1 && (
          <Button colorScheme="purple" borderRadius="10px">
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExamSession;
