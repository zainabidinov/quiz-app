const colors = require("colors");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const dbConnect = require("./config/db");
dbConnect();
app.use(express.urlencoded({ extended: false }));

const usersRoute = require("./routes/users");

app.use("/api/users", usersRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

