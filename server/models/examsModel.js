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
    duration: {
      type: Number,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    questions: [
      {
        options: {
          type: [String],
          required: true,
        },
        correctOption: {
          type: String,
          required: true,
        },
        questionName: {
          type: String,
          required: true,
        },
        questionType: {
          type: String,
          enum: ["multipleChoice", "trueFalse", "fillBlank"],
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
