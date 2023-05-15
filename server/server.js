const colors = require("colors");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(express.json());
const dbConnect = require("./config/db");
dbConnect();

app.use(cors());
app.use(express.urlencoded({ extended: false }));

const users = require("./routes/users");
const exams = require("./routes/exams");

app.use("/api/users", users);
app.use("/", exams);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
