const express = require("express");
const bcrypt = require("bcrypt");
const { queryDatabase } = require("../db");
const CustomError = require("../utils/CustomError.js");

const router = express.Router();

//sign up (POST /signup)
router.post("/", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check existing email
    const existingUser = await queryDatabase(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create participant account
    const result = await queryDatabase(
      `
      INSERT INTO users
(
  full_name,
  email,
  password_hash,
  role,
  provider
)
VALUES
(
  ?,
  ?,
  ?,
  'Customer',
  'local'
)
      `,
      [full_name, email, hashedPassword],
    );

    res.status(201).json({
      message: "Signup successful",
      user_id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    next(new CustomError("Signup failed", 500));
  }
});

module.exports = router;
