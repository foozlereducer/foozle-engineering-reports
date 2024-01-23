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
        const boardIdIsArray = AV.validate(proj[1]).array()
        t.true(boardIdIsArray.pass)
        const boardIdIsNumber = AV.validate(proj[1][0]).num()
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
        const boardId = AV.validate(res[0]).array()
        t.true(boardId.pass);
})

