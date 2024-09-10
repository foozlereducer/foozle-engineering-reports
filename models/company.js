import mongoose from "mongoose";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    key:{
        type: String,
        required: true
    }
})

export const Company =  mongoose.model('Company', companySchema)