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
    req.body.uId = decoded.id;

    const examData = await Exam.find({});

    if (examData) {
      res.status(200).send({
        message: "Exams successfully retrieved",
        success: true,
        data: examData,
      });
    }
    {
      res
        .status(500)
        .send({ message: "No exams found in the database", success: false });
    }
  } catch (error) {
    res.status(501).send({ message: error, success: false });
  }
});

module.exports = router;
