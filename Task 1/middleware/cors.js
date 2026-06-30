const cors = require("cors");

const allowedOrigins = ["http://127.0.0.1:5500", "http://localhost:3500"];

const corsOptions = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
});

module.exports = corsOptions;