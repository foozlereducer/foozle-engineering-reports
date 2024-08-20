// Require Mongoose
import mongoose from "mongoose";


// Define a schema
const Schema = mongoose.Schema;

/**
 * Story Point Report Schema
 */
export const sprintDetailsSchema = new Schema({
    id: { // Sprint ID
        type: Number,
        required: true
    },
    boardId: {
        type: String, // Corrected from "tyoe" to "type"
        required: true
    },
    name: {
        type: String,
        required: true
    },
    desc: { type: String },
    goal: { type: String },
    storyPointTotals:{
        accepted:{
            type: Number,
            enum: [0,1, 2, 3, 5, 8, 13],
        },
        committed: {
            type: Number,
            enum: [0,1, 2, 3, 5, 8, 13],
        },
        completed: {
            type: Number,
            enum: [0,1, 2, 3, 5, 8, 13],
        },
        estimated: {
            type: Number,
            enum: [0,1, 2, 3, 5, 8, 13],
    
        },
        actual: {
            type: Number,
            enum: [0,1, 2, 3, 5, 8, 13],
        },  
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

export const SprintDetails = mongoose.model('SprintDetails', sprintDetailsSchema);
