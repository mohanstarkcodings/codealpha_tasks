const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  inventoryManagerOnly,
} = require("../../auth/authorisation.js");

const router = express.Router();

//update existing category (PUT /inventory/category/:category_id)
router.put(
  "/category/:id",
  authMiddleware,
  inventoryManagerOnly,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { category_name } = req.body;

      if (!category_name) {
        return res.status(400).json({
          message: "Category name is required",
        });
      }

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

      const duplicate = await queryDatabase(
        `
        SELECT *
        FROM inventory_categories
        WHERE category_name = ?
        AND inventory_category_id != ?
        `,
        [category_name, id],
      );

      if (duplicate.length > 0) {
        return res.status(409).json({
          message: "Category name already exists",
        });
      }

      await queryDatabase(
        `
        UPDATE inventory_categories
        SET category_name = ?
        WHERE inventory_category_id = ?
        `,
        [category_name, id],
      );

      res.status(200).json({
        message: "Inventory category updated successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update inventory category",
      });
    }
  },
);

//Update existing Stock (PUT /inventory/stock/:stock_id)
router.put(
  "/stock/:id",
  authMiddleware,
  inventoryManagerOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

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

      const duplicateIngredient = await queryDatabase(
        `
        SELECT *
        FROM inventory
        WHERE ingredient_name = ?
        AND inventory_id != ?
        `,
        [ingredient_name, id],
      );

      if (duplicateIngredient.length > 0) {
        return res.status(409).json({
          message: "Ingredient name already exists",
        });
      }

      await queryDatabase(
        `
        UPDATE inventory
        SET
          inventory_category_id = ?,
          ingredient_name = ?,
          quantity = ?,
          unit = ?
        WHERE inventory_id = ?
        `,
        [inventory_category_id, ingredient_name, quantity, unit, id],
      );

      res.status(200).json({
        message: "Stock updated successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update stock",
      });
    }
  },
);

module.exports = router;