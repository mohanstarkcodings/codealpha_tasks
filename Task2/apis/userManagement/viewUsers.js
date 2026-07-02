const express = require("express");
const { queryDatabase } = require("../../db.js");
const {
  authMiddleware,
  generalManagerOrAdminOnly,
} = require("../../auth/authorisation.js");
const router = express.Router();

//View Users (GET /userManagement/showUsers)
router.get(
  "/showUsers",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;

      const offset = (page - 1) * limit;

      const totalResult = await queryDatabase(`
        SELECT COUNT(*) AS total
        FROM users
      `);

      const totalRecords = totalResult[0].total;

      const totalPages = Math.ceil(totalRecords / limit);

      const users = await queryDatabase(
        `
        SELECT
          id,
          full_name,
          email,
          role,
          provider,
          created_at
        FROM users
        ORDER BY id ASC
        LIMIT ?
        OFFSET ?
        `,
        [limit, offset],
      );

      res.status(200).json({
        currentPage: page,
        totalPages,
        totalRecords,
        data: users,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch users",
      });
    }
  },
);

// (GET /userManagement/showUsers/filter?role=RoleName)
router.get(
  "/showUsers/filter",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { role } = req.query;

      const allowedRoles = [
        "GeneralManager",
        "Waiter",
        "KitchenStaff",
        "InventoryManager",
      ];

      if (!role) {
        return res.status(400).json({
          message: "Role is required",
        });
      }

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message:
            "Role must be GeneralManager, Waiter, KitchenStaff, or InventoryManager",
        });
      }

      const users = await queryDatabase(
        `
        SELECT
          id,
          full_name,
          email,
          role,
          provider,
          created_at
        FROM users
        WHERE role = ?
        ORDER BY id ASC
        `,
        [role],
      );

      res.status(200).json(users);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to filter users",
      });
    }
  },
);

module.exports = router;
