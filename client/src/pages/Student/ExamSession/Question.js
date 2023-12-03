import React from "react";
import MultipleChoice from "./MultipleChoice";
import TrueFalse from "./TrueFalse";
import FillBlank from "./FillBlank";

const Question = ({
  question,
  handleUserAnswers,
  selectedAnswer,
  chosenData,
}) => {
  return (
    <div>
      {question.questionType === "multipleChoice" && (
        <MultipleChoice
          options={question.options}
          handleUserAnswers={(answer) =>
            handleUserAnswers(question._id, answer)
          }
          selectedAnswer={selectedAnswer}
        />
      )}
      {question.questionType === "trueFalse" && (
        <TrueFalse
          handleUserAnswers={(answer) =>
            handleUserAnswers(question._id, answer)
          }
          selectedAnswer={selectedAnswer}
          question={question}
          chosenData={chosenData}
        />
      )}
      {question.questionType === "fillBlank" && (
        <FillBlank
          handleUserAnswers={(answer) =>
            handleUserAnswers(question._id, answer)
          }
          selectedAnswer={selectedAnswer}
          question={question}
          chosenData={chosenData}
        />
      )}
    </div>
  );
};

export default Question;
