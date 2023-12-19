import { BaseError } from "./baseError.js";
import { HttpStatusCodes } from "./httpStatusCodes.js";
/**
 * The Mongoose Not Acceptable error should be thrown when improper data is
 * posted or updated in the the app.
 */
export class MongooseNotAcceptable extends BaseError {
    constructor(description = 'bad data') {
        super('NOT ACCEPTABLE', HttpStatusCodes.NOT_ACCEPTABLE, description, true)
    }
}