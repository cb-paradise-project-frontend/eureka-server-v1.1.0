class HttpError {
  constructor(code, message) {
    this.isHttpError = true;
    this.code = code;
    this.message = message;
  };
}

module.exports = HttpError;