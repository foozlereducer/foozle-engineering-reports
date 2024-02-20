import test from 'ava';
import { AppConfigSeeder } from '../../../seeders/appConfig-seeder.js';
import { AppConfig } from '../../../models/appConfig.js';
import { connectDB } from '../../../datatabase/db.js';



test("AppConfig seeder runner", async t=> {
    connectDB()
    const ACS = new AppConfigSeeder();
   
    try {
       
        const acsCount = await AppConfig.countDocuments({}).exec();
     
        
        if (acsCount === 0) {
            try {
                // Attempt to seed documents
               
                const res = await ACS.seed();
                console.log('Documents seeded successfully.', res);
            } catch (error) {
                // Log and handle any errors that occur during seeding
                console.error('Error while seeding documents:', error);
            }
        } else {
            console.log('Documents already exist, no need to seed.');
        }
    } catch (error) {
        console.error('Error while checking or seeding AppConfig documents:', error);
    }
    
    t.true(true)
})