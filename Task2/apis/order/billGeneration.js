const express = require("express");
const { queryDatabase } = require("../../db.js");
const { authMiddleware, waiterOnly } = require("../../auth/authorisation.js");

const router = express.Router();

//bill generation
router.get(
  "/bill/:id",
  authMiddleware,
  waiterOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

      const order = await queryDatabase(
        `
  SELECT
    o.order_id,

    COALESCE(
      c.full_name,
      'Walk-in Customer'
    ) AS customer_name,

    w.full_name AS waiter_name,

    rt.table_number,

    o.created_at

  FROM orders o

  LEFT JOIN users c
  ON o.customer_id = c.id

  JOIN users w
  ON o.waiter_id = w.id

  JOIN restaurant_tables rt
  ON o.table_id = rt.table_id

  WHERE o.order_id = ?
  `,
        [id],
      );

      const items = await queryDatabase(
        `
        SELECT
          m.name AS item_name,
          m.price,
          oi.quantity
        FROM order_items oi
        JOIN menu_items m
        ON oi.item_id = m.item_id
        WHERE oi.order_id = ?
        AND oi.status <> 'Cancelled'
        `,
        [id]
      );

      let grandTotal = 0;

      const billItems = items.map((item) => {
        const subtotal =
          Number(item.price) * item.quantity;

        grandTotal += subtotal;

        return {
          item_name: item.item_name,
          price: Number(item.price),
          quantity: item.quantity,
          subtotal,
        };
      });

      res.status(200).json({
        order_id: order[0].order_id,
        customer_name: order[0].customer_name,
        waiter_name: order[0].waiter_name,
        table_number: order[0].table_number,
        created_at: order[0].created_at,
        items: billItems,
        grand_total: grandTotal,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to generate bill",
      });
    }
  }
);

module.exports = router;
