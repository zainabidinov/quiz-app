import React from "react";
import { Radio, RadioGroup } from "@chakra-ui/react";
import { FormLabel, FormControl, Grid } from "@chakra-ui/react";

const MultipleChoice = ({ options, handleUserAnswers, selectedAnswer }) => {
  const userAnswerChange = (value) => {
    handleUserAnswers(value);
  };

  return (
    <FormControl>
      <FormLabel fontSize={18} color="#959db6">
        Choose your answer
      </FormLabel>
      <RadioGroup mt={4} value={selectedAnswer} onChange={userAnswerChange}>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {options.map((option, index) => (
            <Radio
              size="lg"
              colorScheme="green"
              key={index}
              value={option}
              onChange={() => userAnswerChange(option)}
            >
              {option}
            </Radio>
          ))}
        </Grid>
      </RadioGroup>
    </FormControl>
  );
};

export default MultipleChoice;
