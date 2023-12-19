import { HttpStatusCodes } from "./httpStatusCodes.js";

export class BaseError extends Error {
    name;
    httpCode;
    boolean;
    
    constructor(name, httpCode, description, isOperational) {
        super(description);
        if (httpCode.OK) {
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
        this.description = description
        this.isOperational = isOperational;
        
        
        Error.captureStackTrace(this);
    }
}