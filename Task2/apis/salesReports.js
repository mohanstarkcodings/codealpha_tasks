const express = require("express");
const { queryDatabase } = require("../db.js");
const {
  authMiddleware,
  generalManagerOrAdminOnly,
} = require("../auth/authorisation.js");

const router = express.Router();

//1.order Report (GET /salesReport/orders?from=year-month-day&to=year-month-day)
router.get(
  "/orders",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { from, to } = req.query;

      const result = await queryDatabase(
        `
        SELECT COUNT(*) AS total_orders
        FROM orders
        WHERE DATE(created_at)
        BETWEEN ? AND ?
        `,
        [from, to],
      );

      res.status(200).json({
        from,
        to,
        total_orders: result[0].total_orders,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to generate orders report",
      });
    }
  },
);

// 2.revenue report (GET /salesReport/revenue?from=year-month-day&to=year-month-day)
router.get(
  "/revenue",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { from, to } = req.query;

      const result = await queryDatabase(
        `
        SELECT
          COALESCE(
            SUM(oi.quantity * m.price),
            0
          ) AS total_revenue
        FROM order_items oi
        JOIN orders o
          ON oi.order_id = o.order_id
        JOIN menu_items m
          ON oi.item_id = m.item_id
        WHERE DATE(o.created_at)
        BETWEEN ? AND ?
        AND oi.status <> 'Cancelled'
        `,
        [from, to],
      );

      res.status(200).json({
        from,
        to,
        total_revenue: result[0].total_revenue,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to generate revenue report",
      });
    }
  },
);

// 3.Most Sold Food Report (GET /salesReport/top-food?from=year-month-day&to=year-month-day)
router.get(
  "/top-food",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { from, to } = req.query;

      const result = await queryDatabase(
        `
        SELECT
          m.item_id,
          m.name,
          SUM(oi.quantity) AS total_sold
        FROM order_items oi
        JOIN orders o
          ON oi.order_id = o.order_id
        JOIN menu_items m
          ON oi.item_id = m.item_id
        WHERE DATE(o.created_at)
        BETWEEN ? AND ?
        AND oi.status <> 'Cancelled'
        GROUP BY m.item_id, m.name
        ORDER BY total_sold DESC
        LIMIT 1
        `,
        [from, to],
      );

      res.status(200).json(result[0] || {});
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to generate food report",
      });
    }
  },
);

//4.Top Waiter Report (GET /salesReport/top-waiter?from=year-month-day&to=year-month-day)
router.get(
  "/top-waiter",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { from, to } = req.query;

      const result = await queryDatabase(
        `
        SELECT
          u.id,
          u.full_name,
          COUNT(*) AS orders_handled
        FROM orders o
        JOIN users u
          ON o.waiter_id = u.id
        WHERE DATE(o.created_at)
        BETWEEN ? AND ?
        GROUP BY u.id, u.full_name
        ORDER BY orders_handled DESC
        LIMIT 1
        `,
        [from, to],
      );

      res.status(200).json(result[0] || {});
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to generate waiter report",
      });
    }
  },
);

module.exports = router;
