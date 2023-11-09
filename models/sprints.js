// Require Mongoose
import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Story Point Report Schema
 */
export const sprintsSchema = new Schema([{
    name: {
        type: String
    },
    desc: {type: String},
    goal: {type: String},
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
}])