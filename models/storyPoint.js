// Require Mongoose
import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Story Point Report Schema
 */
export const storyPointSchema = new Schema([{
    storyPoint: {
        type: Number,
        required: true,
        enum: [0,1, 2, 3, 5, 8, 13]
    }
}])