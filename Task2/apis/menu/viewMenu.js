const express = require("express");
const { queryDatabase } = require("../../db.js");
const { authMiddleware } = require("../../auth/authorisation.js");

const router = express.Router();

// show menu items (GET /menu/menuItems)
router.get("/menuItems", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    // Total Records
    const totalRecordsResult = await queryDatabase(`
      SELECT COUNT(*) AS total
      FROM menu_items
    `);

    const totalRecords = totalRecordsResult[0].total;

    const totalPages = Math.ceil(totalRecords / limit);

    // Menu Data
    const menuItems = await queryDatabase(
      `
  SELECT
    m.item_id,
    c.category_name,
    m.name,
    m.description,
    m.price,
    m.is_available
  FROM menu_items m
  JOIN categories c
  ON m.category_id = c.category_id

  ORDER BY m.item_id ASC

  LIMIT ?
  OFFSET ?
  `,
      [limit, offset],
    );

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalRecords,
      data: menuItems,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch menu",
    });
  }
});

// filter menu items (GET /menu/filter)
router.get("/filter", authMiddleware, async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;

    let whereClause = "WHERE 1=1";
    const values = [];

    // Category Filter
    if (category) {
      whereClause += " AND c.category_name = ?";
      values.push(category);
    }

    // Minimum Price
    if (minPrice) {
      whereClause += " AND m.price >= ?";
      values.push(minPrice);
    }

    // Maximum Price
    if (maxPrice) {
      whereClause += " AND m.price <= ?";
      values.push(maxPrice);
    }

    const sql = `
      SELECT
        m.item_id,
        c.category_name,
        m.name,
        m.description,
        m.price,
        m.is_available
      FROM menu_items m
      JOIN categories c
      ON m.category_id = c.category_id
      ${whereClause}
      ORDER BY m.item_id ASC
    `;

    const data = await queryDatabase(sql, values);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to filter menu",
    });
  }
});

module.exports = router;