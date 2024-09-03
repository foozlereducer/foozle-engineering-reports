// Require Mongoose
import mongoose from "mongoose";
import { storyPointSchema } from "./storyPoint.js";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const issuesSchema = new Schema({
    id: {
        type: Number
    },
    ticketId: {
        type: String,
        required: true
    },
    issueName: {
        type: String,
        required: true,
    },
    issueLink: {
        type:String,
        required: false,
    },
    key: {
        type:String,
        required: false,
    },
    assignee: {
        type: Object
    },
    engineer: {
        type: Object
    },
    engineers:  {
        type: [Object]
    },
    reporter: {
        type: [Object]
    },
    qe: {
        type: [Object]
    },
    qes: {

    },
    description: {
        type: String
    },
    status: {
        type: [Object],
        required: true
    },
    issueType: {
        type: [Object],
        required: true
    },
    storyPoint: {
        type: Number
    }
})
//, {_id: false})
/**
 * Calculate Full Name
 * Virtual for ticket assignee's full name
 */
issuesSchema.virtual('fullname').get(function () {
    let fullName = ""
    if (this.firstName && this.lastName) {
        fullName = `${this.firstName}, ${this.lastName}`
    }
    return fullName
})

// Virtual for the browse link
issuesSchema.virtual('browse').get(function () {
    return `https://actocloud.atlassian.net/browse/${this.key}`;
});


export const Issues =  mongoose.model('Issues', issuesSchema)