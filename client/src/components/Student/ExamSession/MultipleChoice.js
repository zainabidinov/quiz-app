import React from "react";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

const MultipleChoice = ({ options }) => {
  return (
    <RadioGroup>
      {options.map((option, index) => (
        <Stack direction="column">
          <Radio margin={4} key={index} value={option}>
            {option}
          </Radio>
        </Stack>
      ))}
    </RadioGroup>
  );
};

export default MultipleChoice;
