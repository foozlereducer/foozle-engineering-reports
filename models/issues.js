// Require Mongoose
import mongoose from "mongoose";
import { rolesSchema } from "./roles.js";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Issues Report Schema
 */
export const issuesSchema = new Schema({
    team: {
        required: true, 
        type: String
    },
    teamRoles: {
        type: [rolesSchema],
        required: true
    },
    ticketId: {
        type: String,
        required: true
    },
    issueName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    issueType: {
        type: String,
        enum: ['story', 'bug', 'task', 'sub-task', 'epic'],
        default: 'story',
        required: true
    },
    storyPoints: {
        accepted: {
            type: Number,
            enum: [0,1, 2, 3, 5, 8, 12],
            default: 0,
            required: true
        },
        committed: {
            type: Number,
            enum: [0,1, 2, 3, 5, 8, 12],
            default: 0,
            required: true
        },
        completed: {
            type: Number,
            enum: [0,1, 2, 3, 5, 8, 12],
            default: 0,
            required: true
        },
        estimated: {
            type: Number,
            enum: [0,1, 2, 3, 5, 8, 12],
            default: 0,
            required: true,
        }, 
        actual: {
            type: Number,
            enum: [0,1, 2, 3, 5, 8, 12],
            default: 0,
            required: true
        }
    }
}, {_id: false})

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

issuesSchema.path('teamRoles').validate(function(teamRoles){
    if(!teamRoles){return false}
    else if(teamRoles.length === 0){return false}
    return true;
}, 'There must be at least one team role');

export const Issues =  mongoose.model('Issues', issuesSchema)