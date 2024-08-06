// Require Mongoose
import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;

/**
 * Story Point Report Schema
 */
export const sprintSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    desc: { type: String },
    goal: { type: String },
    storyPointTotals: {
        accepted: {
            type: Number,
            required: false
        },
        committed: {
            type: Number,
            required: false
        },
        completed: {
            type: Number,
            required: false
        },
        estimated: {
            type: Number,
            required: false
        },
        actual: {
            type: Number,
            required: false
        },
    },
    boardId: {
        type: String, // Corrected from "tyoe" to "type"
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

export const Sprint = mongoose.model('Sprint', sprintSchema);
