const router = require("express").Router();
const Exam = require("../models/examsModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/create", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    teacherId = decoded.id;

    const { subject, examName, numberOfQuestions, examDuration } = req.body;
    const examData = {
      subject: subject,
      name: examName,
      numberOfQuestions: numberOfQuestions,
      duration: examDuration,
      teacher: teacherId,
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
    teacherId = decoded.id;
    req.body.userId = decoded.id;

    const examData = await Exam.find({teacher: teacherId});

    if (examData.length > 0) {
      res.status(200).send({
        message: "Exams successfully retrieved",
        success: true,
        data: examData,
        user: req.body.userId,
      });
    } else {
      res.status(400).send({
        message: "No exams found in the database",
        success: false,
      });
    }
  } catch (error) {
    res.status(501).send({ success: false });
  }
});

router.get("/getStudentQuizzes", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.userId = decoded.id;

    const examData = await Exam.find();

    if (examData.length > 0) {
      res.status(200).send({
        message: "Exams successfully retrieved",
        success: true,
        data: examData,
        user: req.body.userId,
      });
    } else {
      res.status(400).send({
        message: "No exams found in the database",
        success: false,
      });
    }
  } catch (error) {
    res.status(501).send({ success: false });
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
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.userId = decoded.id;

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
        message: "No such exam found in database",
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

router.delete("/deleteQuiz/:quizId", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.userId = decoded.id;

    const { quizId } = req.params;

    let exam = await Exam.findById(quizId);

    if (!exam) {
      return res.status(404).send({
        success: false,
        message: "No such exam found in the database",
      });
    }

    exam = await Exam.deleteOne({ _id: quizId });

    res.status(200).send({
      success: true,
      message: "Exam has been deleted",
      data: exam,
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
});

router.post("/add-question/:quizId", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.userId = decoded.id;

    const { quizId } = req.params;

    const exam = await Exam.findById(quizId);
    if (!exam) {
      return res
        .status(404)
        .send({ success: false, message: "No such exam found in database" });
    }

    const { questionName, questionType, correctOption, options } = req.body;

    const newQuestion = {
      questionName: questionName,
      questionType: questionType,
      correctOption: correctOption,
      options: options,
    };

    exam.questions.push(newQuestion);

    await exam.save();

    res.status(200).send({
      success: true,
      message: "Question successfully added",
      data: exam,
    });
  } catch (error) {}
});

router.delete("/delete-question/:quizId/:questionId", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.userId = decoded.id;

    const { quizId, questionId } = req.params;

    const exam = await Exam.findById(quizId);

    if (!exam) {
      return res.status(404).send({
        success: false,
        message: "No such exam found in the database",
      });
    }

    const questionIndex = exam.questions.findIndex(
      (question) => question._id.toString() === questionId
    );

    if (questionIndex === -1) {
      return res.status(404).send({
        success: false,
        message: "No such question found in the database",
      });
    }

    exam.questions.splice(questionIndex, 1);

    await exam.save();

    res.status(200).send({
      success: true,
      message: "Question has been deleted",
      data: exam,
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
});

module.exports = router;
