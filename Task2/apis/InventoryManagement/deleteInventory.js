const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  inventoryManagerOnly,
} = require("../../auth/authorisation.js");

const router = express.Router();

//delete existing category (DELETE /inventory/category/:category_id)
router.delete(
  "/category/:id",
  authMiddleware,
  inventoryManagerOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

      const category = await queryDatabase(
        `
        SELECT *
        FROM inventory_categories
        WHERE inventory_category_id = ?
        `,
        [id],
      );

      if (category.length === 0) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      const stocks = await queryDatabase(
        `
        SELECT *
        FROM inventory
        WHERE inventory_category_id = ?
        `,
        [id],
      );

      if (stocks.length > 0) {
        return res.status(400).json({
          message: "Cannot delete category. stocks are associated with it.",
        });
      }

      await queryDatabase(
        `
        DELETE FROM inventory_categories
        WHERE inventory_category_id = ?
        `,
        [id],
      );

      res.status(200).json({
        message: "Inventory category deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete inventory category",
      });
    }
  },
);

//Delete existing Stock (DELETE /inventory/stock/:stock_id)
router.delete(
  "/stock/:id",
  authMiddleware,
  inventoryManagerOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

      const stock = await queryDatabase(
        `
        SELECT *
        FROM inventory
        WHERE inventory_id = ?
        `,
        [id],
      );

      if (stock.length === 0) {
        return res.status(404).json({
          message: "Stock item not found",
        });
      }

      await queryDatabase(
        `
        DELETE FROM inventory
        WHERE inventory_id = ?
        `,
        [id],
      );

      res.status(200).json({
        message: "Stock deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete stock",
      });
    }
  },
);

module.exports = router;