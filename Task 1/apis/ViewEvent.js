const express = require("express");
const { queryDatabase } = require("../db.js");
const authenticateMW = require("../middleware/authenticate.js");
const { participantOnly } = require("../middleware/authorize.js");

const router = express.Router();

// View All Events (GET /events?page=1&limit=10)
router.get("/", authenticateMW, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    // Total Records
    const totalResult = await queryDatabase(
      "SELECT COUNT(*) AS total FROM events",
    );

    const totalRecords = totalResult[0].total;

    // Paginated Data 
    const sql = `
      SELECT
        id,
        title,
        description
      FROM events
      ORDER BY id ASC
      LIMIT ?
      OFFSET ?
    `;

    const events = await queryDatabase(sql, [limit, offset]);

    res.status(200).json({
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      data: events,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch events",
    });
  }
});

/* GET /events/search?keyword=node
   GET /events/search?keyword=workshop */
router.get("/search", authenticateMW, async (req, res) => {
  try {
    const { keyword } = req.query;

    const sql = `
      SELECT *
      FROM events
      WHERE title LIKE ?
      OR description LIKE ?
      ORDER BY event_date ASC
    `;

    const searchKeyword = `%${keyword}%`;

    const events = await queryDatabase(sql, [searchKeyword, searchKeyword]);

    res.status(200).json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Search failed",
    });
  }
});

/* GET /events/filter?category=CSE
   GET /events/filter?category=ECE
   GET /events/filter?category=MECH */
router.get("/filter", authenticateMW, async (req, res) => {
  try {
    const { category } = req.query;

    const sql = `
      SELECT *
      FROM events
      WHERE department = ?
      ORDER BY event_date ASC
    `;

    const events = await queryDatabase(sql, [category]);

    res.status(200).json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Filter failed",
    });
  }
});

// View Event Details (GET /events/:eventId)
router.get(
  "/:eventId",
  authenticateMW,
  async (req, res) => {
    try {
      const { eventId } = req.params;

      const sql = `
      SELECT
        id,
        title,
        description,
        event_date,
        event_time,
        venue,
        capacity
      FROM events
      WHERE id = ?
    `;

      const event = await queryDatabase(sql, [eventId]);

      if (event.length === 0) {
        return res.status(404).json({
          message: "Event not found",
        });
      }

      res.status(200).json(event[0]);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch event details",
      });
    }
  },
);

module.exports = router;