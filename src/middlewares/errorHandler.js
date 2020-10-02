const errorHandler = (error, req, res, next) => {
  const { title, _message } = error;
  console.log(_message);

  // if (error.name === 'ValidationError') {
  //   return res.json(error.details);
  // }

  return res.json(_message);
}

module.exports = errorHandler;