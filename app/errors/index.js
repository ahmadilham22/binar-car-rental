const NotFoundError = require("./NotFoundError")
const EmailNotRegisteredError = require("./EmailNotRegisteredError")
const InsufficientAccessError = require("./InsufficientAccessError");
const WrongPasswordError = require("./WrongPasswordError")

module.exports = {
  EmailNotRegisteredError,
  InsufficientAccessError,
  NotFoundError,
  WrongPasswordError,
}
