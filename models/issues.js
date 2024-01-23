// Require Mongoose
import mongoose from "mongoose";
import { storyPointSchema } from "./storyPoint.js";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const issuesSchema = new Schema({
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
    assignee: {
        type: String,
        required: true,
    },
    engineers: [{
        name: {
            type: String,
            required: true
        }
    }],
    qe: [{
        type: String,
        required:true,
    }],
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    issueType: {
        type: String,
        enum: ['story', 'bug', 'task', 'sub-task', 'epic'],
        default: 'story',
        required: true
    },
    storyPoints: {
        type: storyPointSchema,
        required: [true,  "`the estimated story point field` is required, either 0, 1, 2, 3, 5, 8, or 13"],
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


export const Issues =  mongoose.model('Issues', issuesSchema)