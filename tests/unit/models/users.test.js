import test from 'ava';
import mongoose from "mongoose";
import { userSchema } from '../../../models/Users.js';
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

test('User model can save and retrieve data', async t=> {
    const userIndex = mongoose.model('userIndex', userSchema);
    // non encrypted password: zio7Gn8GQe9Mzp
    const data = {
        userName: 'foozle',
        email: 'foo@bar.com',
        password: 'zio$2a$12$9ps1aFAApyWC9qz3cPz64uwGNr5B0tM49KgNyjhjl7r6idQ/o92zCGn8GQe9Mzp',
    };

    // Save data to the in-memory MongoDB
    const result = await userIndex.create(data);

    // Retrieve data and check if it matches what we saved
    const retrievedData = await userIndex.findById(result._id);
    t.is(retrievedData.userName,'foozle')
    t.is(retrievedData.email, 'foo@bar.com')
    t.is(retrievedData.password, 'zio$2a$12$9ps1aFAApyWC9qz3cPz64uwGNr5B0tM49KgNyjhjl7r6idQ/o92zCGn8GQe9Mzp');
})
