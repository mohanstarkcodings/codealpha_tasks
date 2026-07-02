const express = require("express");
const { queryDatabase } = require("../db.js");
const {
  authMiddleware,
  generalManagerOrAdminOnly,
} = require("../auth/authorisation.js");

const router = express.Router();

// GET /inventoryReport/inventory/categories
router.get(
  "/inventory/categories",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      // Get all categories
      const categories = await queryDatabase(`
        SELECT
          inventory_category_id,
          category_name
        FROM inventory_categories
        ORDER BY category_name ASC
      `);

      const report = [];

      for (const category of categories) {
        // Get all items for this category
        const items = await queryDatabase(
          `
          SELECT
            inventory_id,
            ingredient_name,
            quantity,
            unit
          FROM inventory
          WHERE inventory_category_id = ?
          ORDER BY ingredient_name ASC
          `,
          [category.inventory_category_id]
        );

        report.push({
          inventory_category_id: category.inventory_category_id,
          category_name: category.category_name,
          total_items: items.length,
          items,
        });
      }

      res.status(200).json(report);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to generate inventory category report",
      });
    }
  }
);

//GET /inventoryReport/inventory/top-category
router.get(
  "/inventory/top-category",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const categoryResult = await queryDatabase(`
        SELECT
          ic.inventory_category_id,
          ic.category_name,
          SUM(i.quantity) AS total_stock
        FROM inventory_categories ic
        JOIN inventory i
          ON ic.inventory_category_id = i.inventory_category_id
        GROUP BY
          ic.inventory_category_id,
          ic.category_name
        ORDER BY total_stock DESC
        LIMIT 1
      `);

      if (categoryResult.length === 0) {
        return res.status(404).json({
          message: "No inventory data found",
        });
      }

      const category = categoryResult[0];

      const items = await queryDatabase(
        `
        SELECT
          inventory_id,
          ingredient_name,
          quantity,
          unit
        FROM inventory
        WHERE inventory_category_id = ?
        ORDER BY quantity DESC
        `,
        [category.inventory_category_id],
      );

      res.status(200).json({
        inventory_category_id: category.inventory_category_id,

        category_name: category.category_name,

        total_stock: category.total_stock,

        total_items: items.length,

        items,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to generate top category report",
      });
    }
  },
);

//GET /inventoryReport/inventory/low-stock
http: router.get(
  "/inventory/low-stock",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const lowStockItems = await queryDatabase(`
        SELECT
          inventory_id,
          ingredient_name,
          quantity,
          unit
        FROM inventory
        WHERE quantity < 10
        ORDER BY quantity ASC
      `);

      res.status(200).json({
        total_low_stock_items: lowStockItems.length,
        items: lowStockItems,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to generate low stock report",
      });
    }
  },
);

module.exports = router;
