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
    self: {
        type: String,
        required: true
    },
    state: {
        type: String,
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
        accepted:  {type: Number},
        committed: {type: Number},
        completed: {type: Number},
        estimated: {type: Number },
        actual: {type: Number},  
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    createdDate: {type: Date}
});

export const SprintDetails = mongoose.model('SprintDetails', sprintDetailsSchema);
