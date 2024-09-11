import test from 'ava';
import { Company } from '../../../../models/company.js';
import { CompanySeeder } from '../../../../seeders/company-seeder.js';
import { connectDB } from '../../../../datatabase/db.js';

test("Company seeder runner", async t=> {
    const CS = new CompanySeeder();
    connectDB();
    const count = await Company.countDocuments({}).exec();
    if ( 0 === count ) {
        await CS.seed();
    }
    
    t.true(true)
})