import { HttpStatusCode } from "./httpStatusCodes";

export class BaseError extends Error {
    name;
    httpCode;
    boolean;
    
    constructor(name, httpCode, description, isOperational) {
        super(description);
        if (httpCode instanceof HttpStatusCode) {
            if ( typeof httpCode === number) {
                this.httpCode = httpCode;
            } else {
                this.httpCode = httpCode.NOT_ACCEPTED
            }
        } else {
            this.httpCode = 406;
        }
        Object.setPrototypeOf(this, new.target.prototype);
        
        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;
        
        Error.captureStackTrace(this);
    }
}