import test from 'ava';
import { JiraRest } from '../../../../plugins/Jira/services/jiraRest.js';
import { ActoValidator } from '../../../../services/validators/ActoValidator.js';
import { Temporal } from '@js-temporal/polyfill';

test('JiraRoute.setRoute() expects a defined route', async t => {
    const validator = new ActoValidator()
    const jr = new JiraRest(validator);
    try {
        jr.setRoute()
    } catch(e) {
        t.is(e.statusCode, 204)
        t.is(e.message, 'The value passed into validate is empty, it needs a value to test')
    }
})

test('JiraRest.setRoute() expects a the route to be a string', async t => {
    const validator = new ActoValidator()
    const jr = new JiraRest(validator);
    try {
        jr.setRoute(3)
    } catch(e) {
        t.is(e.statusCode, 406);
        t.is(e.message, 'Expect checked value to be a string, number given');
    }
})

test('JiraRest.setRoute() should have a default httpMethod', async t=>{
    const validator = new ActoValidator()
    const jr = new JiraRest(validator);
    jr.setRoute('/abc');
    t.is(jr.httpMethod, 'GET')
    t.is(jr.route, '/abc')
})

test('JiraRest.runRoute() should get the issues for ACTO sprint 910', async t=>{
    const validator = new ActoValidator()
    const jr = new JiraRest(validator);
    jr.setRoute('https://actocloud.atlassian.net/rest/agile/1.0/sprint/910/issue', 'GET')
    const res = await jr.runRoute();
    const valres = validator.validate(res).notEmpty()
    t.true(valres.pass)
    for ( const targetIssue of res.issues ) {
        if ('Incremental Sync Strategy in DWH' === targetIssue.fields.summary) {
            t.is(targetIssue.fields.summary, 'Incremental Sync Strategy in DWH')
        }
    }
})

test('JiraRest.call() should get the issues for ACTO sprint 910', async t=>{
    const validator = new ActoValidator()
    const jr = new JiraRest(validator);
    const res = await jr.call('https://actocloud.atlassian.net/rest/agile/1.0/sprint/910/issue', 'GET')
    const valres = validator.validate(res).notEmpty()
    t.true(valres.pass)
    for ( const targetIssue of res.issues ) {
        if ('Incremental Sync Strategy in DWH' === targetIssue.fields.summary) {
            t.is(targetIssue.fields.summary, 'Incremental Sync Strategy in DWH')
        }
    }
})
