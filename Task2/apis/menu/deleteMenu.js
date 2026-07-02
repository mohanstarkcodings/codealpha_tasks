const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  generalManagerOrAdminOnly,
} = require("../../auth/authorisation.js");

const router = express.Router();

//delete existing category (DELETE /menu/category/:category_id)
router.delete(
  "/category/:id",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

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

      const menuItems = await queryDatabase(
        `
        SELECT *
        FROM menu_items
        WHERE category_id = ?
        `,
        [id],
      );

      if (menuItems.length > 0) {
        return res.status(400).json({
          message: "Cannot delete category. Menu items are associated with it.",
        });
      }

      await queryDatabase(
        `
        DELETE FROM categories
        WHERE category_id = ?
        `,
        [id],
      );

      res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete category",
      });
    }
  },
);

//delete existing menu item (DELETE /menu/:item_id)
router.delete(
  "/:id",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

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

      await queryDatabase(
        `
        DELETE FROM menu_items
        WHERE item_id = ?
        `,
        [id],
      );

      res.status(200).json({
        message: "Menu item deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete menu item",
      });
    }
  },
);

module.exports = router;