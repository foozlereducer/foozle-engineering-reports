import { AppConfig } from '../models/appConfig.js';
import { connectDB } from '../datatabase/db.js';

export class GetAppConfig {
    constructor() {
        this.connected = false;
    }

    /**
     * Connect to the database only once
     */
    async connect() {
        if (!this.connected) {
            await connectDB();
            this.connected = true;
        }
    }

    /**
     * Run - connects to MongoDB Atlas and retrieves the stored configuration
     * @returns {Promise<Array>} Array of configuration objects
     */
    async run() {
        await this.connect();
        return await AppConfig.find({});
    }

    /**
     * Find a value by key in the configuration data
     * Adjusted to match the configKeyPair structure
     * @param {Array} data - Array of configuration documents
     * @param {String} key - The key to find the value for
     * @returns {Array|null} - The value corresponding to the key, or null if not found
     */
    findValueByKey(data, key) {
        for (const item of data) {
            if (item.configKeyPair && item.configKeyPair.hasOwnProperty(key)) {
                return item.configKeyPair[key];
            }
        }
        return null; // Key not found
    }

    /**
     * Get a specific configuration value by key
     * @param {String} key - The key to find in the configuration
     * @returns {Array|null} - The value corresponding to the key, or null if not found
     */
    async byKey(key) {
        const res = await this.run();
        return this.findValueByKey(res, key);
    }
}
