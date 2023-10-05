const mongoose = require('mongoose') ;
const dotenv = require('dotenv')
dotenv.config()

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    return 'Connected to MongoDB'
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
    return JSON.stringify(`Error connecting to MongoDB: ${error}`)
  }
 };

module.exports = connectDB;
