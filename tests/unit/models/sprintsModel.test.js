import test from 'ava';
import mongoose from "mongoose";
import { sprintsSchema } from '../../../models/sprints.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
let mongo;

/**
 * Spring up a memory mongoDb to isulate it from the prod / dev environment.
 */
test.before(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
;});

// Tear down the in-memory MongoDB server after all tests are done
test.after.always(async () => {
  await mongoose.disconnect();
  await mongo.stop()
})

test("The Sprints model can save and retrieve data", async t => {
    let forteenDaysLater = new Date();
    forteenDaysLater.setDate(forteenDaysLater.getDate() + 14);
    const SprintsIndex = mongoose.model('projectsIndex', sprintsSchema);
    const data = {
        team: 'TBP',
        sprint:{
            id:910, 
            name:"Sprint 1 Data Insights",
            desc: "Some Desc",
            goal: "to survice",
            startDate: Date.now(),
            endDate: forteenDaysLater
        },
        teamRoles: [{firstName: "Steve", lastName: "Browning", role: "admin"}],
        issues:[{
            ticketId: "TBP-1355",
            issueName: "Incremental Sync Strategy in DWH",
            assignee: "Samuel Oliva",
            engineers: [{name: 'Samuel Oliva'}],
            qe: "Jim Rodrick",
            description: `Contextualization:
            So far, the jobs created in the POC of the DWH is overwriting data in S3, which does not seem to be so much performative. For this purpose, it is important to have a incremental loading, which can help to reduce the workload over the data source and also reduce the loading time of the ETL.
            
            Objective:
            Investigate options in AWS Glue to perform incremental load in the ETL.`,
            issueType: "story",
            storyPoints: {
                accepted: 5,
                committed: 3,
                estimated: 3,
                actual: 5
            }
        }]
    }
     // Save data to the in-memory MongoDB
     const result = await SprintsIndex.create(data);
     // Retrieve data and check if it matches what we saved
     const retrievedData = await SprintsIndex.findById(result._id);
     t.deepEqual(retrievedData.toObject(), result.toObject());
});

