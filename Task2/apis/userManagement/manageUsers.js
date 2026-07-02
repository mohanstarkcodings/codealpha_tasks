const express = require("express");
const { queryDatabase } = require("../../db.js");
const { authMiddleware, adminOnly } = require("../../auth/authorisation.js");
const bcrypt = require("bcrypt");
const router = express.Router();

//Create User Accounts
router.post("/user", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const allowedRoles = [
      "GeneralManager",
      "Waiter",
      "KitchenStaff",
      "InventoryManager",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const existingUser = await queryDatabase(
      `
        SELECT id
        FROM users
        WHERE email = ?
        `,
      [email],
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

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
          ?,
          'local'
        )
        `,
      [full_name, email, passwordHash, role],
    );

    res.status(201).json({
      message: "User created successfully",
      user_id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
});

//Update User
router.put("/user/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const { full_name, email, role } = req.body;

    const user = await queryDatabase(
      `
        SELECT *
        FROM users
        WHERE id = ?
        `,
      [id],
    );

    if (user.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await queryDatabase(
      `
        UPDATE users
        SET
          full_name = ?,
          email = ?,
          role = ?
        WHERE id = ?
        `,
      [full_name, email, role, id],
    );

    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update user",
    });
  }
});

//delete user
router.delete("/user/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await queryDatabase(
      `
        SELECT *
        FROM users
        WHERE id = ?
        `,
      [id],
    );

    if (user.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user[0].role === "Admin") {
      return res.status(400).json({
        message: "Admin account cannot be deleted",
      });
    }

    await queryDatabase(
      `
        DELETE FROM users
        WHERE id = ?
        `,
      [id],
    );

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete user",
    });
  }
});

module.exports = router;