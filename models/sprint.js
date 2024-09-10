// Require Mongoose
import mongoose from "mongoose";
import { sprintDetailsSchema } from "./sprintDetails.js"
import { issuesSchema } from "./issues.js";
import { rolesSchema } from "./roles.js"

// Define a schema
const Schema = mongoose.Schema;
/**
 * Sprints Schema - this holds most the metric data pulled from Jira api
 * 
 */
export const sprintSchema = new Schema({
    team: String,
    sprint: sprintDetailsSchema,
    teamRoles: [rolesSchema],
    issues: [issuesSchema]
}, {timestamps: true });

sprintSchema.path('teamRoles').validate(function(teamRoles){
    if(!teamRoles){return false}
    else if(teamRoles.length === 0){return false}
    return true;
}, '`teamRole` is required. There must be at least one role added to each sprint');

// Virtual for author's URL
sprintSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/story_points/${this._id}`;
});

export function convertDateToReadableFormat(dateStr) {
    const date = new Date(dateStr)
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let dt = date.getDate();

    if (dt < 10) {
    dt = '0' + dt;
    }
    if (month < 10) {
    month = '0' + month;
    }

    return year+'-' + month + '-'+dt;
}

sprintSchema.virtual('prety_dates').get(function () {
   return {
        sprintStartDateF: convertDateToReadableFormat(this.sprint.startDate),
        sprintEndDateF: convertDateToReadableFormat(this.sprint.endDate),
        updatedAtF:  convertDateToReadableFormat(this.updatedAt)
    }
})

export const Sprint =  mongoose.model('Sprint', sprintSchema)