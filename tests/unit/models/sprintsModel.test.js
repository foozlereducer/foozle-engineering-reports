import test from 'ava';
import mongoose from "mongoose";
import { sprintSchema } from '../../../models/sprint.js';
import { Company } from '../../../models/company.js'; // Import the Company model
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
let mongo;

/**
 * Spring up a memory mongoDb to isolate it from the prod / dev environment.
 */
test.before(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Seed the in-memory MongoDB with companies
    await Company.create([
        { name: 'ACTO Inc.', key: 'ACTO' },
        { name: 'ValueLabs', key: 'VL' },
        { name: 'QASource', key: 'QS' }
    ]);
});

// Tear down the in-memory MongoDB server after all tests are done
test.after.always(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test.serial("The Sprints model can save and retrieve data", async t => {
    let fourteenDaysLater = new Date();
    fourteenDaysLater.setDate(fourteenDaysLater.getDate() + 14);

    const SprintsIndex = mongoose.model('projectsIndex', sprintSchema);
    const data = {
        team: 'TBP',
        sprint: {
            id: 910,
            self: "https://some/Jira/url/910",
            state: "active",
            boardId: "board_124",
            name: "Sprint 1 Data Insights",
            desc: "Some Desc",
            goal: "to survive",
            startDate: Date.now(),
            endDate: fourteenDaysLater
        },
        teamRoles: [{ company: "ACTO", firstName: "Steve", lastName: "Browning", role: "engineer" }],
        issues: [{
            ticketId: "TBP-1355",
            status: "In Progress",
            name: "Incremental Sync Strategy in DWH",
            assignee: "Samuel Oliva",
            engineers: ['Samuel Oliva'],
            qe: "Jim Rodrick",
            description: `Contextualization:
            So far, the jobs created in the POC of the DWH are overwriting data in S3, which does not seem to be so much performative. For this purpose, it is important to have an incremental loading strategy, which can help to reduce the workload over the data source and also reduce the loading time of the ETL.`,
            type: "story",
            storyPoints: {
                accepted: 5,
                committed: 3,
                estimated: 3,
                actual: 5
            }
        }]
    };

    // Save data to the in-memory MongoDB
    const result = await SprintsIndex.create(data);

    // Retrieve data and check if it matches what we saved
    const retrievedData = await SprintsIndex.findById(result._id);
    t.deepEqual(retrievedData.toObject(), result.toObject());
});
