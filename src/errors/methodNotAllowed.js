/**
 * Call to send an 405 response for a method not allowed at the request route
 */
function methodNotAllowed(request, response, next) {
  next({
    status: 405,
    message: `${request.method} not allowed for ${request.originalUrl}`,
  });
}

module.exports = methodNotAllowed;
