import test from 'ava';
import { JiraRest } from '../services/jiraRest.js';
import { ActoValidator } from '../../../services/validators/ActoValidator.js';
import { Sprint } from '../services/Sprint.js';
import * as dotenv from 'dotenv';
dotenv.config();

const boardId = parseInt(process.env.JIRA_BOARD_ID);
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
    const res = await Sp.getSprint(boardId);
    t.true(res.values.length > 0);

    const activeSprint = res.values[0];
    t.is(activeSprint.state, 'active');
    t.is(typeof activeSprint.id, "number");
    t.true(activeSprint.id > 982)
    t.true(activeSprint.self.includes("https://actocloud.atlassian.net/rest/agile/1.0/sprint/"));
    t.is(activeSprint.originBoardId, boardId);
});

test('getIssuesInSprint(boardId) should return the issues in the active sprint for board 167', async t => {
    const res = await Sp.getSprint(boardId);
    const sprintId = res.values[0].id;
    const issues = await Sp.getIssuesInSprint(sprintId);
    
    t.true(issues.length > 0);

    // Validate the structure of the first issue
    const firstIssue = issues[0];
    t.true(typeof firstIssue.id === 'string');
    t.true(typeof firstIssue.key === 'string');
    t.true(typeof firstIssue.fields === 'object');
    t.truthy(firstIssue.fields.summary.length > 0);
});

test('extractIssueData should get extracted sets of data', async t => {
    const res = await Sp.getSprint(boardId);
    const sprintId = res.values[0].id;
    const issues = await Sp.extractIssueData(sprintId);
    t.true(issues.length > 0);
    const firstissue = issues[0]
    t.truthy(firstissue.id );
    t.truthy(firstissue.name);
    t.truthy(firstissue.link);
    t.truthy(firstissue.key);
    t.truthy(firstissue.assignee);
    t.truthy(firstissue.engineer);
    t.truthy(firstissue.qualityEngineer);
    t.truthy(firstissue.description);
    t.truthy(firstissue.status);
    t.truthy(firstissue.type);
    t.true(typeof firstissue.storyPoints === "number")
})

test(
    'extractSprintDetails(boardId) should get the extracted data that meets the Sprint schema',
    async t => {
        const res = await Sp.extractSprintDetails(boardId) 
        t.true(res);
})
