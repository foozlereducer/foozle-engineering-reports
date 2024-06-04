// Require Mongoose
import mongoose from "mongoose";
import { object } from "testdouble";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const logSchema = new Schema({
    statusCode: {
        type: Number,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['fatal', 'severe', 'high', 'medium', 'low', 'debug', 'info'],
        default: 'error'
    },
    createdAt: Date,
    stacktrace:{
        type: object,
        required: false
    }
})

export const LogSchema =  mongoose.model('Log', logSchema)

