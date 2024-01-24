import test from 'ava';
import mongoose from "mongoose";
import { projectsSchema, Projects } from '../../../../models/Jira/projects.js';
import { MongoMemoryServer } from 'mongodb-memory-server';


let mongoServer;
let mongo;

// Spin up an in-memory MongoDB server before any tests run
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

test('Project model can save and retrieve data', async t=> {
    setTimeout(() => {
        console.log("Delayed for 1 second.");
    }, "2000");
    const ProjectIndex = mongoose.model('projectsIndex', projectsSchema);
    const data = {
        key: 'TBP',
        name: 'The Beatles',
        core: true,
        boarId: [167]
    };

     // Save data to the in-memory MongoDB
     const result = await ProjectIndex.create(data);

     // Retrieve data and check if it matches what we saved
     const retrievedData = await ProjectIndex.findById(result._id);
     t.deepEqual(retrievedData.toObject(), result.toObject());
})




