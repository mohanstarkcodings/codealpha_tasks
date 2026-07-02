const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  waiterOnly,
} = require("../../auth/authorisation.js");
const router = express.Router();

//Cancel Ordered item (PATCH /order/orderItemsCancel/:order_item_id)
router.patch(
  "/orderItemsCancel/:id",
  authMiddleware,
  waiterOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

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
        SET status = 'Cancelled'
        WHERE order_item_id = ?
        `,
        [id],
      );

      res.status(200).json({
        message: "Order item cancelled successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to cancel order item",
      });
    }
  },
);

module.exports = router;
