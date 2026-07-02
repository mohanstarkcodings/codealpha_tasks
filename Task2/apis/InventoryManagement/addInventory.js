const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  inventoryManagerOnly,
} = require("../../auth/authorisation.js");

const router = express.Router();

// add new category (POST /inventory/category)
router.post(
  "/category",
  authMiddleware,
  inventoryManagerOnly,
  async (req, res) => {
    try {
      const { category_name } = req.body;

      if (!category_name) {
        return res.status(400).json({
          message: "Category name is required",
        });
      }

      const existingCategory = await queryDatabase(
        `
        SELECT *
        FROM inventory_categories
        WHERE category_name = ?
        `,
        [category_name],
      );

      if (existingCategory.length > 0) {
        return res.status(409).json({
          message: "Category already exists",
        });
      }

      const result = await queryDatabase(
        `
        INSERT INTO inventory_categories
        (category_name)
        VALUES
        (?)
        `,
        [category_name],
      );

      res.status(201).json({
        message: "Inventory category created successfully",
        inventory_category_id: result.insertId,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create inventory category",
      });
    }
  },
);

//Add new Stock (POST /inventory/stock)
router.post(
  "/stock",
  authMiddleware,
  inventoryManagerOnly,
  async (req, res) => {
    try {
      const { inventory_category_id, ingredient_name, quantity, unit } =
        req.body;

      if (
        !inventory_category_id ||
        !ingredient_name ||
        quantity == null ||
        !unit
      ) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const category = await queryDatabase(
        `
        SELECT *
        FROM inventory_categories
        WHERE inventory_category_id = ?
        `,
        [inventory_category_id],
      );

      if (category.length === 0) {
        return res.status(404).json({
          message: "Inventory category not found",
        });
      }

      const existingStock = await queryDatabase(
        `
        SELECT *
        FROM inventory
        WHERE ingredient_name = ?
        `,
        [ingredient_name],
      );

      if (existingStock.length > 0) {
        return res.status(409).json({
          message: "Ingredient already exists",
        });
      }

      const result = await queryDatabase(
        `
        INSERT INTO inventory
        (
          inventory_category_id,
          ingredient_name,
          quantity,
          unit
        )
        VALUES
        (
          ?,
          ?,
          ?,
          ?
        )
        `,
        [inventory_category_id, ingredient_name, quantity, unit],
      );

      res.status(201).json({
        message: "Stock added successfully",
        inventory_id: result.insertId,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to add stock",
      });
    }
  },
);

module.exports = router;