import express from 'express';
import { radioRouter } from '../../../routes/radio.js'; // Ensure correct relative path

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api', radioRouter);
  return app;
};

export { createTestApp };
