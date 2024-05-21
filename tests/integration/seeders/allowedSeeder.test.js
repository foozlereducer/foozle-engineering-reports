import test from 'ava';
import { Allowed } from "../../../models/allowed.js";
import { AllowedSeeder } from "../../../seeders/allowed-seeder.js";
import { connectDB } from '../../../datatabase/db.js';

test("Allowed seeder runner", async t=> {
    const AL = new AllowedSeeder();
    connectDB();
    const allowedCount = await Allowed.countDocuments({}).exec();
    if ( 0 === allowedCount ) {
        await AL.seed();
    }
    
    t.true(true)
})
