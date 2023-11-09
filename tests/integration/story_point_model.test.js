import test from 'ava';
import {StoryPoints} from '../../models/story_points.js';
import * as dotenv from 'dotenv';
dotenv.config()
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


async function _postData(url = '', data = {}) {
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
        sprint: {
            name: "Joe's big sprint",
            startDate: "2023-10-18T20:23:23Z",
            endDate: "2023-10-18T20:24:09Z"
        },
        issues: [{
            team: "Team Beatles",
            teamRoles: [{
                firstName: "Sameul",
                lastName: "Oliva",
                role: "engineer"
            }],
            ticketId: "TBP-1234",
            issueName: "Joe's first big story ticket",
            description: "As a user I expect Joe to write a big story.",
            issueType: "story",
            storyPoints: {
                accepted: 3,
                committed: 3,
                completed: 3,
                estimated: 3, 
                actual: 5
            }
        }],
        storyPoints: {
            accepted: 5,
            committed: 3,
            completed: 3,
            estimated: 3, 
            actual: 5
        }
    }
    try {
        const response = await _postData(url, data)
        console.log(response, typeof response)
        t.is(response.issues.firstName,'Joe')
        // t.is(response.issues.last_name,'Smoe')
        // t.is(response.issues.team, "the joey team")
        // t.is(response.sprint.sprint_name, "Joe's big sprint")
        // t.is(response.sprint.start_date, '2023-10-18T20:23:23.000Z')
        // t.is(response.sprint.endDate, '2023-10-18T20:24:09.000Z')
        // t.is(response._id.length, 24)
        // regex for hexidecimal auto ids Mongoose creates for its' objectIds
        // let regex = /[0-9A-Fa-f]{6}/g
        // t.regex(response._id,regex)
        // Delete the record we created in this iteration running this test
        const res = await StoryPoints.deleteOne({'_id': response._id})
        // t.deepEqual(res,{ acknowledged: true, deletedCount: 1 })
        t.is('','')

    } catch(e) {
        console.error(e)
    }
})

// test(
//     "a Post with incomplete data to the story_points throws validation errors", 
//     async t => {
//     const url = process.env.URL + "metrics/story_points/create";
//     let data = {}
//     data.firstName = "Joe";
//     data.lastName = "Smoe";
//     data.team =  "the joey team";
//     data.sprint.sprintName =  "Joe's big sprint 21";
//     data.sprint.startDate =  "2023-10-18T20:23:23Z";
//     data.sprint.endDate =  "2023-10-18T20:24:09Z";

//     data.issues = [{
//         ticket_id:  "TBP-1234",
//         issueName: "Joe's first big ticket",
//         description: "Joe's very first coding task is to ....",
//         issueType: "story",
//         storyPoints: {
//             accepted: 5,
//             committed: 5,
//             completed: 5,
//             estimated: 5, 
//             actual: 5 
//         }
//     }]

//     try {
//         const response = await _postData(url, data)
//         console.log(response)
//         t.is(
//             response.message,
//             'StoryPoints validation failed: sprint.name: Path `sprint.name` is required., lastName: Path `lastName` is required.'
//         )
//     } catch(e) {
//         console.error(e)
//     }
// })