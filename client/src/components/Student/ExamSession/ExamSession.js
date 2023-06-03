import React, { useEffect, useState } from "react";
import "./ExamSession.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import Question from "./Question";

const ExamSession = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [quiz, setQuiz] = useState({});
  const [currentIndx, setCurrentIndx] = useState(0);
  const [chosenData, setChosenData] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [report, setReport] = useState({});
  const [score, setScore] = useState(0);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [numCorrect, setNumCorrect] = useState(0);
  const [numWrong, setNumWrong] = useState(0);
  const [numUnanswered, setNumUnanswered] = useState(0);
  // console.log("Quiz data: ", quiz);

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
          setTimeLeft(data.duration);
        } else {
          console.log("If error message: ", message);
        }
      } catch (error) {
        console.log("If catch error message: ", error.message);
      }
    };

    fetchExamSessionData();
  }, []);

  useEffect(() => {
  if (timeLeft === 0 && !isExamFinished) {
    onExamSubmit();
  }
}, [timeLeft, isExamFinished]);

  useEffect(() => {
    let time = null;

    const timerStarts = () => {
      time = setInterval(() => {
        setTimeLeft((prevValue) => {
          if (prevValue === 0) {
            clearInterval(time);
            onExamSubmit();
            return 0;
          }
          return prevValue - 1;
        });
      }, 1000);
    };

    timerStarts();

    return () => clearInterval(time);
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

  const handleUserAnswers = (qId, answer) => {
    setChosenData((prevAnswers) => ({
      ...prevAnswers,
      [qId]: answer,
    }));

    // console.log("onChosenData change: ", chosenData);
  };

  const onClick = () => {
    navigate("/home");
  };

  const renderedQuestion = quiz.questions ? quiz.questions[currentIndx] : null;

  const onExamSubmit = async () => {
    if (!quiz.questions) {
      return;
    }
  
    const qIds = quiz.questions.map((question) => question._id);
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
  
    const newReport = qIds.reduce((report, qId) => {
      const question = quiz.questions.find((q) => q._id === qId);
      const correctAnswer = question.correctOption;
      const userAnswer = chosenData[qId];
  
      if (!userAnswer) {
        report[qId] = "Not answered";
        unanswered++;
      } else if (
        userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
      ) {
        report[qId] = "Correct";
        correct++;
      } else {
        report[qId] = "Wrong";
        wrong++;
      }
  
      return report;
    }, {});
  
    qIds.forEach((qId) => {
      if (!newReport.hasOwnProperty(qId)) {
        newReport[qId] = "Not answered";
        unanswered++;
      }
    });
  
    setReport(newReport);
  
    const totalQuestions = quiz.questions.length;
    const examScore = (correct / totalQuestions) * 100;
    setNumCorrect(correct);
    setNumWrong(wrong);
    setNumUnanswered(unanswered);
    setScore(examScore);
    setTimeLeft(0);
    setIsExamFinished(true);
  
    console.log("Data on submission: ", chosenData);
    console.log("Report on submission: ", newReport);
  
    try {
      const token = localStorage.getItem("token");
      const { id: quizId } = params;
  
      const resultData = {
        report: newReport,
        score: examScore,
        numCorrect: correct,
        numWrong: wrong,
        numUnanswered: unanswered,
      };
  
      const res = await axios.post(
        `/api/quizzes/results/createResult/${quizId}`,
        resultData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const { success, message, data } = res.data;
  
      if (success) {
        console.log("Exam result successfully submitted");
        console.log("Result data: ", data);
      } else {
        console.log("Failed to submit exam result");
        console.log("Error message: ", message);
      }
    } catch (error) {
      console.log("Failed to submit exam result");
      console.log("Error: ", error.message);
    }
  };
  

  return (
    <div className="exam-session">
      <div className="exam-session__outline">
        {!isExamFinished ? (
          <>
            <div className="exam-session__header">
              {renderedQuestion && <h1>Question {currentIndx + 1}</h1>}
              {renderedQuestion && <h3>Remaining Time: {timeLeft} seconds</h3>}
              {renderedQuestion && <h2>{renderedQuestion.questionName}</h2>}
              <hr />
            </div>
            <div className="exam-session__body">
              {renderedQuestion && (
                <Question
                  question={renderedQuestion}
                  handleUserAnswers={handleUserAnswers}
                  selectedAnswer={chosenData[renderedQuestion._id]}
                />
              )}
            </div>
            <div className="exam-session__footer">
              <Button
                colorScheme="teal"
                borderRadius="10px"
                onClick={previousQuestion}
                disabled={currentIndx === 0}
              >
                Previous
              </Button>
              {currentIndx === quiz.questions?.length - 1 ? (
                ""
              ) : (
                <Button
                  colorScheme="teal"
                  borderRadius="10px"
                  onClick={nextQuestion}
                  disabled={currentIndx === quiz.questions?.length - 1}
                >
                  Next
                </Button>
              )}
              {currentIndx === quiz.questions?.length - 1 && (
                <Button
                  colorScheme="orange"
                  borderRadius="10px"
                  type="submit"
                  onClick={onExamSubmit}
                >
                  Submit Exam & Finish
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="exam-session__result">
            <div className="exam-session__result-body">
              <div>
                <h2>Your exam has been successfully submitted!</h2>
                <h3>
                  Your Grade: <strong>{Math.round(score)}%</strong>
                </h3>
              </div>
              <hr className="result-line" />
              <div>
                <p>
                  <span className="mdi mdi-check-circle correct"></span> Number
                  of correct answers: {numCorrect}
                </p>
                <p>
                  <span className="mdi mdi-close-circle wrong"></span> Number of
                  wrong answers: {numWrong}
                </p>
                <p>
                  <span className="mdi mdi-help-circle unanswered"></span> Not
                  Answered: {numUnanswered}
                </p>
              </div>
            </div>
            <div>
              <Button colorScheme="teal" borderRadius="12px" onClick={onClick}>
                Go Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSession;
