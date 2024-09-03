// Require Mongoose
import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const projectsSchema = new Schema({
    key: {
        type: String,
        required: true,
    },
    expertise: {
        type: String
    },
    name:{
        type: String,
        required: true,
    },
    core: {
        type: Boolean,
        defalut: false,
    },
    boardId: [{
        type: Number,
        required: true,
    }]
}, {timestamps: true });

export const Projects =  mongoose.model('Projects', projectsSchema)

