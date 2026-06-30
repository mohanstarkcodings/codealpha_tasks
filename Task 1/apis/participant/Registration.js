const express = require("express");
const { queryDatabase } = require("../../db.js");
const authenticateMW = require("../../middleware/authenticate.js");
const {participantOnly}= require("../../middleware/authorize.js");

const router = express.Router();

// Register For Event (POST /participant/registration)
router.post("/", authenticateMW, participantOnly, async (req, res) => {
  try {
    const participant_id = req.user.id;

    const {
      event_id,
      phone,
      department,
      year_of_study,
    } = req.body;

    // Insert registration
    const registrationSql = `
      INSERT INTO registrations
      (participant_id, event_id)
      VALUES (?, ?)
    `;

    const registrationResult = await queryDatabase(
      registrationSql,
      [participant_id, event_id]
    );

    const registration_id = registrationResult.insertId;

    // Insert registration form
    const formSql = `
      INSERT INTO registration_forms
      (
        registration_id,
        phone,
        department,
        year_of_study
      )
      VALUES (?, ?, ?, ?)
    `;

    await queryDatabase(formSql, [
      registration_id,
      phone,
      department,
      year_of_study,
    ]);

    res.status(201).json({
      message: "Registration successful",
      registration_id,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});

// View My Registrations (GET /participant/registration/my)
router.get("/my", authenticateMW, participantOnly, async (req, res) => {
  try {
    const participant_id = req.user.id;

    const sql = `
      SELECT
        r.id AS registration_id,
        e.id AS event_id,
        e.title,
        e.description,
        e.event_date,
        e.event_time,
        e.venue,
        e.capacity,
        r.status
      FROM registrations r
      INNER JOIN events e
      ON r.event_id = e.id
      WHERE r.participant_id = ?
      ORDER BY r.id ASC
    `;

    const registrations = await queryDatabase(sql, [participant_id]);

    res.status(200).json(registrations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch registrations",
    });
  }
});

// Cancel Registration (DELETE /participant/registration/:registrationId)
router.delete(
  "/:registrationId",
  authenticateMW,
  participantOnly,
  async (req, res) => {
    try {
      const { registrationId } = req.params;

      const sql = `UPDATE registrations SET status = 'cancelled' WHERE id = ?`;

      const result = await queryDatabase(sql, [registrationId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Registration not found",
        });
      }

      res.status(200).json({
        message: "Registration cancelled",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Cancellation failed",
      });
    }
  },
);

module.exports = router;