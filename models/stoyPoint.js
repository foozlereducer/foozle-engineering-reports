// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const storyPointsSchema = new Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    team: {
        required: true,
        type: String
    },
    storyPoints: {
        required: true,
        type: Number
    },
    sprintName: {
        required: true,
        type: String
    },
    sprintStartDate: {
        required: true,
        type: Date
    },
    sprintEndDate: {
        required: true,
        type: Date
    }
    ,
    creationDate: {
        required: true,
        type: Date
    }
})

/**
 * Calculate Full Name
 * Virtual for ticket assignee's full name
 */
storyPointsSchema.virtual('name').get(() => {
    let fullname = ""
    if (this.firstName && this.lastName) {
        fullname = `${this.firstName}, ${this.lastName}`
    }
    return fullname
})


module.exports = mongoose.model('storyPoints', storyPointsSchema)