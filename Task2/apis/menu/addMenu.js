const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  generalManagerOrAdminOnly,
} = require("../../auth/authorisation.js");

const router = express.Router();

// add new category (POST /menu/addCategory)
router.post(
  "/addCategory",
  authMiddleware,
  generalManagerOrAdminOnly,
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
        FROM categories
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
        INSERT INTO categories
        (category_name)
        VALUES
        (?)
        `,
        [category_name],
      );

      res.status(201).json({
        message: "Category created successfully",
        category_id: result.insertId,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create category",
      });
    }
  },
);

// add new menu item (POST /menu/menuItem)
router.post(
  "/menuItem",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { category_id, name, description, price, is_available } = req.body;

      if (!category_id || !name || !description || !price) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const category = await queryDatabase(
        `
        SELECT category_id
        FROM categories
        WHERE category_id = ?
        `,
        [category_id],
      );

      if (category.length === 0) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      const result = await queryDatabase(
        `
        INSERT INTO menu_items
        (
          category_id,
          name,
          description,
          price,
          is_available
        )
        VALUES
        (
          ?,
          ?,
          ?,
          ?,
          ?
        )
        `,
        [category_id, name, description, price, is_available ?? true],
      );

      res.status(201).json({
        message: "Menu item created successfully",
        item_id: result.insertId,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create menu item",
      });
    }
  },
);

module.exports = router;
