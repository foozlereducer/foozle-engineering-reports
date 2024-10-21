import test from 'ava';
import { ensureAuthenticated } from '../../../middleware/ensureAuthenticated.js';

// Unit test for ensureAuthenticated middleware
test('ensureAuthenticated allows access if user is authenticated', t => {
  // Arrange: Mock req, res, and next
  const req = {
    isAuthenticated: () => true // Simulate authenticated user
  };
  const res = {
    redirect: t.fail // If redirect is called, the test should fail
  };
  const next = () => {
    t.pass(); // If next() is called, the test should pass
  };

  // Act: Call the middleware
  ensureAuthenticated(req, res, next);
});

test('ensureAuthenticated redirects to /login if user is not authenticated', t => {
  // Arrange: Mock req, res, and next
  const req = {
    isAuthenticated: () => false // Simulate unauthenticated user
  };
  const res = {
    redirect: (url) => {
      t.is(url, '/login'); // Check if redirect is called with '/login'
      t.pass(); // If redirect is called with correct URL, the test should pass
    }
  };
  const next = t.fail; // If next is called, the test should fail

  // Act: Call the middleware
  ensureAuthenticated(req, res, next);
});
