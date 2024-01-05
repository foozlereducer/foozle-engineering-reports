import test from 'ava';
import mongoose from "mongoose";
import { issuesSchema } from '../../../models/issues.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Types } from "mongoose";

let mongoServer;
let mongo;

// Spin up an in-memory MongoDB server before any tests run
// This is to ensure that this can remain unit tests as the real db is
// not be written to
test.before(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Tear down the in-memory MongoDB server after all tests are done
test.after.always(async () => {
  await mongoose.disconnect();
  await mongo.stop()
});

test("The Issues model can save and retrieve data", async t => {
    const IssuesIndex = mongoose.model('projectsIndex', issuesSchema);
    const data = {
        team: 'TBP',
        teamRoles: [{firstName: "Steve", lastName: "Browning", role: "admin"}],
        ticketId: "TBP-1355",
        issueName: "Incremental Sync Strategy in DWH",
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
    };

     // Save data to the in-memory MongoDB
     const result = await IssuesIndex.create(data);
     //Retrieve data and check if it matches what we saved
     const retrievedData = await IssuesIndex.findById(result._id);
     t.deepEqual(retrievedData.toObject(), result.toObject());
});