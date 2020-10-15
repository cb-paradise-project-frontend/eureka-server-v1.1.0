const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.json(error.details);
  }
}

module.exports = errorHandler;
