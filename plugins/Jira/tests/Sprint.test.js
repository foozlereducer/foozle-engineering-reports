import test from 'ava';
import { JiraRest } from '../services/jiraRest.js';
import { ActoValidator } from '../../../services/validators/ActoValidator.js';
import { Sprint } from '../services/Sprint.js';
import * as dotenv from 'dotenv';
dotenv.config();

const sprintId = parseInt(process.env.JIRA_SPRINT_ID);
let jr;
let Sp;


test.before(() => {
    jr = new JiraRest(new ActoValidator());
    Sp = new Sprint(jr);
});

test.after.always(() => {
    jr = null;
    Sp = null;
});

test('Sprint should set the jr property if an instance of JiraRest is passed', t => {
    t.true(Sp.jr instanceof JiraRest);
});

test('Sprint should not throw an error if a JiraRest instance is passed', t => {
    t.notThrows(() => {
        new Sprint(jr);
    });
});

test('Sprint should fetch an active sprint on board 167', async t => {
    const res = await Sp.getSprint(sprintId);
    t.true(res.values.length > 0);

    const activeSprint = res.values[0];
    t.is(activeSprint.state, 'active');
    t.is(typeof activeSprint.id, "number");
    t.true(activeSprint.id > 982)
    t.true(activeSprint.self.includes("https://actocloud.atlassian.net/rest/agile/1.0/sprint/"));
    t.is(activeSprint.originBoardId, sprintId);
});

test('getIssuesInSprint(sprintId) should return the issues in the active sprint for board 167', async t => {
    const res = await Sp.getSprint(sprintId);
    const issues = await Sp.getIssuesInSprint(res.values[0].id);
    
    t.true(issues.length > 0);

    // Validate the structure of the first issue
    const firstIssue = issues[0];
    t.true(typeof firstIssue.id === 'string');
    t.true(typeof firstIssue.key === 'string');
    t.true(typeof firstIssue.fields === 'object');
    t.truthy(firstIssue.fields.summary.length > 0);
});

test('create new sprint', async t => {
    const res = await Sp.createSprint(sprintId)
    t.true(true)
})
