import { connectDB } from "../datatabase/db.js";
import { Allowed } from "../models/allowed.js";

export class AllowedSeeder {
   
    async seed() {
        await connectDB();
        const res = await Allowed.insertMany(
            [
                {
                    email: 'foozlereducers@gmail.com'
                },
                {
                    email: 'steve@actoapp.com'
                },
            ]
        )

        console.log('AllowedSeeder results')
        console.log(res)
        return res;
    }
}