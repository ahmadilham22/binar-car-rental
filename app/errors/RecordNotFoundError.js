const ApplicationError = require("./ApplicationError");

class RecordNotFoundError extends ApplicationError {
  constructor(name) {
    super(`${name} not found!`);
    this.name = name;
  }

  get details() {
    return { name: this.name };
  }
}

module.exports = RecordNotFoundError;
