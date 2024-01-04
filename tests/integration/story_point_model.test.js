import test from 'ava';
import {StoryPoints} from '../../models/storyPoints.js';
import { Issues } from '../../models/issues.js';
import * as dotenv from 'dotenv';
dotenv.config()
let count = 0;
/**
 * Database - MongoDB using Mongoose ORM
 */
import {connectDB} from '../../datatabase/db.js'
// Connect to MongoDB
await connectDB();
let storyPointsSchema = null;


function errorIncludes(e, str = 'sprint.sprintName') {
    const msg = e.message;
    return msg.includes()
}
test("Validate should not throw error with non-required empty sprint.sprintName field", async t => {
    const sPs = new StoryPoints();
    const except = async () => {
       throw new Error(await sPs.save());
    }
    try {
        await except();
    } catch(e) {
        t.false(errorIncludes(e,"sprint.sprintName"))
    }
});

/**
 * Private postData() function - make a post using async fetch
 * @param {String} url 
 * @param {Object} data 
 * @returns String - stringified json data 
 */
async function _postData(url = '', data = {}) {
    count++;
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(data)
    });
    
    return response.json();
}

test("a Post to the story_points route saves a document", async t => {
    const url = process.env.URL + "metrics/story_points/create";
    const data = {
        "sprint": {
            "name": "Dashboards Galore",
            "startDate": "2023-10-18T20:23:23Z",
            "endDate": "2023-10-18T20:24:09Z"
        },
        "issues": [{
            "team": "Team Beatles",
            "teamRoles": [{
                "firstName": "Dr. Samuel",
                "lastName": "Oliva",
                "role": "engineer"
            },
            {
                "firstName": "Jim",
                "lastName": "Rodrick",
                "role": "quality engineer"
            }],
            "ticketId": "TBP-1234",
            "issueName": "Joe's first big story ticket",
            "description": "As a user I expect Joe to write a big story.",
            "issueType": "story",
            "storyPoints": {
                "accepted": 3,
                "committed": 3,
                "completed": 3,
                "estimated": 3, 
                "actual": 5
            }
        }]
    }
    let response = null;
    try {
        response = await _postData(url, data);
    } catch(e) {
        console.error(e)
    }

    t.is(response.issues[0].teamRoles[0].firstName,'Dr. Samuel')
    t.is(response.issues[0].teamRoles[0].lastName,'Oliva')
    t.is(response.issues[0].teamRoles[0].role,'engineer')
    t.is(response.issues[0].team, "Team Beatles")
    t.is(response.issues[0].teamRoles[1].firstName,'Jim')
    t.is(response.issues[0].teamRoles[1].lastName,'Rodrick')
    t.is(response.issues[0].teamRoles[1].role,'quality engineer')

    t.is(response.sprint.name, "Dashboards Galore")
    t.is(response.sprint.startDate, '2023-10-18T20:23:23.000Z')
    t.is(response.sprint.endDate, '2023-10-18T20:24:09.000Z')
    t.is(response._id.length, 24)
    // // regex for hexidecimal auto ids Mongoose creates for its' objectIds
    let regex = /[0-9A-Fa-f]{6}/g
    t.regex(response._id,regex)

    // clean up the integration tests data and validate it has been cleaned
    const deleteConfirm = await StoryPoints.deleteOne({'_id': response._id})
    t.deepEqual(deleteConfirm,{ acknowledged: true, deletedCount: 1 })
})

test(
    "a Post with incomplete data to the story_points throws validation errors", 
    async t => {
    const url = process.env.URL + "metrics/story_points/create";
    const data = {
        "sprint": {
            "startDate": "2023-10-18T20:23:23Z",
            "endDate": "2023-10-18T20:24:09Z"
        },
        "issues": [{
            "team": "Team Beatles",
            "teamRoles": [{
                "lastName": "Oliva",
                "role": "engineer"
            },
            {
                "firstName": "Jim",
                "lastName": "Rodrick",
                "role": "quality engineer"
            }],
            "issueName": "Joe's first big story ticket",
            "description": "As a user I expect Joe to write a big story.",
            "issueType": "story",
            "storyPoints": {
                "committed": 3,
                "completed": 3,
                "estimated": 3, 
                "actual": 5
            }
        }]
    }

    try {
        const response = await _postData(url, data);
        t.is(
            response.message,
            'StoryPoints validation failed: sprint.name: Path `name` is required., issues.0.ticketId: Path `ticketId` is required., issues.0.teamRoles.0.firstName: Path `firstName` is required.'
        )
    } catch(e) {
        const errors = JSON.stringify(e);
        console.log(errors)
    }
})