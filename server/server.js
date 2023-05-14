const colors = require("colors");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(express.json());
const dbConnect = require("./config/db");
dbConnect();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.urlencoded({ extended: false }));

const usersRoute = require("./routes/users");

app.use("/api/users", usersRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
