import test from 'ava';
import { GetSprintDataJob } from '../../../../services/jira/GetSprintDataJob.js';
import { GetProjects } from '../../../../services/jira/GetProjects.js';
import { SprintBoards } from '../../../../services/jira/SprintBoards.js';
import { ActoValidator } from '../../../../services/validators/ActoValidator.js';
import { JiraRest } from '../../../../services/adapters/jiraRest.js';


test('Should get all jira projects', async t=>{
    const AV = new ActoValidator()
    const JR = new JiraRest(AV)
    const GP = new GetProjects(JR)
    const GSDJ = new GetSprintDataJob();
    const res = await GSDJ.getProjects(GP)
    for(const proj of res) {
        t.true(Array.isArray(proj))
        const nameIsString = AV.validate(proj[0]).String()
        t.true(nameIsString.pass)
        const projIdIsNum = AV.validate(proj[1]).num()
        t.true(projIdIsNum.pass)
        t.true(proj.length > 0)
    }
})

test(`GetSprintDataJob.getProjectId() Should get all 
      jira projects ids as an array of numbers`, async t=> {
        const AV = new ActoValidator()
        const JR = new JiraRest(AV)
        const GP = new GetProjects(JR)
        const GSDJ = new GetSprintDataJob();
        const res = await GSDJ.getProjectIds(GP)
        t.true(Array.isArray(res))
        const idNumOfDigits = (''+res[0]).length; 
        t.true(3 === idNumOfDigits)
        const projIdNum = AV.validate(res[0]).num()
        t.true(projIdNum.pass);
        t.true(true)    
})

test('Should get all active sprints', async t=> {
    const AV = new ActoValidator()
    const JR = new JiraRest(AV)
    const GP = new GetProjects(JR)
    const GSDJ = new GetSprintDataJob();
    const SB = new SprintBoards(JR)
    const boardIds = await GSDJ.getProjectIds(GP)
    const sprints = await SB.getSprintBoards(boardIds)
    let i = 0;
    for( const sprint of sprints) {
        console.log(sprint )
        i++;
    }
    

    t.true(true)
})