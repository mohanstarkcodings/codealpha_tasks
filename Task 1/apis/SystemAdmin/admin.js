const express = require("express");
const authenticateMW = require("../../middleware/authenticate.js");
const {adminOnly} = require("../../middleware/authorize.js");
const { queryDatabase } = require("../../db.js");
const bcrypt = require("bcrypt");

const router = express.Router();

// Create Organizer (POST /systemadmin/organisers)
router.post("/organisers", authenticateMW, adminOnly, async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (full_name, email, password, role)
      VALUES (?, ?, ?, 'organizer')
    `;

    const result = await queryDatabase(sql, [full_name, email, hashedPassword]);

    res.status(201).json({
      message: "Organizer created successfully",
      organiser_id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create organizer",
    });
  }
});

// View All Organizers (GET /systemadmin/organisers)
router.get("/organisers", authenticateMW, adminOnly, async (req, res) => {
  try {
    const sql = `
      SELECT
        id,
        full_name,
        email,
        created_at
      FROM users
      WHERE role = 'organizer'
      ORDER BY id ASC
    `;

    const organisers = await queryDatabase(sql);

    res.status(200).json(organisers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch organizers",
    });
  }
});

// Update Organizer (PUT /systemadmin/organisers/:organiserId)
router.put(
  "/organisers/:organiserId",
  authenticateMW,
  adminOnly,
  async (req, res) => {
    try {
      const { organiserId } = req.params;
      const { full_name, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = `
      UPDATE users
      SET
        full_name = ?,
        email = ?,
        password = ?
      WHERE id = ?
      AND role = 'organizer'
    `;

      const result = await queryDatabase(sql, [
        full_name,
        email,
        hashedPassword,
        organiserId,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Organizer not found",
        });
      }

      res.status(200).json({
        message: "Organizer updated successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update organizer",
      });
    }
  },
);

//Delete Organizer (DELETE /systemadmin/organisers/:organiserId)
router.delete(
  "/organisers/:organiserId",
  authenticateMW,
  adminOnly,
  async (req, res) => {
    try {
      const { organiserId } = req.params;

      const sql = `
      DELETE FROM users
      WHERE id = ?
      AND role = 'organizer'
    `;

      const result = await queryDatabase(sql, [organiserId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Organizer not found",
        });
      }

      res.status(200).json({
        message: "Organizer deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Cannot delete organizer. The organizer still manages events."
      });
    }
  },
);

module.exports = router;
