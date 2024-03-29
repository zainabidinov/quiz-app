const router = require("express").Router();
const Exam = require("../models/examsModel");
const Result = require("../models/resultsModel");
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

    const examData = await Exam.find({ teacher: teacherId });

    if (examData.length > 0) {
      res.status(200).send({
        success: true,
        data: examData,
        user: req.body.userId,
      });
    } else {
      res.status(400).send({
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
    const userId = decoded.id;
    req.body.userId = decoded.id;

    const exams = await Exam.find();

    const results = await Result.find({ user: userId });

    const availableExams = exams.filter((exam) => {
      return !results.some((result) => result.exam.equals(exam._id));
    });

    if (availableExams.length > 0) {
      res.status(200).send({
        success: true,
        data: availableExams,
        user: req.body.userId,
      });
    } else {
      res.status(400).send({
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

///// exam results handling starts here

router.post("/results/createResult/:quizId", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.id;

    const { quizId } = req.params;
    const { report, score, numCorrect, numWrong, numUnanswered } = req.body;

    const exam = await Exam.findById(quizId);

    if (!exam) {
      return res.status(404).send({
        success: false,
        message: "No such exam found in the database",
      });
    }

    const resultData = new Result({
      report: report,
      score: score,
      numCorrect: numCorrect,
      numWrong: numWrong,
      numUnanswered: numUnanswered,
      examName: exam.name,
      examSubject: exam.subject,
      exam: quizId,
      user: userId,
    });

    await resultData.save();

    res.status(201).send({
      success: true,
      message: "Exam result created successfully",
    });
  } catch (error) {
    console.log("Error creating exam result:", error);
    res.status(500).send({
      success: false,
      message: "Failed to create exam result",
      error: error.message,
    });
  }
});

router.get("/results/getMyResults", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.id;

    const records = await Result.find({ user: userId });

    if (!records) {
      return res.status(404).send({
        success: false,
        message: "No such records found in the database",
      });
    }

    res.status(200).send({ success: true, data: records });
  } catch (error) {
    console.log(
      "Error has been caught while fetching student's result",
      error.message
    );
  }
});

router.get("/results/getAllExamResults", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const teacherId = decoded.id;

    const examIds = await Exam.find({ teacher: teacherId }, "_id");

    const records = await Result.find({ exam: { $in: examIds } }).populate(
      "user"
    );

    if (!records) {
      return res.status(404).send({
        success: false,
        message: "No such records found in the database",
      });
    }

    res.status(200).send({ success: true, data: records });
  } catch (error) {
    console.log(
      "Error has been caught while fetching teacher's exam results",
      error.message
    );
    res.status(500).send({ success: false, message: error.message });
  }
});

router.get("/results/getExamEvaluation/:recordId", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.userId = decoded.id;

    const { recordId } = req.params;

    const record = await Result.findById(recordId).populate("exam");

    if (!record) {
      return res
        .status(404)
        .send({ message: "No such record found in database", success: false });
    }

    res.status(200).send({ success: true, data: record });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
