class CustomError extends Error {
    constructor(message, status, severity) {
      super(message);
      this.status = status;
      this.severity = severity;
    }
  }
  
  class NotFoundError extends CustomError {
    constructor(message = "Not Found") {
      super(message, 404, "high");
    }
  }
  
  class ValidationError extends CustomError {
    constructor(message = "Validation Error") {
      super(message, 400, "medium");
    }
  }
  
  class UnauthorizedError extends CustomError {
    constructor(message = "Unauthenticated Error") {
        super(message, 401, "medium");
      }
  }
  // Add more custom errors as needed
  