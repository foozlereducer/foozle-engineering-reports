import { connectDB } from "../datatabase/db.js";
import { AppConfig } from "../models/appConfig.js";

export class AppConfigSeeder {
   
    async seed() {
        await connectDB();
        const res = await AppConfig.insertMany([
            {
                configKeyPair: {"FirebaseApiKey":"AIzaSyB7Pz8c1ROjSYUHk0WTH9Yo_Bmde0mkKcI"}
            },
            {
                configKeyPair: {"FirebaseAuthDomain": "engineering-reports.firebaseapp.com"}
            },
            {
                configKeyPair: {"FirebaseProjId" : "engineering-reports"}
            },
            {
                configKeyPair:{"FirebaseStorageBucket": "engineering-reports.appspot.com"}
            },
            {
                configKeyPair: {"FirebaseMsgSenderId": "664561984154"}
            },
            {
                configKeyPair: {"FirebaseAppId": "1:664561984154:web:23971fecb654bb3e8a7523"}
            },
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