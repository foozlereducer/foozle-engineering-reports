import { connectDB } from "../datatabase/db.js";
import { AppConfig } from "../models/appConfig.js";

export class AppConfigSeeder {
   
    async seed() {
        await connectDB();
        await AppConfig.insertMany([
            {
                configName: 'FirebaseApiKey',
                configValue: 'AIzaSyB7Pz8c1ROjSYUHk0WTH9Yo_Bmde0mkKcI'
            },
            {
                configName: 'FirebaseAuthDomain',
                configValue: '"engineering-reports.firebaseapp.com'
            },
            {
                configName: 'FirebaseProjId',
                configValue: 'engineering-reports'
            },
            {
                configName: 'FirebaseStorageBucket',
                configValue: 'engineering-reports.appspot.com'
            },
            {
                configName: 'FirebaseMsgSenderId',
                configValue: '664561984154'
            },
            {
                configName: 'FirebaseAppId',
                configValue: '1:664561984154:web:23971fecb654bb3e8a7523'
            }
           
        ])
    }
}