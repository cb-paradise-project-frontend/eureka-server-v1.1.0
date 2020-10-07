const { sendError } = require('../utils/sendResponse');

const errorHandler = (error, req, res, next) => {
  const { isHttpError, code, message } = error;
  console.log(message);

  // if (error.name === 'ValidationError') {
  //   return res.json(error.details);
  // }

  if (!message) return sendError(res, 500, 'Unknown error.');

  return isHttpError 
    ? sendError(res, code, message)
    : sendError(res, 500, message);
}

module.exports = errorHandler;