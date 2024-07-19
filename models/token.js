import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  sessionId: { type: String, required: true},
  token: { type: String, required: true },
  user: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: '4h' } // Token expires after 4 hours
});

export const TokenModel = mongoose.model('Token', tokenSchema);