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
    if (timeLeft === 0) {
      onExamSubmit();
    }
  }, [timeLeft]);

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

  const renderedQuestion = quiz.questions ? quiz.questions[currentIndx] : null;

  const onExamSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const newReport = {};
    const qIds = quiz.questions.map((question) => question._id);

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    quiz.questions.forEach((question) => {
      const qId = question._id;
      const correctAnswer = question.correctOption;
      const userAnswer = chosenData[qId];

      if (!userAnswer) {
        newReport[qId] = "Not answered";
        unanswered++;
      } else if (
        userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
      ) {
        newReport[qId] = "Correct";
        correct++;
      } else {
        newReport[qId] = "Wrong";
        wrong++;
      }
    });

    qIds.forEach((qId) => {
      if (!newReport.hasOwnProperty(qId)) {
        newReport[qId] = "Not answered";
        unanswered++;
      }
    });

    setReport(newReport);

    setNumUnanswered(unanswered);
    setNumCorrect(correct);
    setNumWrong(wrong);

    const totalQuestions = quiz.questions.length;
    const examScore = (correct / totalQuestions) * 100;
    setScore(examScore);
    setIsExamFinished(true);

    console.log("Data on submission: ", chosenData);
    console.log("Report on submission: ", report);
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
                <p>Number of correct answers: {numCorrect}</p>
                <p>Number of wrong answers: {numWrong}</p>
                <p>Not Answered: {numUnanswered}</p>
              </div>
            </div>
            <div className="exam-session__result-footer">
              <Button colorScheme="teal" borderRadius="10px">
                Go Home
              </Button>
              <Button colorScheme="teal" borderRadius="10px">
                View Feedback
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSession;
