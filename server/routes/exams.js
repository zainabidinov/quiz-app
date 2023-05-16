const router = require("express").Router();
const Exam = require("../models/examsModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/create", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.uId = decoded.id;

    const examData = req.body;
    await Exam.create(examData);

    res.status(201).send({
      message: "Exam successfully created",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

router.get("/getQuizzes", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.uId = decoded.id;

    const examData = await Exam.find();

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
