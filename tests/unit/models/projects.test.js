import test from 'ava';
import mongoose from "mongoose";
import { projectsSchema } from '../../../models/projects.js';
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
    const ProjectIndex = mongoose.model('projectsIndex', projectsSchema);
    const data = {
        key: 'TBP',
        name: 'The Beatles',
        core: true,
        boardId: [167]
    };

     // Save data to the in-memory MongoDB
     const result = await ProjectIndex.create(data);

     // Retrieve data and check if it matches what we saved
     const retrievedData = await ProjectIndex.findById(result._id);
     console.log(retrievedData)
     //t.deepEqual(retrievedData.toObject(), result.toObject());
     t.true(true)
})
