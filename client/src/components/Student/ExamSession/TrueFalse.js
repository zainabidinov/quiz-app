import React from "react";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

const TrueFalse = () => {
  return (
    <RadioGroup mt={4} >
      <Stack direction="column">
        <Radio value="true">True</Radio>
        <Radio value="false">False</Radio>
      </Stack>
    </RadioGroup>
  );
};

export default TrueFalse;
