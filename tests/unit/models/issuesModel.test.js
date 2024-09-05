import test from 'ava';
import mongoose from "mongoose";
import { issuesSchema } from '../../../models/issues.js';
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

test("The Issues model can save and retrieve data", async t => {
    const IssuesIndex = mongoose.model('projectsIndex', issuesSchema);
    const data = {
        ticketId: "TBP-1355",
        team: 'TBP',
        name: "Incremental Sync Strategy in DWH",
        assignee: "Samuel Oliva",
        engineers: ['Samuel Oliva'],
        qe: "Jim Rodrick",
        description: `Contextualization:
        So far, the jobs created in the POC of the DWH is overwriting data in S3, which does not seem to be so much performative. For this purpose, it is important to have a incremental loading, which can help to reduce the workload over the data source and also reduce the loading time of the ETL.
        
        Objective:
        Investigate options in AWS Glue to perform incremental load in the ETL.`,
        type: "story",
        storyPoints: {
            accepted: 5,
            committed: 3,
            estimated: 3,
            actual: 5
        },
        status: "In Development"
    };

     // Save data to the in-memory MongoDB
     const result = await IssuesIndex.create(data);
     //Retrieve data and check if it matches what we saved
     const retrievedData = await IssuesIndex.findById(result._id);
     t.deepEqual(retrievedData.toObject(), result.toObject());
});