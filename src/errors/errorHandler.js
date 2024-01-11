/**
 * Middleware to send the provided error in the reponse.
 * Error should be an object with status and message:
 * Ex: { status: 400, message: 'Error message' }
 */
function errorHandler(error, request, response, next) {
  console.error(error);  // Comment out to silence tests.
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
}

module.exports = errorHandler;
