import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const roleTypeSchema = new Schema({
    type: {
        type: String,
        required: true
    },
})

export const RoleType =  mongoose.model('RoleType', roleTypeSchema)