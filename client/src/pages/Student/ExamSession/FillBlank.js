import React from "react";
import { Input, FormLabel, FormControl } from "@chakra-ui/react";

const FillBlank = ({
  handleUserAnswers,
  selectedAnswer,
  question,
  chosenData,
}) => {
  const userAnswerChange = (e) => {
    handleUserAnswers(e.target.value);
  };

  const isAnswerSelected = chosenData.hasOwnProperty(question._id);
  const selectedValue = isAnswerSelected ? chosenData[question._id] : "";

  return (
    <FormControl>
      <FormLabel fontSize={18} color="#959db6">
        Your answer
      </FormLabel>
      <Input
        variant="filled"
        placeholder="Type your answer"
        value={selectedValue}
        onChange={userAnswerChange}
      />
    </FormControl>
  );
};

export default FillBlank;
