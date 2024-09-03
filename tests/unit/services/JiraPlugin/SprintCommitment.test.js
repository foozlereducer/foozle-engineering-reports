import test from 'ava';
import { JiraRest } from '../../../../plugins/Jira/services/jiraRest.js';
import { ActoValidator } from '../../../../services/validators/ActoValidator.js'
import { SprintCommitment } from '../../../../plugins/Jira/services/SprintCommitment.js';

test('SprintCommitment should set the jr property if an instance of JiraRest is passed', t => {
    const jr = new JiraRest(new ActoValidator());
    const SP = new SprintCommitment(jr);
    t.true(SP.jr instanceof JiraRest);
});

test('SprintCommitment should not throw an error if a JiraRest instance is passed', t => {
    const jr = new JiraRest(new ActoValidator());
    t.notThrows(() => {
       const SP = new SprintCommitment(jr);
    });
});

test('SprintCommitment should fetch an active sprint on board 167', async t => {
    const validator = new ActoValidator();
    const jr = new JiraRest(validator);
    const SP = new SprintCommitment(jr);

    // Only pass the boardId, the rest is handled by the getSprints method
    const res = await SP.getSprints(167);
    t.true(res.values.length > 0);

    const activeSprint = res.values[0];
    t.is(activeSprint.state, 'active')
    t.true(activeSprint.id > 982)
    t.true(activeSprint.self.includes("https://actocloud.atlassian.net/rest/agile/1.0/sprint"))
    t.is(activeSprint.originBoardId, 167)
});

test('getIssuesInSprint(sprintId) should return the issues in the active sprint for board 167', async t => {
    const validator = (new ActoValidator());
    const jr = new JiraRest(validator);
    const SP = new SprintCommitment(jr);
    const boardId = 167;
    const res = await SP.getSprints(boardId);
    const sprintId = res.values[0].id;
    const issues = await SP.getIssuesInSprint(sprintId, {})
    t.true(issues.length > 0);

    // Validate the structure of the first issue
    const firstIssue = issues[0];
    t.true(typeof firstIssue.id === 'string');
    t.true(typeof firstIssue.key === 'string');
    t.true(typeof firstIssue.fields === 'object');
    t.truthy(firstIssue.fields.summary);
})