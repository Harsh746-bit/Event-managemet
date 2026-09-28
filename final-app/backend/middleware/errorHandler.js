/**
 * CampusConnect Final App - Error Handler Middleware
 */

exports.notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
};

exports.globalErrorHandler = (err, req, res, next) => {
  console.error(`[Backend Error] ${err.name}: ${err.message}`);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    errorType: err.name || 'InternalServerError'
  });
};
