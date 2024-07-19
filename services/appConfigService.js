import { AppConfig } from "../models/appConfig.js";
import { connectDB } from "../datatabase/db.js";

export class GetAppConfig {
    /**
     * Run - connects to mongo atlas and retrieves the stored projects
     * @returns 
     */
    async run() {
        connectDB()
        return await AppConfig.find({});
    }

    findValueByKey(data, key) {
        for (const item of data) {
            if (item.configKeyPair.hasOwnProperty(key)) {
                return item.configKeyPair[key];
            }
        }
        return null; // Key not found
    };
}