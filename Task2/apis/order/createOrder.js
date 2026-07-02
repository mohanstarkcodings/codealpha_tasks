const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  waiterOnly,
} = require("../../auth/authorisation.js");
const CustomError = require("../../utils/CustomError.js");
const router = express.Router();

//create Orders (POST /order)
router.post("/", authMiddleware, waiterOnly, async (req, res) => {
  try {
    const waiter_id = req.user.id;

    const { customer_id, table_id, items } = req.body;

    if (!table_id || !items || items.length === 0) {
      return res.status(400).json({
        message: "table_id and items are required",
      });
    }

    // Check table
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

    if (customer_id) {
      const customer = await queryDatabase(
        `
    SELECT *
    FROM users
    WHERE id = ?
    AND role = 'Customer'
    `,
        [customer_id],
      );

      if (customer.length === 0) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
    }
    
    // Create order
    const orderResult = await queryDatabase(
      `
      INSERT INTO orders
      (
        customer_id,
        waiter_id,
        table_id
      )
      VALUES (?, ?, ?)
      `,
      [customer_id || null, waiter_id, table_id],
    );

    const order_id = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      const menuItem = await queryDatabase(
        `
        SELECT *
        FROM menu_items
        WHERE item_id = ?
        `,
        [item.item_id],
      );

      if (menuItem.length === 0) {
        continue;
      }

      await queryDatabase(
        `
        INSERT INTO order_items
        (
          order_id,
          item_id,
          quantity,
          note
        )
        VALUES (?, ?, ?, ?)
        `,
        [order_id, item.item_id, item.quantity, item.note || null],
      );
    }

    res.status(201).json({
      message: "Order created successfully",
      order_id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
});

module.exports = router;
