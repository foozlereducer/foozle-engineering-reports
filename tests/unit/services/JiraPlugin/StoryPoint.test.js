import test from 'ava';
import { JiraRest } from '../../../../plugins/Jira/services/jiraRest.js';
import { ActoValidator } from '../../../../services/validators/ActoValidator.js';
import { Sprint } from '../../../../plugins/Jira/services/Sprint.js';
import { getStoryPoints } from '../../../../plugins/Jira/services/StoryPoints.js'
import * as dotenv from 'dotenv';
dotenv.config();

const boardId = parseInt(process.env.JIRA_BOARD_ID);
let jr;
let Sp;

// Boundary values for tests
const MIN_BOARD_ID = 1;
const MAX_BOARD_ID = Number.MAX_SAFE_INTEGER;

const MIN_SPRINT_ID = 1;
const MAX_SPRINT_ID = Number.MAX_SAFE_INTEGER;

test.beforeEach(t => {
    jr = new JiraRest(new ActoValidator());
    Sp = new Sprint(jr);
    t.context.mockSprint = createMockSprint([]);
});

test.afterEach(() => {
    jr = null;
    Sp = null;
});

// Helper Function to Create Mock Sprint
function createMockSprint(issues) {
    return {
        getSprint: async () => ({
            data: { issues }
        })
    };
}

test('getStoryPoints should return an object with the correct keys', async t => {
  const result = await getStoryPoints(t.context.mockSprint, boardId, new MockStoryPointCalculator());
  t.deepEqual(
    Object.keys(result), ['estimatedPoints', 'committedPoints', 'completedPoints', 'acceptedPoints']);
});

test('getStoryPoints should calculate estimated points correctly', async t => {
  t.context.mockSprint = createMockSprint([
      {
          fields: {
              customfield_10016: 5
          }
      },
      {
          fields: {
              customfield_10016: 3
          }
      }
  ]);

  const result = await getStoryPoints(t.context.mockSprint, boardId, new MockStoryPointCalculator());
  t.is(result.estimatedPoints, 8);
});

test('getStoryPoints should calculate completed, committed, and accepted points correctly', async t => {
  t.context.mockSprint = createMockSprint([
      {
          fields: {
              customfield_10016: 5,
              status: {
                  name: 'Done'
              }
          }
      },
      {
          fields: {
              customfield_10016: 3,
              status: {
                  name: 'Accepted'
              }
          }
      },
      {
          fields: {
              customfield_10016: 8,
              status: {
                  name: 'In Progress'
              }
          }
      }
  ]);

  const result = await getStoryPoints(t.context.mockSprint, boardId, new MockStoryPointCalculator());
  t.is(result.committedPoints, 16);
  t.is(result.completedPoints, 5);
  t.is(result.acceptedPoints, 3);
});

test('getStoryPoints should handle empty response data gracefully', async t => {
  const result = await getStoryPoints(t.context.mockSprint, boardId, new MockStoryPointCalculator());
  t.is(result.estimatedPoints, 0);
  t.is(result.committedPoints, 0);
  t.is(result.completedPoints, 0);
  t.is(result.acceptedPoints, 0);
});

test('getStoryPoints should ignore issues with null story points', async t => {
  t.context.mockSprint = createMockSprint([
      {
          fields: {
              customfield_10016: null,
              status: {
                  name: 'Done'
              }
          }
      },
      {
          fields: {
              customfield_10016: 5,
              status: {
                  name: 'In Progress'
              }
          }
      }
  ]);

  const result = await getStoryPoints(t.context.mockSprint, boardId, new MockStoryPointCalculator());
  t.is(result.estimatedPoints, 5);
  t.is(result.committedPoints, 5);
  t.is(result.completedPoints, 0);
  t.is(result.acceptedPoints, 0);
});

test('getStoryPoints should use StoryPointCalculator to calculate points', async t => {
  const mockSprint = createMockSprint([
      {
          fields: {
              customfield_10016: 5,
              status: {
                  name: 'Done'
              }
          }
      },
      {
          fields: {
              customfield_10016: 3,
              status: {
                  name: 'Accepted'
              }
          }
      }
  ]);

  const calculatorInstance = new MockStoryPointCalculator();
  const result = await getStoryPoints(mockSprint, boardId, calculatorInstance);
  t.is(result.estimatedPoints,8);
  t.is(result.committedPoints, 8);
  t.is(result.completedPoints, 5);
  t.is(result.acceptedPoints, 3);
});

class MockStoryPointCalculator {
  constructor(issues = []) {
    this.issues = issues;
  }

  setIssues(issues) {
    this.issues = issues;
  }

  calculate() {
    return this.issues.reduce(
      (acc, issue) => {
        const storyPoints = issue.fields?.customfield_10016;
        const status = issue.fields?.status?.name;

        if (storyPoints != null) {
          acc.estimatedPoints += storyPoints;
          acc.committedPoints += storyPoints;

          if (this.isCompleted(status)) {
            acc.completedPoints += storyPoints;
          }

          if (this.isAccepted(status)) {
            acc.acceptedPoints += storyPoints;
          }
        }

        return acc;
      },
      {
        estimatedPoints: 0,
        committedPoints: 0,
        completedPoints: 0,
        acceptedPoints: 0,
      }
    );
  }

  isCompleted(status) {
    return status === 'Done';
  }

  isAccepted(status) {
    return status === 'Accepted';
  }
}
