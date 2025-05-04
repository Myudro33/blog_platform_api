export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.error = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
  }
}
export const handleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (!err.isOperational) {
    return res.status(err.statusCode).json({
      status: "Error",
      message: "Internal Server Error!",
    });
  }
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or other unknown error: don't leak error details
    console.error("ERROR 💥", err);
    // Send generic error response
    err.message = "Something went very wrong!";
  }
};
