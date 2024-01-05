// Require Mongoose
import mongoose from "mongoose";
import { rolesSchema } from "./roles.js";
import { storyPointSchema } from "./storyPoint.js";

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

issuesSchema.path('teamRoles').validate(function(teamRoles){
    if(!teamRoles){return false}
    else if(teamRoles.length === 0){return false}
    return true;
}, '`issueRole` is required. There must be at least one role added to each issue');


export const Issues =  mongoose.model('Issues', issuesSchema)