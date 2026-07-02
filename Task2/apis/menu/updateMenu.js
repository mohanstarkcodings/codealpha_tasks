const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  generalManagerOrAdminOnly,
} = require("../../auth/authorisation.js");

const router = express.Router();

//update existing category (PUT /menu/category/:id)
router.put(
  "/category/:id",
  authMiddleware,
  generalManagerOrAdminOnly,
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
        FROM categories
        WHERE category_id = ?
        `,
        [id],
      );

      if (category.length === 0) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      await queryDatabase(
        `
        UPDATE categories
        SET category_name = ?
        WHERE category_id = ?
        `,
        [category_name, id],
      );

      res.status(200).json({
        message: "Category updated successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update category",
      });
    }
  },
);

// update existing menu items (PUT /menu/:id)
router.put(
  "/:id",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

      const { category_id, name, description, price, is_available } = req.body;

      const existingItem = await queryDatabase(
        `
        SELECT *
        FROM menu_items
        WHERE item_id = ?
        `,
        [id],
      );

      if (existingItem.length === 0) {
        return res.status(404).json({
          message: "Menu item not found",
        });
      }

      const result = await queryDatabase(
        `
        UPDATE menu_items
        SET
          category_id = ?,
          name = ?,
          description = ?,
          price = ?,
          is_available = ?
        WHERE item_id = ?
        `,
        [category_id, name, description, price, is_available, id],
      );

      res.status(200).json({
        message: "Menu item updated successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update menu item",
      });
    }
  },
);

module.exports = router;