import { connectDB } from "../datatabase/db.js";
import { AppConfig } from "../models/appConfig.js";

export class AppConfigSeeder {
   
    async seed() {
        await connectDB();
        const res = await AppConfig.insertMany([
            {
                configKeyPair: {"RoleTypes": 
                    ['engineer', 
                    'qualityEngineer', 
                    'projectManager', 
                    'designer', 
                    'devOps', 
                    'teamLead', 
                    'manager', 
                    'director',
                    'cto', 
                    'cfo', 
                    'ceo']
                }
            }
           
        ])

        console.log('AppConfigSeeder results')
        console.log(res)
        return res;
    }
}