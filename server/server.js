const colors = require("colors");
const express = require("express");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
app.use(fileUpload());
app.use(express.json());

// cloudinary.config({
//   cloud_name: "dyb0ghwuz",
//   api_key: "859293259884789",
//   api_secret: "I7cqC9tqrrxbhD6cYsUJ_A2bvt8",
// });

const dbConnect = require("./config/db");
dbConnect();

app.use(cors(
  {
    origin: ["https://techquiz-api.onrender.com"]
  }
));

app.use(express.urlencoded({ extended: false }));

const accounts = require("./routes/users");
const exams = require("./routes/exams");

app.use("/api/account", accounts);
app.use("/api/quizzes", exams);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
