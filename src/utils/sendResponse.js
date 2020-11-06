function sendResponse(res, code, message, data) {
  res.status(code).json({
    status: code === 200 ? 'success' : code,
    message,
    data
  });
}

function sendResult(res, data, code = 200) {
  sendResponse(res, code, undefined, data);
}

function sendError(res, code, message) {
  sendResponse(res, code, message);
}


module.exports = {
  sendResult,
  sendError,
};