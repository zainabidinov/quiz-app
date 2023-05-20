const router = require("express").Router();
const Exam = require("../models/examsModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/create", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.userId = decoded.id;

    const { examName, numberOfQuestions, examDuration } = req.body;
    const examData = {
      name: examName,
      numberOfQuestions: numberOfQuestions,
      duration: examDuration,
      // questions: [],
    };
    await Exam.create(examData);

    res.status(201).send({
      success: true,
      message: "Exam successfully created",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

router.get("/getQuizzes", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.userId = decoded.id;

    const examData = await Exam.find({});

    if (examData.length > 0) {
      res.status(200).send({
        message: "Exams successfully retrieved",
        success: true,
        data: examData,
        user: req.body.userId,
      });
    } else {
      res.status(500).send({
        message: "No exams found in the database",
        success: false,
      });
    }
  } catch (error) {
    res.status(501).send({ success: false });
    console.log("Exams retrieval error", error);
  }
});

router.get("/getQuiz/:quizId", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.userId = decoded.id;

    const { quizId } = req.params;

    const examData = await Exam.findById(quizId);
    if (examData) {
      res.status(200).send({
        success: true,
        message: "Exam successfully retrieved",
        data: examData,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Exam not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

router.put("/update-quiz/:quizId", async (req, res) => {
  try {
    const { name, numberOfQuestions, duration } = req.body;
    const { quizId } = req.params;

    const exam = await Exam.findById(quizId);

    if (exam) {
      exam.name = name;
      exam.numberOfQuestions = numberOfQuestions;
      exam.duration = duration;
    } else {
      return res.status(404).send({
        success: false,
        message: "No such exam in database",
      });
    }

    await exam.save();

    res.status(200).send({
      success: true,
      message: "Exam successfully updated",
      data: exam,
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
});

module.exports = router;
