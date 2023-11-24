import test from 'ava';
import { Sprints } from '../../models/sprints.js';

test("Validate should throw all validation errors with none of the required issue fields set", async t => {
    const s = new Sprints();
    const except = async () => {
       throw new Error(await s.save());
    }
    try {
        await except();
    } catch(e) {
        const errors = JSON.stringify(e);
        t.true(errors.includes('`endDate` is required."'));
        t.true(errors.includes('`startDate` is required."'));
        t.true(errors.includes('`name` is required."'));
    }
});