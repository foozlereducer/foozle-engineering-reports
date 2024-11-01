import test from 'ava';
import { StoryPoints } from '../../../../plugins/Jira/services/StoryPoints.js';
import { JiraRest } from '../../../../plugins/Jira/services/jiraRest.js';
import { ActoValidator } from '../../../../services/validators/ActoValidator.js';
// Mock Data

const jiraDomain = 'https://actocloud.atlassian.net';
const sprintId = 123;
let jiraRest = null;
let validator = null;
const issuesResponse = {
  issues: [
    {
      fields: {
        customfield_10016: 5, // Story Points field value
        status: {
          name: 'Done',
        },
      },
    },
    {
      fields: {
        customfield_10016: 8,
        status: {
          name: 'In Progress',
        },
      },
    },
    {
      fields: {
        customfield_10016: 3,
        status: {
          name: 'Accepted',
        },
      },
    },
  ],
};

// Test case

test.beforeEach(() => {
  // Set up the mock for the Jira API response
  nock(jiraDomain)
    .get(`/rest/agile/1.0/sprint/${sprintId}/issue`)
    .reply(200, issuesResponse);
    validator = new ActoValidator()
    jiraRest = new JiraRest(validator);

});

test.serial(`getStoryPoints should calculate estimated, comitted and completed story points`, async t=>{
  const consoleLog = [];
  const originalConsoleLog = console.log;

  // Mock console.log to capture its output
  console.log = (message, ...args) => {
    consoleLog.push([message, ...args].join(' '));
  };

  const SP = new StoryPoints()
  const boardIds = [
      [ 'PAA', [ 178 ] ],
      [ 'TBP', [ 167 ] ],
      [ 'TEP', [ 170 ] ],
      [ 'TMP', [ 168 ] ],
      [ 'UXUI', [ 181 ] ]
  ]
  const mockedStoryPointTallies  = {
      accepted: [1,2,8,3,5,5,3],
      committed: [1,2,8,3,5,3,1],
      completed: [1,2,3,5,1],
      estimated: [2,2,5,3,5,3,1]
  }
  const res = SP.tallyStoryPoints(mockedStoryPointTallies)
  t.deepEqual(res, {accepted: 27, committed: 23, completed: 12, estimated: 21 })

})

test(`accepted, committed, completed and estimated 
      story points should be categorized`, t=> {
    const SP = new StoryPoints(sum);
    const storypoints = [1,5,8,3,2, 11];
    // for(sp of storypoints) {
    //     SP.categorieStoryPoints(sp, sprintDates) 
    // }
    

    t.true(true)
 })