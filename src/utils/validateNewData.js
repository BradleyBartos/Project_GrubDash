/**
 * Gets the data from the provided request.body,
 * ensures that the data contains a non-empty value for each of the expectedFields,
 * and returns {data} if successful.
 * If invalid, returns {error:{status: 400, message {explanatory string}}}
 * 
 * @param {*} request request with body to check
 * @param {*} next where to send errors too
 * @param {*} expectedFields the non-empty keys the request.body should contain
 * @returns object with {request.body} if it is valid, or {error} if not
 */
const validateNewData = (request, next, expectedFields = []) => {
  const { data } = request.body;
  if(!data) {
    return { error: {
      status: 400,
      message: `${request.method} request to ${request.orginalUrl} must include a non-empty body`
    }}
  }
  for(const field of expectedFields) {
    if(!data[field]) {
      return { error: {
        status: 400,
        message: `${request.method} request body to ${request.orginalUrl} must include a value for ${field}`
      }}
    }
  }
  return { data };
}

module.exports = validateNewData;
