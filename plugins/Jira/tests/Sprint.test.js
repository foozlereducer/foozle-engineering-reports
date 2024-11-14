import test from 'ava';
import sinon from 'sinon';
import { JiraRest } from '../services/jiraRest.js';
import { ActoValidator } from '../../../services/validators/ActoValidator.js';
import { Sprint, IssueTransformer } from '../services/Sprint.js';
import { StoryPointCalculator } from '../services/StoryPointCalculator.js';
import * as dotenv from 'dotenv';
dotenv.config();

let jr;
let Sp;

// Boundary values for tests
const MIN_BOARD_ID = 1;
const MAX_BOARD_ID = Number.MAX_SAFE_INTEGER;

test.beforeEach(t => {
    jr = new JiraRest(new ActoValidator());
    const issueTransformer = IssueTransformer;  // Use IssueTransformer directly as it's a static class
    Sp = new Sprint(jr, issueTransformer);  // Pass instances to Sprint
    
    // Set in context
    t.context.jiraRest = jr;
    t.context.Sp = Sp;
    t.context.sprintInstance = Sp;  // Set this to maintain consistency
});

test.afterEach(() => {
    sinon.restore(); // Restore any stubbed or spied functions to their original behavior
    jr = null;
    Sp = null;
});

test('Sprint should set the jiraRest property if an instance of JiraRest is passed', t => {
    t.true(t.context.Sp.jiraRest instanceof JiraRest);
});

test('Sprint should not throw an error if a JiraRest instance is passed', t => {
    t.notThrows(() => {
        new Sprint(t.context.jiraRest);
    });
});

test('getSprint should return data in the correct format', async t => {
    const mockGetSprint = sinon.stub(t.context.jiraRest, 'call').resolves({
        values: [{ id: 123, state: 'active', self: 'https://example.com/123' }]
    });

    const res = await t.context.Sp.getSprint(123);
    t.is(res.values.length, 1);
    t.is(res.values[0].id, 123);

    mockGetSprint.restore();
});

test('Should throw error if statuses are not properly defined', async t => {
    const sprintInstance = t.context.sprintInstance;

    await t.throwsAsync(
        async () => {
            await sprintInstance.getTotalStoryPointsForSprintsInRange([123], '2024-01-01', '2024-02-28');
        },
        {
            instanceOf: Error,
            message: /Status set for type .* is empty/,
        }
    );
});

test('Should not throw error if statuses are properly defined', async t => {
    const sprintInstance = t.context.sprintInstance;
    sprintInstance.addStatuses('committed', ['To Do', 'In Progress']);
    sprintInstance.addStatuses('completed', ['Done']);
    sprintInstance.addStatuses('accepted', ['Accepted']);

    // Mocking the responses
    const mockGetSprintsInRange = sinon.stub(sprintInstance, 'getSprintsInRange').resolves([]);
    const totalStoryPoints = await sprintInstance.getTotalStoryPointsForSprintsInRange([123], '2024-01-01', '2024-02-28');

    // Assert the expected empty story points
    t.deepEqual(totalStoryPoints, {
        estimatedPoints: 0,
        committedPoints: 0,
        completedPoints: 0,
        acceptedPoints: 0,
    });

    // Restore the mocked methods
    mockGetSprintsInRange.restore();
});

test('getTotalStoryPointsForSprintsInRange should calculate story points correctly', async t => {
    const sprintInstance = t.context.sprintInstance;

    // Properly define the statuses
    sprintInstance.addStatuses('committed', [
        'To Do',
        'In Progress',
        'Done',
        'Completed',
        'Released Into Pre-Production',
        'Ready For Release'
    ]);
    sprintInstance.addStatuses('completed', [
        'Done',
        'Completed',
        'Released Into Pre-Production',
        'Ready For Release'
    ]);
    sprintInstance.addStatuses('accepted', ['Accepted']);

    // Mocking the responses
    const mockGetSprintsInRange = sinon.stub(sprintInstance, 'getSprintsInRange').resolves([
        {
            id: 123,
            startDate: '2024-01-01T00:00:00Z',
            endDate: '2024-01-15T00:00:00Z',
            getIssuesInSprint: async () => [
                { id: 'ISSUE-1', fields: { customfield_10023: 5, status: { name: 'Done' } } }
            ]
        }
    ]);

    const totalStoryPoints = await sprintInstance.getTotalStoryPointsForSprintsInRange([123], '2024-01-01', '2024-02-28');

    t.deepEqual(totalStoryPoints, {
        estimatedPoints: 5,
        committedPoints: 5,
        completedPoints: 5,
        acceptedPoints: 0,
    });

    // Restore the mocked methods
    mockGetSprintsInRange.restore();
});
