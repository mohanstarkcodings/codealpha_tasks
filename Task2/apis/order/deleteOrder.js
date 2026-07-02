const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  waiterOnly,
  generalManagerOrAdminOnly,
} = require("../../auth/authorisation.js");

const router = express.Router();

// Soft Delete Order (PATCH /order/delete/:order_id)
router.patch("/delete/:id", authMiddleware, waiterOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const waiter_id = req.user.id;

    // Check order exists and belongs to this waiter
    const order = await queryDatabase(
      `
        SELECT *
        FROM orders
        WHERE order_id = ?
        AND waiter_id = ?
        AND is_deleted = FALSE
        `,
      [id, waiter_id],
    );

    if (order.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Soft delete
    await queryDatabase(
      `
        UPDATE orders
        SET is_deleted = TRUE
        WHERE order_id = ?
        `,
      [id],
    );

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete order",
    });
  }
});

//delete Order (DELETE /order/range?from=YYYY-MM-DD&to=YYYY-MM-DD)
router.delete(
  "/range",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { from, to } = req.query;

      if (!from || !to) {
        return res.status(400).json({
          message: "from and to dates are required",
        });
      }

      const result = await queryDatabase(
        `
        DELETE FROM orders
        WHERE DATE(created_at)
        BETWEEN ? AND ?
        `,
        [from, to],
      );

      res.status(200).json({
        message: "Orders deleted successfully",
        affectedRows: result.affectedRows,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete orders",
      });
    }
  },
);

module.exports = router;
