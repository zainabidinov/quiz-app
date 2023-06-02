const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    report: {
      type: Object,
      default: null,
    },
    score: {
      type: Number,
      required: true,
    },
    numCorrect: {
      type: Number,
      required: true,
    },
    numWrong: {
      type: Number,
      required: true,
    },
    numUnanswered: {
      type: Number,
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;
