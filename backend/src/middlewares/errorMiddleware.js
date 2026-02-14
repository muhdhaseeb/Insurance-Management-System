export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const response = {
    success: false,
    message
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.error = err.stack;
  }

  // Handle specific error types
  if (err.name === "ValidationError") {
    response.errors = Object.values(err.errors).map(e => e.message);
  }

  if (err.name === "CastError") {
    response.message = "Invalid ID format";
  }

  res.status(statusCode).json(response);
};
