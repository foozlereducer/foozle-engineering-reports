import test from 'ava';
import { Projects } from '../../../../models/Jira/projects.js';
import { ProjectsSeeder } from '../../../../services/metrics/projects-seeder.js';
import { connectDB } from '../../../../datatabase/db.js';

test("Project seeder runner", async t=> {
    const PS = new ProjectsSeeder();
    connectDB();
    const projCount = await Projects.countDocuments({}).exec();
    if ( 0 === projCount ) {
        await PS.seed();
    }
    
    t.true(true)
})

test("true is true", t=>{
    t.true(true)
})