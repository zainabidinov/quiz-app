import React from "react";
import { Input, FormLabel, FormControl } from "@chakra-ui/react";

const FillBlank = ({ handleUserAnswers, selectedAnswer }) => {
  const userAnswerChange = (e) => {
    handleUserAnswers(e.target.value);
  };

  return (
    <FormControl>
      <FormLabel fontSize={18} color="#959db6">
        Your answer
      </FormLabel>
      <Input
        variant="filled"
        placeholder="Enter your answer"
        value={selectedAnswer}
        onChange={userAnswerChange}
      />
    </FormControl>
  );
};

export default FillBlank;
