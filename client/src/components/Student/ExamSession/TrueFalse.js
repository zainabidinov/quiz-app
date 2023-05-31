import React from "react";
import { Radio, RadioGroup } from "@chakra-ui/react";
import { FormLabel, FormControl, Grid } from "@chakra-ui/react";

const TrueFalse = ({ handleUserAnswers, selectedAnswer }) => {
  const userAnswerChange = (value) => {
    handleUserAnswers(value);
  };
  return (
    <FormControl>
      <FormLabel fontSize={18} color="#959db6">
        Choose your answer
      </FormLabel>
      <RadioGroup mt={4} value={selectedAnswer} onChange={userAnswerChange}>
        <Grid templateColumns="repeat(2, 1fr)">
          <Radio
            size="lg"
            colorScheme="green"
            value="true"
            onChange={() => userAnswerChange("true")}
          >
            True
          </Radio>
          <Radio
            size="lg"
            colorScheme="green"
            value="false"
            onChange={() => userAnswerChange("false")}
          >
            False
          </Radio>
        </Grid>
      </RadioGroup>
    </FormControl>
  );
};

export default TrueFalse;
