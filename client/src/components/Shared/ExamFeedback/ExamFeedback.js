import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ExamFeedback.css";
import { useParams } from "react-router-dom";
import { Box, Grid, Heading, Text, Radio, RadioGroup } from "@chakra-ui/react";

const ExamFeedback = () => {
  const params = useParams();
  const [examRecord, setExamRecord] = useState([]);

  const fetchExamResult = async () => {
    try {
      let recordId = params.id;
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `https://quiz-app-zainabidinov-api.onrender.com/api/quizzes/results/getExamEvaluation/${recordId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        console.log("Result fetch successful", res.data.message);
        setExamRecord(res.data.data);
      } else {
        console.log("Result fetch failed", res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchExamResult();
  }, []);

  const renderQuestions = (question, index) => {
    const reportItem = examRecord.report.find(
      (item) => item.questionId === question._id
    );
    const userAnswer = reportItem ? reportItem.answer : "";
    const correctAnswer = question.correctOption;

    let commentIcon;
    let backgroundStyle;

    if (reportItem) {
      if (reportItem.status === "Correct") {
        commentIcon = (
          <span className="mdi mdi-check-circle correct"> Correct</span>
        );
        backgroundStyle = { backgroundColor: "#e8fff4" };
      } else if (reportItem.status === "Wrong") {
        commentIcon = (
          <span className="mdi mdi-close-circle wrong"> Wrong</span>
        );
        backgroundStyle = { backgroundColor: "#fae8e8" };
      } else if (reportItem.status === "Not answered") {
        commentIcon = (
          <span className="mdi mdi-help-circle wrong"> Not Answered</span>
        );
        backgroundStyle = { backgroundColor: "#fae8e8" };
      }
    }

    return (
      <Box key={index} p={4} mb={4} bg="white" borderRadius={5} boxShadow="md">
        <Heading size="sm" mb={3}>
          {index + 1}. {question.questionName}
        </Heading>
        {renderAnswerOptions(question, userAnswer)}
        <Box style={backgroundStyle}>
          <Text>
            <span className="comment-icon">{commentIcon}</span>
          </Text>
          <Text size="md">Correct Answer: {correctAnswer}</Text>
        </Box>
      </Box>
    );
  };

  const renderAnswerOptions = (question, userAnswer) => {
    if (question.questionType === "multipleChoice") {
      return (
        <RadioGroup mb={4} defaultValue={userAnswer}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {question.options.map((option, index) => (
              <Radio
                key={index}
                value={option}
                size="lg"
                colorScheme="green"
                isReadOnly
                isChecked={userAnswer === option}
              >
                {option}
              </Radio>
            ))}
          </Grid>
        </RadioGroup>
      );
    } else if (question.questionType === "trueFalse") {
      return (
        <RadioGroup defaultValue={userAnswer}>
          <Grid mb={4} templateColumns="repeat(2, 1fr)" gap={4}>
            <Radio
              value="True"
              size="lg"
              colorScheme="green"
              isReadOnly
              isChecked={userAnswer === "True"}
            >
              True
            </Radio>
            <Radio
              value="False"
              size="lg"
              colorScheme="green"
              isReadOnly
              isChecked={userAnswer === "False"}
            >
              False
            </Radio>
          </Grid>
        </RadioGroup>
      );
    } else if (question.questionType === "fillBlank") {
      return <Text mb={4}>Submitted Answer: {userAnswer}</Text>;
    }
  };

  return (
    <div className="examFeedback--container">
      <div className="examFeedback--content">
        <div className="examFeedback--content__header">
          <h1>Exam Feedback</h1>
        </div>
        {examRecord.exam && (
          <Box>
            <Heading size="md" mb={4}>
              Exam: {examRecord.exam.name}
            </Heading>
            <Box>
              {examRecord.exam.questions.map((question, index) =>
                renderQuestions(question, index)
              )}
            </Box>
          </Box>
        )}
      </div>
    </div>
  );
};

export default ExamFeedback;
