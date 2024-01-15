// Require Mongoose
import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const boardSchema = new Schema({
    id: {
        type: number,
        required: true
    },
    name:{
        type: String,
        required: true
    }
});

export const Boards =  mongoose.model('Boards', boardSchema)

