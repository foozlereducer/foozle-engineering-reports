// Require Mongoose
import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const appConfigSchema = new Schema({
    configKeyPair: {
        type: {},
        required: true
    }
})

export const AppConfig =  mongoose.model('AppConfig', appConfigSchema)