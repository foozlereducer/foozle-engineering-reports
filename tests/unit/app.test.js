import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../app.js'; // Adjust this path to the location of your app file
import * as dbModule from '../../datatabase/db.js';
import * as loggerModule from '../../services/logger.js';

test.beforeEach(() => {
  // Stub the connectDB and logger functions before each test
  sinon.stub(dbModule, 'connectDB').resolves();
  sinon.stub(loggerModule, 'logger').callsFake(() => {});
});

test.afterEach.always(() => {
  // Restore the original functionality after each test
  sinon.restore();
});

test('responds with 404 for unknown routes', async (t) => {
  const response = await request(app).get('/non-existent-route');
  t.is(response.status, 404);
  t.regex(response.text, /Route \/non-existent-route is not found/);
});

test('logs a 404 error for undefined routes', async (t) => {
  await request(app).get('/another-undefined-route');
  t.true(loggerModule.logger.calledWith(404, 'Route /another-undefined-route is not found'));
});
