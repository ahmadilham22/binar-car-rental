class ApplicationError extends Error {
  get details() {
    return {};
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        details: this.details,
        car: this.car,
      },
    };
  }
}

module.exports = ApplicationError;
