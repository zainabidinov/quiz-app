const router = require("express").Router();
const User = require("../models/usersModel");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).send({
        message: "This email address is already registered.",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.send({ message: "Invalid email address.", success: false });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.send({
        message: "Entered password is invalid",
        success: false,
      });
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

router.get("/accountInfo", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.uId = decoded.id;

    const user = await User.findById(req.body.uId);

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

router.get("/getUsers", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.uId = decoded.id;

    const users = await User.find();

    if (users.length > 0) {
      res.status(200).send({
        success: true,
        data: users,
      });
    } else {
      res.status(404).send({
        message: "No users found in the database",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      data: error,
      success: false,
    });
  }
});

router.post("/uploadProfilePic", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    const file = req.files.profilePic;
    if (!file) {
      return res.status(400).send({
        message: "No profile picture file provided",
        success: false,
      });
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "user-pictures",
    });

    user.profilePic = result.secure_url;
    await user.save();

    res.status(200).send({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).send({
      message: "Profile picture upload failed",
      success: false,
    });
  }
});

module.exports = router;

module.exports = router;
