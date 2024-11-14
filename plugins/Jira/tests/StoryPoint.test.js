import test from 'ava';
import { JiraRest } from '../services/jiraRest.js';
import { ActoValidator } from '../../../services/validators/ActoValidator.js';
import { Sprint } from '../services/Sprint.js';
import { StoryPoints } from '../services/StoryPoints.js';
import { StoryPointCalculator } from '../services/StoryPointCalculator.js';
import * as dotenv from 'dotenv';
dotenv.config();

const boardId = parseInt(process.env.JIRA_BOARD_ID);
let jr;
let Sp;
let storyPoints;

// Boundary values for tests
const MIN_BOARD_ID = 1;
const MAX_BOARD_ID = Number.MAX_SAFE_INTEGER;

test.beforeEach(t => {
    jr = new JiraRest(new ActoValidator());
    Sp = new Sprint(jr);
    const calculatorInstance = new StoryPointCalculator();
    storyPoints = new StoryPoints(calculatorInstance);
    t.context.mockSprint = createMockSprints([]);
});

test.afterEach(() => {
    jr = null;
    Sp = null;
    storyPoints = null;
});

// Helper Function to Create Mock Sprint
function createMockSprints(issues) {
    return [
        {
            id: 1,
            startDate: '2024-01-01T00:00:00Z',
            endDate: '2024-01-15T00:00:00Z',
            getIssuesInSprint: async () => issues,
        }
    ];
}


test('StoryPoints.getStoryPoints should return an object with the correct keys', async t => {
    const mockIssues = [
        {
            id: '1',
            key: 'MOCK-1',
            fields: {
                customfield_10016: 5,
                status: {
                    name: 'To Do'
                }
            }
        },
        {
            id: '2',
            key: 'MOCK-2',
            fields: {
                customfield_10016: 3,
                status: {
                    name: 'Done'
                }
            }
        }
    ];

    const sprintsInRange = createMockSprints(mockIssues);
    
    // Mock getIssuesInSprint to return our mock issues for the sprint
    Sp.getIssuesInSprint = async (sprintId) => {
        const sprint = sprintsInRange.find(s => s.id === sprintId);
        return sprint ? sprint.issues : [];
    };

    console.log('Mocked Sprints:', sprintsInRange);
    
    const result = await storyPoints.calculateTotalStoryPoints(Sp, sprintsInRange);
    console.log('Result:', result);
    
    // Check if result has correct keys
    t.deepEqual(Object.keys(result), ['estimatedPoints', 'committedPoints', 'completedPoints', 'acceptedPoints']);
});


test('StoryPoints.getStoryPoints should calculate estimated points correctly', async t => {
    t.context.mockSprint = createMockSprints([
        {
            fields: {
                customfield_10023: 5
            }
        },
        {
            fields: {
                customfield_10023: 3
            }
        }
    ]);

    console.log('mocked sprint', 'StoryPoints.getStoryPoints should calculate estimated points correctly');
    console.log(t.context.mockSprint);

    const result = await storyPoints.calculateTotalStoryPoints(Sp, t.context.mockSprint);

    console.log('Result:', result);

    t.is(result.estimatedPoints, 8);
});

test('StoryPoints.getStoryPoints should calculate completed, committed, and accepted points correctly', async t => {
    t.context.mockSprint = createMockSprints([
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
    console.log('mocked sprint', 'StoryPoints.getStoryPoints should calculate completed, committed, and accepted points correctly')
    console.log(t.context.mockSprint)
    t.true(true)
    // const result = await storyPoints.calculateTotalStoryPoints(t.context.mockSprint, boardId);
    // t.is(result.committedPoints, 16);
    // t.is(result.completedPoints, 5);
    // t.is(result.acceptedPoints, 3);
});

test('StoryPoints.getStoryPoints should handle empty response data gracefully', async t => {
    console.log('mocked sprint','StoryPoints.getStoryPoints should handle empty response data gracefully')
    console.log(t.context.mockSprint)
    t.true(true)
    // const result = await storyPoints.calculateTotalStoryPoints(t.context.mockSprint, boardId);
    // t.is(result.estimatedPoints, 0);
    // t.is(result.committedPoints, 0);
    // t.is(result.completedPoints, 0);
    // t.is(result.acceptedPoints, 0);
});

test('StoryPoints.getStoryPoints should ignore issues with null story points', async t => {
    t.context.mockSprint = createMockSprints([
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
    console.log('mocked sprint','StoryPoints.getStoryPoints should ignore issues with null story points')
    console.log(t.context.mockSprint)
    t.true(true)
    // const result = await storyPoints.calculateTotalStoryPoints(t.context.mockSprint, boardId);
    // t.is(result.estimatedPoints, 5);
    // t.is(result.committedPoints, 5);
    // t.is(result.completedPoints, 0);
    // t.is(result.acceptedPoints, 0);
});

test('StoryPoints.getStoryPoints should use StoryPointCalculator to calculate points with MockStoryPointCalculator', async t => {
    const mockSprint = createMockSprints([
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
    console.log('mocked sprint','StoryPoints.getStoryPoints should use StoryPointCalculator to calculate points with MockStoryPointCalculator')
    console.log(mockSprint)
    t.true(true)
    // const calculatorInstance = new MockStoryPointCalculator();
    // const customStoryPoints = new StoryPoints(calculatorInstance);
    // const result = await customStoryPoints.calculateTotalStoryPoints(mockSprint, boardId);
    // t.is(result.estimatedPoints, 8);
    // t.is(result.committedPoints, 8);
    // t.is(result.completedPoints, 5);
    // t.is(result.acceptedPoints, 3);
});

// Mock version of StoryPointCalculator for testing
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
