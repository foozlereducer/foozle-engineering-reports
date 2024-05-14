// Require Mongoose
import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const allowedSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
 
}, {timestamps: true });

export const Allowed =  mongoose.model('Allowed', allowedSchema)

