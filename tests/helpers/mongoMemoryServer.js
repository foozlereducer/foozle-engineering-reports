import test from 'ava';
// tests/helpers/mongoMemoryServer.js
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

export const connectToMongoMemoryServer = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

export const disconnectFromMongoMemoryServer = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
};

test('MongoMemoryServer is MongoMemoryServer', async t=>{
    t.true(true)
})
