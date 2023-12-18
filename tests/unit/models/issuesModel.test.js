import test from 'ava';
import { Issues } from '../../../models/issues.js';

test("Validate should throw all validation errors with none of the required issue fields set", async t => {
    const iS = new Issues();
    const except = async () => {
       throw new Error(await iS.save());
    }
    try {
        await except();
    } catch(e) {
        const errors = JSON.stringify(e);
        t.true(errors.includes('`description` is required.'));
        t.true(errors.includes('`issueName` is required.'));
        t.true(errors.includes('`ticketId` is required.'));
        t.true(errors.includes('`team` is required.'));
        t.true(errors.includes("`issueRole` is required. There must be at least one role added to each issue"));
        t.true(errors.includes("`the estimated story point field` is required, either 0, 1, 2, 3, 5, 8, or 13"));
    }
});