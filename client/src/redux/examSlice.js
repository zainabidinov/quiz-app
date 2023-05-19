import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exam: {
    name: "",
    numberOfQuestions: 0,
    duration: 0,
    questions: [
      {
        options: [],
        correctOption: "",
        questionName: "",
        questionType: "multipleChoice",
      },
    ],
  },
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setExam: (state, action) => {
      state.exam = action.payload;
    },
    setExamProperty: (state, action) => {
      switch (action.type) {
        case "SET_EXAM_NAME":
          state.exam.name = action.value;
          break;
        case "SET_NUMBER_OF_QUESTIONS":
          state.exam.numberOfQuestions = action.value;
          break;
        case "SET_EXAM_DURATION":
          state.exam.duration = action.value;
          break;
        default:
          return state;
      }
    },
    setQuestionProperty: (state, action) => {
      const { questionIndex } = action.payload;
      switch (action.type) {
        case "SET_OPTIONS":
          state.exam.questions[questionIndex].options = action.value;
          break;
        case "SET_CORRECT_OPTION":
          state.exam.questions[questionIndex].correctOption = action.value;
          break;
        case "SET_QUESTION_NAME":
          state.exam.questions[questionIndex].questionName = action.value;
          break;
        case "SET_QUESTION_TYPE":
          state.exam.questions[questionIndex].questionType = action.value;
          break;
        default:
          return state;
      }
    },
  },
});

export const { setExam, setExamProperty, setQuestionProperty } =
  examSlice.actions;

export default examSlice.reducer;
