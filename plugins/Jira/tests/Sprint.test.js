import test from 'ava';
import { JiraRest } from '../services/jiraRest.js';
import { ActoValidator } from '../../../services/validators/ActoValidator.js';
import { Sprint } from '../services/Sprint.js';

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
    const res = await Sp.getSprint(167);
    t.true(res.values.length > 0);

    const activeSprint = res.values[0];
    t.is(activeSprint.state, 'active');
    t.is(activeSprint.id, 982);
    t.is(activeSprint.self, "https://actocloud.atlassian.net/rest/agile/1.0/sprint/982");
    t.is(activeSprint.originBoardId, 167);
});

test('getIssuesInSprint(sprintId) should return the issues in the active sprint for board 167', async t => {
    const res = await Sp.getSprint(167);
    const sprintId = res.values[0].id;
    const issues = await Sp.getIssuesInSprint(sprintId);
    
    t.true(issues.length > 0);

    // Validate the structure of the first issue
    const firstIssue = issues[0];
    t.true(typeof firstIssue.id === 'string');
    t.true(typeof firstIssue.key === 'string');
    t.true(typeof firstIssue.fields === 'object');
    t.truthy(firstIssue.fields.summary);
});
