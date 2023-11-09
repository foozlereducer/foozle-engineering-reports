import test from 'ava';
import { Issues } from '../../models/issues.js';

test("Validate should throw error with empty first_name field", async t => {
    const iS = new Issues();
    const except = async () => {
       throw new Error(await iS.save());
    }
    try {
        await except();
    } catch(e) {
        console.log(e.errors)
        t.deepEqual(
            'Path `first_name` is required.',
            e.errors.first_name.properties.message
        )
    }
});

test("Validate should throw error with empty last_name field", async t => {
    const iS = new Issues();
    const except = async () => {
       throw new Error(await iS.save());
    }
    try {
        await except();
    } catch(e) {
        t.deepEqual(
            'Path `last_name` is required.',
            e.errors.last_name.properties.message
        )
    }
});

test("Validate should throw error with empty team field", async t => {
    const iS = new Issues();
    const except = async () => {
       throw new Error(await iS.save());
    }
    try {
        await except();
    } catch(e) {
        t.deepEqual(
            'Path `team` is required.',
            e.errors.team.properties.message
        )
    }
});