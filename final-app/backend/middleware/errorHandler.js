/**
 * CampusConnect Final App - Error Handler Middleware
 * Practical 6 & 7: REST API Error Handling & Security
 */

exports.notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
};

exports.globalErrorHandler = (err, req, res, next) => {
  console.error(`[Backend Error] ${err.name}: ${err.message}`);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected server error occurred.';
  let errorType = err.name || 'InternalServerError';

  // Handle JSON parsing errors (malformed JSON sent in request body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON in request body. Please verify your JSON payload.';
    errorType = 'BadRequestError';
  }

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with specified identifier value: '${err.value}'.`;
    errorType = 'CastError';
  }

  // Handle Mongoose Schema ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(el => el.message);
    message = `Validation Failed: ${errors.join(', ')}`;
    errorType = 'ValidationError';
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const fields = Object.keys(err.keyValue || {});
    message = `Duplicate field value entered for [${fields.join(', ')}]. Value must be unique.`;
    errorType = 'DuplicateKeyError';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorType: errorType
  });
};
