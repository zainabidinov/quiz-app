import React from "react";
import MultipleChoice from "./MultipleChoice";
import TrueFalse from "./TrueFalse";
import FillBlank from "./FillBlank";

const Question = ({ question }) => {
  return (
    <div>
      <h3>{question.questionName}</h3>
      {question.questionType === "multipleChoice" && (
        <MultipleChoice options={question.options} />
      )}
      {question.questionType === "trueFalse" && <TrueFalse />}
      {question.questionType === "fillBlank" && <FillBlank />}
    </div>
  );
};

export default Question;
