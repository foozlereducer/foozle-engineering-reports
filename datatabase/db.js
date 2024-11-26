import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { logger } from '../services/logger.js';
dotenv.config()

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

const mongoDBConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('Successfully connected to MongoDB Atlas');
  } catch (error) {
      console.error('Error connecting to MongoDB Atlas:', error);
  }
}

 export const connectDB =  await mongoDBConnect;

 const mongoDBDisconnect = async () => {
  try {
    await mongoose.disconnect(process.env.DATABASE_URI);
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.log('Error disconnecting the MongoDB:', error);
    logger(500, 'Error disconnecting the MongoDB:', 'crit', error  )
    return JSON.stringify(`Error disconnecting the MongoDB: ${error}`)
  }
 };

 export const disconnectDB =  mongoDBDisconnect;