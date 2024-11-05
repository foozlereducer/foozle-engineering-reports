import test from 'ava';
import sinon from 'sinon';
import { JiraRest } from '../services/jiraRest.js';
import { ActoValidator } from '../../../services/validators/ActoValidator.js';
import { Sprint, IssueTransformer} from '../services/Sprint.js';
import * as dotenv from 'dotenv';
dotenv.config();

let jr;
let Sp;

// Boundary values for tests
const MIN_BOARD_ID = 1;
const MAX_BOARD_ID = Number.MAX_SAFE_INTEGER;

test.beforeEach(t => {
    jr = new JiraRest(new ActoValidator());
    Sp = new Sprint(jr);
    t.context.jiraRest = jr;
    t.context.sprintInstance = Sp;
});

test.afterEach(() => {
    sinon.restore(); // Restore any stubbed or spied functions to their original behavior
    jr = null;
    Sp = null;
});

test('Sprint should set the jiraRest property if an instance of JiraRest is passed', t => {
    t.true(t.context.sprintInstance.jiraRest instanceof JiraRest);
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

    const res = await t.context.sprintInstance.getSprint(1);
    t.is(res.values.length, 1);
    t.is(res.values[0].id, 123);

    mockGetSprint.restore();
});

test('getIssuesInSprint should return the issues in the active sprint', async t => {
    const mockGetIssues = sinon.stub(t.context.jiraRest, 'call').resolves({
        issues: [{ id: 'ISSUE-1', fields: { summary: 'Test issue' } }]
    });

    const issues = await t.context.sprintInstance.getIssuesInSprint(1);
    t.true(Array.isArray(issues));
    t.is(issues.length, 1);
    t.is(issues[0].id, 'ISSUE-1');

    mockGetIssues.restore();
});

test('extractIssueData should transform issue data correctly', async t => {
    const mockExtractIssues = sinon.stub(t.context.jiraRest, 'call').resolves({
        issues: [{ id: 'ISSUE-1', fields: { summary: 'Test issue', customfield_10023: 5 } }]
    });

    const transformed = await t.context.sprintInstance.extractIssueData(1);
    t.true(Array.isArray(transformed));
    t.is(transformed.length, 1);
    t.is(transformed[0].id, 'ISSUE-1');
    t.is(transformed[0].storyPoints, 5);

    mockExtractIssues.restore();
});

test('consolidateSprint should consolidate sprint data correctly', async t => {
    const mockGetSprint = sinon.stub(t.context.jiraRest, 'call').resolves({
        values: [{ id: 123, state: 'active', self: 'https://example.com/123' }]
    });
    const mockExtractIssueData = sinon.stub(t.context.sprintInstance, 'extractIssueData').resolves([
        { id: 'ISSUE-1', fields: { summary: 'Test issue', customfield_10023: 5 } }
    ]);

    const result = await t.context.sprintInstance.consolidateSprint(1);
    t.true(Array.isArray(result));
    t.is(result.length, 1);
    t.is(result[0].id, 'ISSUE-1');

    mockGetSprint.restore();
    mockExtractIssueData.restore();
});

test('getSprintsInRange should return sprints within the date range', async t => {
    const mockGetSprint = sinon.stub(t.context.jiraRest, 'call').resolves({
        values: [
            { id: 123, startDate: '2024-01-01T00:00:00Z', endDate: '2024-01-15T00:00:00Z' },
            { id: 124, startDate: '2024-02-01T00:00:00Z', endDate: '2024-02-15T00:00:00Z' }
        ]
    });

    const result = await t.context.sprintInstance.getSprintsInRange([1], '2024-01-01', '2024-01-31');
    t.is(result.length, 1);
    t.is(result[0].id, 123);

    mockGetSprint.restore();
});