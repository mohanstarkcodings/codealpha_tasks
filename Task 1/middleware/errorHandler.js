const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred. Please try again later."
        : err.message,
  });
};

module.exports = errorHandler;
