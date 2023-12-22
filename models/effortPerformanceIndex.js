// Require Mongoose
import mongoose from "mongoose";
import { sprintsSchema } from "./sprints.js";


// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const effortPerformanceIndexSchema = new Schema({
    plannedEffortStoryPoints: {
        type: Number,
        required: true
    },
    completedStoryPoints:{
        type: Number,
        required: true
    },
    sprint: sprintsSchema
}, {timestamps: true });

export const effortPerformanceIndex =  mongoose.model('effortPerformanceIndex', effortPerformanceIndexSchema)