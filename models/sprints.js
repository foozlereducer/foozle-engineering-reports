// Require Mongoose
import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Story Point Report Schema
 */
export const sprintsSchema = new Schema([{
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
    },
}])

export const Sprints =  mongoose.model('Sprints', sprintsSchema)