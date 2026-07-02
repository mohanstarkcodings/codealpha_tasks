const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  waiterOnly,
  WaiterKitchenStaffGeneralManagerAdmin,
  kitchenStaffOnly,
} = require("../../auth/authorisation.js");

const router = express.Router();

//View waiter Own Orders (GET /order/showOrders/my)
router.get("/showOrders/my", authMiddleware, waiterOnly, async (req, res) => {
  try {
    const waiter_id = req.user.id;

    const orders = await queryDatabase(
      `
  SELECT
    o.order_id,

    c.full_name AS customer_name,

    rt.table_number,

    o.created_at

  FROM orders o

  LEFT JOIN users c
  ON o.customer_id = c.id

  JOIN restaurant_tables rt
  ON o.table_id = rt.table_id

  WHERE o.waiter_id = ?
  AND o.is_deleted = FALSE

  ORDER BY o.order_id DESC
  `,
      [waiter_id],
    );

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch your orders",
    });
  }
});

//Show all Orders (GET /order/showOrders)
router.get(
  "/showOrders",
  authMiddleware,
  WaiterKitchenStaffGeneralManagerAdmin,
  async (req, res) => {
    try {
      const orders = await queryDatabase(
        `
        SELECT
  o.order_id,

  c.full_name AS customer_name,

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

WHERE o.is_deleted = FALSE

ORDER BY o.order_id DESC
        `,
      );

      res.status(200).json(orders);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch orders",
      });
    }
  },
);

//Show Ordered items for a specific order (GET /order/showOrders/items/order_id)
router.get(
  "/showOrders/items/:id",
  authMiddleware,
  WaiterKitchenStaffGeneralManagerAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const order = await queryDatabase(
        `
  SELECT *
  FROM orders
  WHERE order_id = ?
  AND is_deleted = FALSE
  `,
        [id],
      );

      if (order.length === 0) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      const orderItems = await queryDatabase(
        `
  SELECT
    oi.order_item_id,
    m.name AS item_name,
    m.price,
    oi.quantity,
    oi.status,
    oi.note
  FROM order_items oi
  JOIN menu_items m
  ON oi.item_id = m.item_id
  WHERE oi.order_id = ?
  ORDER BY oi.order_item_id ASC
  `,
        [id],
      );

      res.status(200).json({
        order_id: Number(id),
        total_items: orderItems.length,
        items: orderItems,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch order items",
      });
    }
  },
);

//KOT(Kitchen Order Ticket)
router.get("/kot", authMiddleware, kitchenStaffOnly, async (req, res) => {
  try {
    const orders = await queryDatabase(
      `
        SELECT
  o.order_id,
  w.full_name AS waiter_name,
  rt.table_number,
  o.created_at
FROM orders o
JOIN users w
  ON o.waiter_id = w.id
JOIN restaurant_tables rt
  ON o.table_id = rt.table_id
WHERE o.is_deleted = FALSE
ORDER BY o.created_at DESC
        `,
    );

    const kotData = [];

    for (const order of orders) {
      const items = await queryDatabase(
        `
          SELECT
            m.name AS item_name,
            oi.quantity,
            oi.status
          FROM order_items oi
          JOIN menu_items m
            ON oi.item_id = m.item_id
          WHERE oi.order_id = ?
          ORDER BY oi.order_item_id ASC
          `,
        [order.order_id],
      );

      kotData.push({
        order_id: order.order_id,
        waiter_name: order.waiter_name,
        table_number: order.table_number,
        created_at: order.created_at,
        items,
      });
    }

    res.status(200).json(kotData);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch KOT data",
    });
  }
});

//show orders based on table number (GET /order/showOrders/filter?table_number=)
http: router.get(
  "/showOrders/filter",
  authMiddleware,
  WaiterKitchenStaffGeneralManagerAdmin,
  async (req, res) => {
    try {
      const { table_number } = req.query;

      if (!table_number) {
        return res.status(400).json({
          message: "table_number is required",
        });
      }

      const orders = await queryDatabase(
        `
        SELECT
          o.order_id,

          c.full_name AS customer_name,

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

        WHERE rt.table_number = ?
        AND o.is_deleted = FALSE

        ORDER BY o.order_id DESC
        `,
        [table_number],
      );

      const result = [];

      for (const order of orders) {
        const items = await queryDatabase(
          `
          SELECT
            oi.order_item_id,
            m.name AS item_name,
            oi.quantity,
            oi.status,
            oi.note
          FROM order_items oi
          JOIN menu_items m
          ON oi.item_id = m.item_id
          WHERE oi.order_id = ?
          ORDER BY oi.order_item_id ASC
          `,
          [order.order_id],
        );

        result.push({
          order_id: order.order_id,
          customer_name: order.customer_name,
          waiter_name: order.waiter_name,
          table_number: order.table_number,
          created_at: order.created_at,
          total_items: items.length,
          items,
        });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch orders",
      });
    }
  },
);

module.exports = router;
