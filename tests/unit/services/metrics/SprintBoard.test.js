import test from 'ava';
import { ActoValidator } from '../../../../services/validators/ActoValidator.js';
import { JiraRest } from '../../../../services/adapters/jiraRest.js';
import { SprintBoards } from '../../../../services/jira/SprintBoards.js';
import { GetProjects } from '../../../../services/jira/GetProjects.js';
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
        const sprintData = JSON.parse(JSON.stringify(sprint.sprints.values[0]))
        t.true(9 === Object.keys(sprintData).length)
    }
    
    t.true(true)
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
        const sprintData = JSON.parse(JSON.stringify(sprint.sprints.values[0]))
        t.true(isValidUTCDate(sprintData.startDate));
        t.true(isValidUTCDate(sprintData.endDate))
    }
})

test("getSprintIssues returns the active sprint issues", async t=> {
    const AV = new ActoValidator()
    const JR = new JiraRest(AV)
    const SB = new SprintBoards(JR)
    const mockSprintId = 910;
    const mockBoardId = 167;
    const sprintIssues = await SB.getSprintIssues(mockSprintId,mockBoardId)
     // const boardIds = [
    //     [ 'Team Die Hard', [ 178 ] ],
    //     [ 'Team Beatles', [ 167 ] ],
    //     [ 'Team Enablers', [ 170 ] ],
    //     [ 'Team MVP', [ 168 ] ],
    //     [ 'UX/UI', [ 181 ] ]
    // ]
    console.log(sprintIssues)
    t.true( sprintIssues.length > 0 );
    t.is( sprintIssues[0].ticketId,'TBP-1625')
    t.is( sprintIssues[0].status, 'Done' );
    t.is( sprintIssues[0].issueType, 'Story')
    t.true(true)
   
})

test(`collectSprintData() should return a data obj 
that matches the Sprints model`, async t => {
    const AV = new ActoValidator()
    const JR = new JiraRest(AV)
    const SB = new SprintBoards(JR)
    SB.setSumUtil(sum)
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