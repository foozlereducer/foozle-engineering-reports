import { connectDB } from "../datatabase/db.js";
import { Company } from "../models/company.js";

export class CompanySeeder {
   
    async seed() {
        await connectDB();
        await Company.insertMany([
            {
                name: 'ACTO Inc.',
                key: 'ACTO',
            },
            {
                name: 'ValueLabs',
                key: 'VL',
            }, 
            {
                name: 'QASource',
                key: 'QS',
            },
        ])
    }
}