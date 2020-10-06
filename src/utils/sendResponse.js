function sendResult(res, data) {
  res.status(200).json({
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