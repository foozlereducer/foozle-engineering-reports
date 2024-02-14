// Require Mongoose
import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const appConfigSchema = new Schema({
    configName: {
        type: String,
        required: true
    },
    configValue:{
        type: {},
        required: true
    }
})

export const AppConfig =  mongoose.model('AppConfig', appConfigSchema)