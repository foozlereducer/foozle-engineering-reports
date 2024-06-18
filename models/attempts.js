// Require Mongoose
import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const attemptsSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    count: {
        type: Number, 
        default: 0 
    },

}, {timestamps: true });

export const Attempts =  mongoose.model('Attempts', attemptsSchema)

