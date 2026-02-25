/**
 * Global express error handler.
 * Must be registered as the last middleware in server.js
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[${req.method}] ${req.path} → ${status}: ${message}`);

  res.status(status).json({ message });
};
