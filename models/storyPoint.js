// Require Mongoose
import mongoose from "mongoose";
import { ActoValidator } from "../services/validators/ActoValidator.js";
const Validator = new ActoValidator();
   

// Define a schema
const Schema = mongoose.Schema;
/**
 * Story Point Report Schema
 */
export const storyPointSchema = new Schema({
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
})