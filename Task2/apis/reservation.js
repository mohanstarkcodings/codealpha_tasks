const express = require("express");
const { queryDatabase } = require("../db.js");
const {
  authMiddleware,
  customerOnly,
  customerWaiterGeneralManagerAdmin,
  WaiterGeneralManagerAdmin,
} = require("../auth/authorisation.js");

const router = express.Router();

//create reservation (POST /reservation)
router.post("/", authMiddleware, customerOnly, async (req, res) => {
  try {
    const customer_id = req.user.id;

    const { table_id, reservation_time, guest_count } = req.body;

    if (!table_id || !reservation_time || !guest_count) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const table = await queryDatabase(
      `
        SELECT *
        FROM restaurant_tables
        WHERE table_id = ?
        `,
      [table_id],
    );

    if (table.length === 0) {
      return res.status(404).json({
        message: "Table not found",
      });
    }

    if (table[0].status !== "Available") {
      return res.status(400).json({
        message: "Table is not available",
      });
    }

    if (guest_count > table[0].capacity) {
      return res.status(400).json({
        message: "Guest count exceeds table capacity",
      });
    }

    const result = await queryDatabase(
      `
        INSERT INTO reservations
        (
          customer_id,
          table_id,
          reservation_time,
          guest_count
        )
        VALUES
        (
          ?,
          ?,
          ?,
          ?
        )
        `,
      [customer_id, table_id, reservation_time, guest_count],
    );

    await queryDatabase(
      `
        UPDATE restaurant_tables
        SET status = 'Reserved'
        WHERE table_id = ?
        `,
      [table_id],
    );

    res.status(201).json({
      message: "Reservation created successfully",
      reservation_id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create reservation",
    });
  }
});

//View Own Reservations (GET /reservation/my)
router.get("/my", authMiddleware, customerOnly, async (req, res) => {
  try {
    const customer_id = req.user.id;

    const reservations = await queryDatabase(
      `
        SELECT
          r.reservation_id,
          rt.table_number,
          rt.capacity,
          r.reservation_time,
          r.guest_count,
          r.status
        FROM reservations r
        JOIN restaurant_tables rt
        ON r.table_id = rt.table_id
        WHERE r.customer_id = ?
        ORDER BY r.reservation_time DESC
        `,
      [customer_id],
    );

    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch reservations",
    });
  }
});

//Cancel Reservation (PATCH /reservation/cancel/reservation_id)
router.patch("/cancel/:id", authMiddleware, customerOnly, async (req, res) => {
  try {
    const reservation_id = req.params.id;
    const customer_id = req.user.id;

    const reservation = await queryDatabase(
      `
        SELECT *
        FROM reservations
        WHERE reservation_id = ?
        `,
      [reservation_id],
    );

    if (reservation.length === 0) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    if (reservation[0].customer_id !== customer_id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (reservation[0].status === "Cancelled") {
      return res.status(400).json({
        message: "Reservation already cancelled",
      });
    }

    await queryDatabase(
      `
        UPDATE reservations
        SET status = 'Cancelled'
        WHERE reservation_id = ?
        `,
      [reservation_id],
    );

    await queryDatabase(
      `
        UPDATE restaurant_tables
        SET status = 'Available'
        WHERE table_id = ?
        `,
      [reservation[0].table_id],
    );

    res.status(200).json({
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to cancel reservation",
    });
  }
});

//View All Reservations (GET /reservation)
router.get("/", authMiddleware, WaiterGeneralManagerAdmin, async (req, res) => {
  try {
    const reservations = await queryDatabase(
      `
        SELECT
          r.reservation_id,
          u.full_name,
          u.email,
          rt.table_number,
          rt.capacity,
          r.reservation_time,
          r.guest_count,
          r.status
        FROM reservations r
        JOIN users u
        ON r.customer_id = u.id
        JOIN restaurant_tables rt
        ON r.table_id = rt.table_id
        ORDER BY r.reservation_time DESC
        `,
    );

    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch reservations",
    });
  }
});

module.exports = router;