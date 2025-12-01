/**
 * Error Handler Middleware
 * Centralized error handling for the API
 */

function errorHandler(err, req, res, next) {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method
  });

  // Default error
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation Error: ' + err.message;
  } else if (err.name === 'UnauthorizedError') {
    status = 401;
    message = 'Unauthorized: ' + err.message;
  } else if (err.code === 'ECONNREFUSED') {
    status = 503;
    message = 'Service Unavailable: Unable to connect to external service';
  }

  // Send error response
  res.status(status).json({
    error: status >= 500 ? 'Internal Server Error' : err.name || 'Error',
    message: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details
    })
  });
}

module.exports = errorHandler;
