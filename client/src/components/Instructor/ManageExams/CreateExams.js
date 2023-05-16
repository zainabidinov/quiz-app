import React from "react";
import {
  Input,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

const CreateExams = () => {
  return (
    <>
      <Stack direction="column">
        <label htmlFor="examName">Name of Exam</label>
        <Input type="text" id="examName"></Input>

        <label htmlFor="numberOfQuestions">Number of Exam Questions </label>
        <Input type="number" id="numberOfQuestions"></Input>

        <label htmlFor="duration">Duration of Exam</label>
        <Input type="number" id="duration"></Input>
      </Stack>
    </>
  );
};

export default CreateExams;
