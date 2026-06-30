const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { queryDatabase } = require("../db.js");
const CustomError = require("../utils/CustomError");

const router = express.Router();

// login (POST /login)
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await queryDatabase("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const user = users[0];
    
    if (user.provider === "google") {
      return res.status(400).json({
        message: "Please login using Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    next(new CustomError("Login failed", 500));
  }
});

module.exports = router;