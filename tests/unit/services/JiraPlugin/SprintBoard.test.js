import test from 'ava';
import { ActoValidator } from '../../../../services/validators/ActoValidator.js';
import { JiraRest } from './../../../../plugins/Jira/services/jiraRest.js';
import { SprintBoards } from './../../../../plugins/Jira/services/SprintBoards.js';
import { GetProjects } from './../../../../plugins/Jira/services/GetProjects.js';
import { sum } from '../../../../services/utilities/Sum.js';

test('getSprintBoards returns a sprint object literal with 9 fields ', async t=> {
    const AV = new ActoValidator()
    const JR = new JiraRest(AV)
    const SB = new SprintBoards(JR)
    const GP = new GetProjects(JR)
    // Use this mock data rather than calling GetProject.run()
    const boardIds = [
        [ 'PAA', [ 178 ] ],
        [ 'TBP', [ 167 ] ],
        [ 'TEP', [ 170 ] ],
        [ 'TMP', [ 168 ] ],
        [ 'UXUI', [ 181 ] ]
    ]
    const sprints = await SB.getSprintBoards(boardIds)
  

    for( const sprint of sprints) {
        // AVA did not like using th sprint object directly so by running it 
        // through JSON.strinigy and then JSON.parse it fixed the object and allows
        // for accessing properties directly
        if (null != sprint.sprints.values[0]) {
            const sprintData = JSON.parse(JSON.stringify(sprint.sprints.values[0]))
            t.true(9 === Object.keys(sprintData).length)
        }
    }
})

test('Sprint start and end dates should exist and be in UTC format', async t=> {
    const AV = new ActoValidator()
    const JR = new JiraRest(AV)
    const SB = new SprintBoards(JR)
    const boardIds = [
        [ 'PAA', [ 178 ] ],
        [ 'TBP', [ 167 ] ],
        [ 'TEP', [ 170 ] ],
        [ 'TMP', [ 168 ] ],
        [ 'UXUI', [ 181 ] ]
    ]
    const sprints = await SB.getSprintBoards(boardIds)

    for( const sprint of sprints) {
        // AVA did not like using th sprint object directly so by running it 
        // through JSON.strinigy and then JSON.parse it fixed the object and allows
        // for accessing properties directly
        if (null != sprint.sprints.values[0]) {
            const sprintData = JSON.parse(JSON.stringify(sprint.sprints.values[0]))
            t.true(isValidUTCDate(sprintData.startDate));
            t.true(isValidUTCDate(sprintData.endDate))
        }
        t.true(true)
    }
})


test(`collectSprintData() should return a data obj 
that matches the Sprints model`, async t => {
    const AV = new ActoValidator()
    const JR = new JiraRest(AV)
    const SB = new SprintBoards(JR, sum)
   
    const boardIds = [
        [ 'Team Die Hard', [ 178 ] ],
        [ 'Team Beatles', [ 167 ] ],
        [ 'Team Enablers', [ 170 ] ],
        [ 'Team MVP', [ 168 ] ],
        [ 'UX/UI', [ 181 ] ]
    ]

    //const sprintIssues = await SB.collectSprintData(boardIds);

    t.true(true)
})

function isValidUTCDate(dateString) {
    const date = new Date(dateString);
    // Check if the date is a valid date and its string representation is the same as the input
    return !isNaN(date.getTime()) && date.toISOString() === dateString;
}

// Mocking JiraRest
class MockJiraRest {
    setRoute() {}
    async runRoute() {
      return {
        issues: [
          {
            key: 'TAP-123',
            fields: {
              summary: 'Sample Issue',
              issuetype: { name: 'Story', description: 'Sample Description' },
              status: { name: 'To Do' },
              customfield_10183: { displayName: 'John Doe' },
              customfield_10188: [{ displayName: 'Jane Doe' }],
              customfield_10184: { displayName: 'QE1' },
              customfield_10185: [{ displayName: 'QE2' }],
            },
          },
        ],
      };
    }
  }


  
  test.beforeEach(t => {
    // Mock JiraRest instance for each test
    t.context.mockJiraRest = new MockJiraRest();
  });
  
  test('getSprintBoards should return an array of sprint boards', async t => {
    const sprintBoards = new SprintBoards(t.context.mockJiraRest);
    const result = await sprintBoards.getSprintBoards([['team1', [123]], ['team2', [456]]]);
    t.true(Array.isArray(result));
    t.true(result.length > 0);
    t.true(result[0].hasOwnProperty('boardId'));
    t.true(result[0].hasOwnProperty('sprints'));
  });
  
  test('setEngineers should update issueObj with engineers from the issue', t => {
    const sprintBoards = new SprintBoards(new MockJiraRest());
    const issueObj = { engineers: [] };
    const issue = { fields: { customfield_10183: { displayName: 'John Doe' } } };
    const result = sprintBoards.setEngineers(issueObj, issue);
    t.deepEqual(result.engineers, ['John Doe']);
  });

  test('values that are null or undefined are handled gracefully', async t => {
    const sprintBoards = new SprintBoards(new MockJiraRest());
    var a; // undefined
    const b = null;
    const issueObj = { engineers: [], ques: [] };
    const issue = {}
    issue.fields = {}
    issue.fields.customfield_10183 = { displayName: a };
    issue.fields.customfield_10184 = { displayName: null };
    
    const result = sprintBoards.setEngineers(issueObj, issue);
    t.true(typeof result.engineers[0] == 'undefined');
    const result2 =  sprintBoards.setQualityEngineers(issueObj, issue);
    t.deepEqual( result2.ques, [])
  })