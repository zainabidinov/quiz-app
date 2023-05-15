const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    numberOfQuestions: {
      type: Number,
      required: true,
    },
    gradeToPass: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    questions: [
      {
        answers: {
          type: [String],
          required: true,
        },
        correctAnswer: {
          type: String,
          required: true,
        },
        questionName: {
          type: String,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
        questionType: {
          type: String,
          enum: ["multipleChoice", "trueFalse"],
          default: "multipleChoice",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;
