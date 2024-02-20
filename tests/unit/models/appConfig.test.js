import test from 'ava';
import mongoose from "mongoose";
import { appConfigSchema } from '../../../models/appConfig.js';
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


test('AppConfig model can save and retrieve data', async t=> {
    const AppConfigIndex = mongoose.model('appConfigIndex', appConfigSchema);
    const data = {
        configKeyPair: {'Key':'SomeKey'}
    };

    // Save data to the in-memory MongoDB
    const result = await AppConfigIndex.create(data);

    // Retrieve data and check if it matches what we saved
    const retrievedData = await AppConfigIndex.findById(result._id);
    t.deepEqual(retrievedData.configKeyPair, data.configKeyPair);
    t.is(retrievedData.configKeyPair["Key"], 'SomeKey');

})

test('AppConfig can add any type of data as a configValue', async t=> {
    const AppConfigIndex = mongoose.model('appConfigIndex', appConfigSchema);
    const data = {
        configKeyPair: {'1': {"one": 1, "two": 2}}
    };

    // Save data to the in-memory MongoDB
    const result = await AppConfigIndex.create(data);

    // Retrieve data and check if it matches what we saved
    const retrievedData = await AppConfigIndex.findById(result._id);

    t.deepEqual(retrievedData.configKeyPair, data.configKeyPair)
    t.deepEqual(retrievedData.configKeyPair['1'],{"one": 1, "two": 2} )
   

    const data2 = {
        configKeyPair: {2:-45}
    };

     // Save data to the in-memory MongoDB
     const result2 = await AppConfigIndex.create(data2);

     // Retrieve data and check if it matches what we saved
     const retrievedData2 = await AppConfigIndex.findById(result2._id);
     t.deepEqual(retrievedData2.configKeyPair, data2.configKeyPair)
     t.deepEqual(retrievedData2.configKeyPair[2], -45)
})