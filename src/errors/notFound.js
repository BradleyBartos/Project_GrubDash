/**
 * Call to send a 404 response if a route is not found
 */
function notFound(request, response, next) {
  next({ status: 404, message: `Path not found: ${request.originalUrl}` });
}

module.exports = notFound;
