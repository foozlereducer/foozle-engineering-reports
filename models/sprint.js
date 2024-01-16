// Require Mongoose
import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Story Point Report Schema
 */
export const sprintSchema = new Schema({
    id:{
        type: Number,
        required: true
    }, 
    name: {
        type: String,
        required: true
    },
    desc: {type: String},
    goal: {type: String},
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
})

export const Sprint =  mongoose.model('Sprint', sprintSchema)