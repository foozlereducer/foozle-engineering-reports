import test from "ava";
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { effortPerformanceIndexSchema } from "../../../models/effortPerformanceIndex.js";

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

// Test the Mongoose model
test('effortPerformanceIndex model can save and retrieve data', async (t) => {
    const EffortPerformanceIndex = mongoose.model('effortPerformanceIndex', effortPerformanceIndexSchema);
    const startDate = new Date();
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 14)
    const data = {
        plannedEffortStoryPoints: 10,
        completedStoryPoints: 5,
        sprint: {
            name: 'Platform Insights',
            goal: 'To have meaningul platform insights for our clients managers',
            startDate: startDate,
            endDate: endDate
        }
    };

    // Save data to the in-memory MongoDB
    const result = await EffortPerformanceIndex.create(data);

    // Retrieve data and check if it matches what we saved
    const retrievedData = await EffortPerformanceIndex.findById(result._id);
    t.deepEqual(retrievedData.toObject(), result.toObject());
});
