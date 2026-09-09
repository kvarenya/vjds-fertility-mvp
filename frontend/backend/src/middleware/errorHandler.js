// Catch-all error handler. Keep this LAST in the middleware chain in server.js.
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server." });
}

module.exports = errorHandler;
