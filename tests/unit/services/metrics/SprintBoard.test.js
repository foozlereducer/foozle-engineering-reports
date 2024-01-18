import test from 'ava';
import { ActoValidator } from '../../../../services/validators/ActoValidator.js';
import { JiraRest } from '../../../../services/adapters/jiraRest.js';
import { SprintBoards } from '../../../../services/jira/SprintBoards.js';
import { GetProjects } from '../../../../services/jira/GetProjects.js';

test('dsjdjf', async t=> {
    const AV = new ActoValidator()
    const JR = new JiraRest(AV)
    const GP = new GetProjects(JR)
    const SB = new SprintBoards(JR)
    const boardIds = await GP.run()
    const sprints = await SB.getSprintBoards(boardIds)
  

    for( const sprint of sprints) {
        // AVA did not like using th sprint object directly so by running it 
        // through JSON.strinigy and then JSON.parse it fixed the object and allows
        // for accessing properties directly
        const sprintData = JSON.parse(JSON.stringify(sprint.sprints.values[0]))
        console.log(sprintData)
    }
    

    t.true(true)
})

test('Sprint start and end dates should exist and be in UTC format', async t=> {
    const AV = new ActoValidator()
    const JR = new JiraRest(AV)
    const SB = new SprintBoards(JR)
    const GP = new GetProjects(JR)
    const boardIds = await GP.run()
    const sprints = await SB.getSprintBoards(boardIds)
    console.log('sprints', sprints)

    for( const sprint of sprints) {
        // AVA did not like using th sprint object directly so by running it 
        // through JSON.strinigy and then JSON.parse it fixed the object and allows
        // for accessing properties directly
        const sprintData = JSON.parse(JSON.stringify(sprint.sprints.values[0]))
        t.true(isValidUTCDate(sprintData.startDate));
        t.true(isValidUTCDate(sprintData.endDate))
    }
})

function isValidUTCDate(dateString) {
    const date = new Date(dateString);
    // Check if the date is a valid date and its string representation is the same as the input
    return !isNaN(date.getTime()) && date.toISOString() === dateString;
}