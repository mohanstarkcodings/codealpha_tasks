const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  inventoryManagerGeneralManagerAdmin,kitchenStaffOnly
} = require("../../auth/authorisation.js");

const router = express.Router();

//View inventory (GET /inventory)
router.get(
  "/",
  authMiddleware,
  inventoryManagerGeneralManagerAdmin,kitchenStaffOnly,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Total Records
      const totalResult = await queryDatabase(`
        SELECT COUNT(*) AS total
        FROM inventory
      `);

      const totalRecords = totalResult[0].total;

      const totalPages = Math.ceil(totalRecords / limit);

      // Inventory Data
      const inventory = await queryDatabase(
        `
  SELECT
    i.inventory_id,
    ic.category_name,
    i.ingredient_name,
    i.quantity,
    i.unit
  FROM inventory i
  JOIN inventory_categories ic
  ON i.inventory_category_id = ic.inventory_category_id
  ORDER BY i.inventory_id ASC
  LIMIT ?
  OFFSET ?
  `,
        [limit, offset],
      );

      res.status(200).json({
        currentPage: page,
        totalPages,
        totalRecords,
        data: inventory,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch inventory",
      });
    }
  },
);

// filter inventory (GET /inventory/filter)
router.get(
  "/filter",
  authMiddleware,
  inventoryManagerGeneralManagerAdmin,kitchenStaffOnly,
  async (req, res) => {
    try {
      const { category } = req.query;

      if (!category) {
        return res.status(400).json({
          message: "Category is required",
        });
      }

      const inventory = await queryDatabase(
        `
        SELECT
          i.inventory_id,
          ic.category_name,
          i.ingredient_name,
          i.quantity,
          i.unit
        FROM inventory i
        JOIN inventory_categories ic
        ON i.inventory_category_id = ic.inventory_category_id
        WHERE ic.category_name = ?
        ORDER BY i.inventory_id ASC
        `,
        [category],
      );

      res.status(200).json(inventory);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to filter inventory",
      });
    }
  },
);

module.exports = router;