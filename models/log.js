// Require Mongoose
import mongoose from "mongoose";

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
        enum: ['fatal', 'error', 'debug', 'info'],
        default: 'error'
    },
    error: {
        type: String,
        required: true
    },
    createdAt: Date
})

export const LogSchema =  mongoose.model('Log', logSchema)

