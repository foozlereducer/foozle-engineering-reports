// Require Mongoose
import mongoose from "mongoose";
import { sprintsSchema } from "./sprints.js"
import { issuesSchema } from "./issues.js";

// Define a schema
const Schema = mongoose.Schema;
/**
 * Story Point Report Schema
 * The timestamps used in this way create updatedAt and createdAt automatically
 */
const storyPointsSchema = new Schema({
    sprint: sprintsSchema,
    issues: [issuesSchema]
}, {timestamps: true });



// Virtual for author's URL
storyPointsSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/story_points/${this._id}`;
});

export function convertDateToReadableFormat(dateStr) {
    const date = new Date(dateStr)
    console.log('date', date)
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

storyPointsSchema.virtual('prety_dates').get(function () {
   return {
        sprintStartDateF: convertDateToReadableFormat(this.sprint.startDate),
        sprintEndDateF: convertDateToReadableFormat(this.sprint.endDate),
        updatedAtF:  convertDateToReadableFormat(this.updatedAt)
    }
})

export const StoryPoints =  mongoose.model('StoryPoints', storyPointsSchema)