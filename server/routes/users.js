const router = require("express").Router();
const User = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generates JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

// creating a user
router.post("/register", async (req, res) => {
  try {
    // Check if user exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).send({
        message: "This email address is already registered.",
        //  Please sign in or use a different email address to continue,
        success: false,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // Create a new user
    const newU = new User(req.body);
    await newU.save();
    res.send({
      message: "You've successfuly created an account!",
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

// verifying and signing user in
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if given email exists in the database
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.send({ message: "Email does not exist", success: false });
    }

    // check if password is correct
    if (!(await bcrypt.compare(password, user.password))) {
      return res.send({ message: "Password is incorrect", success: false });
    }

    const token = generateToken(user._id);

    res.send({
      message: "Login successful!",
      success: true,
      data: token,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// getting user info
router.get("/accountInfo", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const id = decoded.id;

    const user = await User.findById(id);

    if (user) {
      res.status(200).send({
        success: true,
        data: user,
      });
    } else {
      res.status(404).send({
        message: "User not found",
        success: false,
      });
    }
  } catch (error) {
    res.status(401).send({
      data: error,
      success: false,
    });
  }
});

module.exports = router;
