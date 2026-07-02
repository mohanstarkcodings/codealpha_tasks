const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../access.log"),
  { flags: "a" },
);

const loggerMiddleware = morgan("combined", {
  stream: accessLogStream,
});

module.exports = loggerMiddleware;
