const express = require("express");
const { queryDatabase } = require("../../db.js");
const authenticateMW = require("../../middleware/authenticate.js");
const {OrganizerOrAdmin} = require("../../middleware/authorize.js");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Create Event (POST /organiser/eventmanagement)
router.post("/", authenticateMW , OrganizerOrAdmin, async (req, res) => {
  try {
    const { title, description,department, event_date, event_time, venue, capacity } =
      req.body;

    const organizer_id = req.user.id;

    const sql = `
      INSERT INTO events
      (
        title,
        description,
        department,
        event_date,
        event_time,
        venue,
        capacity,
        organizer_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await queryDatabase(sql, [
      title,
      description,
      department,
      event_date,
      event_time,
      venue,
      capacity,
      organizer_id,
    ]);

    res.status(201).json({
      message: "Event created successfully",
      event_id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create event",
    });
  }
});

// Update Event (PUT /organiser/eventmanagement/:eventId)
router.put("/:eventId", authenticateMW, OrganizerOrAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;

    const { title, description, department, event_date, event_time, venue, capacity } =
      req.body;

    const sql = `
      UPDATE events
      SET
        title = ?,
        description = ?,
        department = ?,
        event_date = ?,
        event_time = ?,
        venue = ?,
        capacity = ?
      WHERE id = ?
    `;

    const result = await queryDatabase(sql, [
      title,
      description,
      department,
      event_date,
      event_time,
      venue,
      capacity,
      eventId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json({
      message: "Event updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update event",
    });
  }
});

// Delete Event (DELETE /organiser/eventmanagement/:eventId)
router.delete(
  "/:eventId",
  authenticateMW,
  OrganizerOrAdmin,
  async (req, res) => {
    try {
      const { eventId } = req.params;

      const sql = `
      DELETE FROM events
      WHERE id = ?
    `;

      const result = await queryDatabase(sql, [eventId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Event not found",
        });
      }

      res.status(200).json({
        message: "Event deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete event",
      });
    }
  },
);

//view of all created events of particular organiser (GET /organiser/eventmanagement/myevents)
router.get("/myevents", authenticateMW, OrganizerOrAdmin, async (req, res) => {
  try {
    const organizer_id = req.user.id;

    const sql = `
        SELECT
          id,
          title,
          event_date,
          venue,
          capacity
        FROM events
        WHERE organizer_id = ?
        ORDER BY event_date ASC
      `;

    const events = await queryDatabase(sql, [organizer_id]);

    res.status(200).json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch events",
    });
  }
});

module.exports = router;