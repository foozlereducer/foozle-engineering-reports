import test from 'ava';
import { JiraRest } from '../../../services/adapters/jiraRest.js';
import { ActoValidator } from '../../../services/validators/ActoValidator.js';
import { Temporal } from '@js-temporal/polyfill';
import jsonwebtoken from 'jsonwebtoken';

test('JiraRoute.setRoute() expects a defined route', async t => {
    const validator = new ActoValidator()
    const jr = new JiraRest(validator);
    try {
        jr.setRoute()
    } catch(e) {
        t.is(e.statusCode, 204)
        t.is(e.message, 'notEmpty(val): the value passed into validate is empty, it needs a value to test')
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

test(
    'JiraRest.getExpiry() should return a Unix timestamp 30 seconds or more in the future.',
    async t => {
        const validator = new ActoValidator()
        const jr = new JiraRest(validator);
        const now = Temporal.Now.instant().epochSeconds;
        const expiry = jr.getExpiry()
        const timeDiffIs30orSlightlyMoreSeconds = getTimeDiff(expiry.futureTime, now)
        t.true(timeDiffIs30orSlightlyMoreSeconds)
    }
)
/**
 * Get the time difference between two unix timestamps
 * This is a test helper function to make the test mor readable
 * @param {number} expiry 
 * @param {number} now 
 * @return bool 
 */
function getTimeDiff(expiry, now) {
    const timeDifMs = (expiry - now) * 1000;
    const timeDifference = timeDifMs / 1000;
    return (timeDifference >= 30 && timeDifference < 31)
    }

test('generateToken() returns a jwt object', async t=> {
    const validator = new ActoValidator()
    const jr = new JiraRest(validator);
    jr.setRoute('https://actocloud.atlassian.net/rest/agile/1.0/sprint/892/issue')
    const req = jr.generateToken();
    // check for 2 periods
    t.true((req.match(/\./g).length == 2))
    const jwtParts = req.split(".")
    t.true(jwtParts[0].length == 36)
    t.true(jwtParts[1].length === 147)
    t.true(jwtParts[2].length === 43)
    const isVerifiedToken = jsonwebtoken.verify(req, process.env.JIRA_SECRET)
    // verifies the issuer
    t.is(isVerifiedToken.iss, 'issuer-val');
    // the query string hashed token that would not show if verified() failed
    t.is(isVerifiedToken.qsh, '8a9f032cdfa6da88d521cba3026e51406c2e9565cf22bade7a7fa1f71da1c4a2')
})