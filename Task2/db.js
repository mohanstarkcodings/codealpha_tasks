const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// DB connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Helper 
const queryDatabase = (sql, params = []) =>
  new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });

// test database connection (GET /db/testdb)
router.get("/testdb", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500);
      res.json({ message: "Database connection failed", error: err.message });
    } else {
      res.status(200).json({ message: "Database connected successfully!" });
      connection.release();
    }
  });
});

module.exports = { queryDatabase, router };