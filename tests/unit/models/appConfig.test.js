import test from 'ava';
import { connectDB } from '../../../datatabase/db.js';
import { AppConfigSeeder } from '../../../seeders/appConfig-seeder.js';
import { AppConfig } from '../../../models/appConfig.js';

test("AppConfig seeder runner", async t=> {
    const ACS = new AppConfigSeeder();
    connectDB();
    const acsCount = await AppConfig.countDocuments({}).exec();
    if ( 0 === acsCount ) {
        await ACS.seed();
    }
    
    t.true(true)
})

test("true is true", t=>{
    t.true(true)
})