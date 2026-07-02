const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  waiterOnly,
  kitchenStaffOnly,
  generalManagerOrAdminOnly,WaiterKitchenStaffGeneralManagerAdmin,
} = require("../../auth/authorisation.js");

const router = express.Router();

//update order item status [kitchen staff can update status[preparing/ready] (PATCH /order/kitchenStaffStatus/:order_item_id)
router.patch(
  "/kitchenStaffStatus/:id",
  authMiddleware,
  kitchenStaffOnly,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = ["Preparing", "Ready"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Kitchen staff can only set Preparing or Ready",
        });
      }

      const orderItem = await queryDatabase(
        `
        SELECT *
        FROM order_items
        WHERE order_item_id = ?
        `,
        [id],
      );

      if (orderItem.length === 0) {
        return res.status(404).json({
          message: "Order item not found",
        });
      }

      await queryDatabase(
        `
        UPDATE order_items
        SET status = ?
        WHERE order_item_id = ?
        `,
        [status, id],
      );

      res.status(200).json({
        message: "Order item status updated successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update order item status",
      });
    }
  },
);

//update order item status[served/cancelled] (PATCH /order/waiterStatus/:order_item_id)
router.patch(
  "/waiterStatus/:id",
  authMiddleware,
  waiterOnly,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = ["Served", "Cancelled"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Waiter can only set Served or Cancelled",
        });
      }

      const orderItem = await queryDatabase(
        `
        SELECT *
        FROM order_items
        WHERE order_item_id = ?
        `,
        [id],
      );

      if (orderItem.length === 0) {
        return res.status(404).json({
          message: "Order item not found",
        });
      }

      await queryDatabase(
        `
        UPDATE order_items
        SET status = ?
        WHERE order_item_id = ?
        `,
        [status, id],
      );

      res.status(200).json({
        message: `Order item marked as ${status}`,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update order item status",
      });
    }
  },
);

//update Orders (waiter can update[item,quantity,note,table id])  (PUT /order/order_id)
router.put("/:id", authMiddleware, waiterOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const { item_id, quantity, note, table_id } = req.body;

    if (!item_id || !quantity || !table_id) {
      return res.status(400).json({
        message: "item_id, quantity and table_id are required",
      });
    }

    // Check order item
    const orderItem = await queryDatabase(
      `
        SELECT *
        FROM order_items
        WHERE order_item_id = ?
        `,
      [id],
    );

    if (orderItem.length === 0) {
      return res.status(404).json({
        message: "Order item not found",
      });
    }

    // Check menu item
    const menuItem = await queryDatabase(
      `
        SELECT *
        FROM menu_items
        WHERE item_id = ?
        `,
      [item_id],
    );

    if (menuItem.length === 0) {
      return res.status(404).json({
        message: "Menu item not found",
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

    // Update order item
    await queryDatabase(
      `
        UPDATE order_items
        SET
          item_id = ?,
          quantity = ?,
          note = ?
        WHERE order_item_id = ?
        `,
      [item_id, quantity, note || null, id],
    );

    // Update table in orders table
    await queryDatabase(
      `
        UPDATE orders
        SET table_id = ?
        WHERE order_id = ?
        `,
      [table_id, orderItem[0].order_id],
    );

    res.status(200).json({
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update order",
    });
  }
});

module.exports=router;