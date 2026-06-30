const express = require("express");
const { queryDatabase } = require("../../db.js");
const authenticateMW = require("../../middleware/authenticate.js");
const { OrganizerOrAdmin } = require("../../middleware/authorize.js");

const router = express.Router();

// View Participants Of Event (GET /organiser/registrationmonitor/:eventId/participants?page=1&limit=10)
router.get(
  "/:eventId/participants",
  authenticateMW,
  OrganizerOrAdmin,
  async (req, res) => {
    try {
      const { eventId } = req.params;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const sql = `
        SELECT
          u.id AS participant_id,
          u.full_name,
          u.email,
          rf.phone,
          rf.department,
          rf.year_of_study
        FROM registrations r
        INNER JOIN users u
          ON r.participant_id = u.id
        INNER JOIN registration_forms rf
          ON r.id = rf.registration_id
        WHERE r.event_id = ?
        AND r.status = 'registered'
        ORDER BY u.full_name ASC
        LIMIT ? OFFSET ?
      `;

      const participants = await queryDatabase(sql, [
        Number(eventId),
        Number(limit),
        Number(offset),
      ]);

      res.status(200).json({
        page,
        limit,
        total_records: participants.length,
        data: participants,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch participants",
      });
    }
  }
);

// View Registration Count (GET /organiser/registrationmonitor/:eventId/count)
router.get(
  "/:eventId/count",
  authenticateMW,
  OrganizerOrAdmin,
  async (req, res) => {
    try {
      const { eventId } = req.params;

      const sql = `
      SELECT
        COUNT(*) AS total_registrations
      FROM registrations
      WHERE event_id = ?
      AND status = 'registered'
    `;

      const result = await queryDatabase(sql, [eventId]);

      res.status(200).json({
        event_id: Number(eventId),
        total_registrations: result[0].total_registrations,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch registration count",
      });
    }
  },
);

module.exports = router;
