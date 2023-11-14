// Require Mongoose
import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const rolesSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    role: {
        type:String,
        required: true
    }
})

export const Roles =  mongoose.model('Roles', rolesSchema)