import test from 'ava';
import { getSprintVelocity } from "../services/getSprintVelocity.js";

test('calculates total story points from completed issues', t => {
  const fakeIssues = [
    { customFields: [{ name: 'Story Points', value: { name: '5' } }] },
    { customFields: [{ name: 'Story Points', value: { name: '3' } }] },
    { customFields: [{ name: 'Story Points', value: null }] }, // should be ignored
  ];

  const result = getSprintVelocity(fakeIssues);
  t.is(result, 8);
});