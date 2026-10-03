/**
 * BRAHMA Centralized Error Handling & Diagnostics Middleware
 * Normalizes error responses, assigns request correlation IDs, and logs metrics.
 */

function errorHandler(err, req, res, _next) {
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  console.error(`\n[BRAHMA ERROR GATEWAY | ${requestId}] ${req.method} ${req.originalUrl}`);
  console.error(` Status: ${status} | Error: ${message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(` Stack: ${err.stack.split('\n')[1]}`);
  }

  res.status(status).json({
    error: {
      message,
      code: status,
      requestId,
      type: err.name || 'ServerError',
      timestamp: new Date().toISOString()
    }
  });
}

module.exports = errorHandler;
