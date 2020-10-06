function sendResult(res, data, code = 200) {
  res.status(code).json({
    status: 'success',
    data
  });
}

function sendError(res, code, message) {
  res.status(code).json({
    status: 'error',
    message
  });
}


module.exports = {
  sendResult,
  sendError,
};