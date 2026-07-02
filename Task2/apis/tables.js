const express = require("express");
const { queryDatabase } = require("../db.js");
const {
  authMiddleware,
  customerWaiterGeneralManagerAdmin,
  generalManagerOrAdminOnly,
} = require("../auth/authorisation.js");

const router = express.Router();

//View Tables (GET /table)
router.get(
  "/",
  authMiddleware,
  customerWaiterGeneralManagerAdmin,
  async (req, res) => {
    try {
      const tables = await queryDatabase(
        `
        SELECT
          table_id,
          table_number,
          capacity,
          status
        FROM restaurant_tables
        ORDER BY table_number ASC
        `,
      );

      res.status(200).json(tables);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch tables",
      });
    }
  },
);

//create new table (POST /table)
router.post(
  "/",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { table_number, capacity, status } = req.body;

      if (!table_number || !capacity) {
        return res.status(400).json({
          message: "Table number and capacity are required",
        });
      }

      const existingTable = await queryDatabase(
        `
        SELECT *
        FROM restaurant_tables
        WHERE table_number = ?
        `,
        [table_number],
      );

      if (existingTable.length > 0) {
        return res.status(409).json({
          message: "Table number already exists",
        });
      }

      const result = await queryDatabase(
        `
        INSERT INTO restaurant_tables
        (
          table_number,
          capacity,
          status
        )
        VALUES
        (
          ?,
          ?,
          ?
        )
        `,
        [table_number, capacity, status || "Available"],
      );

      res.status(201).json({
        message: "Table created successfully",
        table_id: result.insertId,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create table",
      });
    }
  },
);

//update existing table (PUT /table/:table_id)
router.put(
  "/:id",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

      const { table_number, capacity, status } = req.body;

      const table = await queryDatabase(
        `
        SELECT *
        FROM restaurant_tables
        WHERE table_id = ?
        `,
        [id],
      );

      if (table.length === 0) {
        return res.status(404).json({
          message: "Table not found",
        });
      }

      await queryDatabase(
        `
        UPDATE restaurant_tables
        SET
          table_number = ?,
          capacity = ?,
          status = ?
        WHERE table_id = ?
        `,
        [table_number, capacity, status, id],
      );

      res.status(200).json({
        message: "Table updated successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update table",
      });
    }
  },
);

//delete existing table (DELETE /table/:table_id)
router.delete(
  "/:id",
  authMiddleware,
  generalManagerOrAdminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

      const table = await queryDatabase(
        `
        SELECT *
        FROM restaurant_tables
        WHERE table_id = ?
        `,
        [id],
      );

      if (table.length === 0) {
        return res.status(404).json({
          message: "Table not found",
        });
      }

      await queryDatabase(
        `
        DELETE FROM restaurant_tables
        WHERE table_id = ?
        `,
        [id],
      );

      res.status(200).json({
        message: "Table deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete table",
      });
    }
  },
);

module.exports = router;
