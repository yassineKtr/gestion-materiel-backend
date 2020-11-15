function ErrorHandler(code, message) {
  this.code = code;
  this.message = message;
}

ErrorHandler.prototype = Object.create(Error.prototype);
ErrorHandler.prototype.constructor = ErrorHandler;

module.exports = ErrorHandler;
