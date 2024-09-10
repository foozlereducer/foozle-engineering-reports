import mongoose from 'mongoose';
import { Company } from './company.js';

// Define a schema function to create the roles schema
async function createRolesSchema() {
    let companykeys = null;
    try {
         // If in test mode, mock the company keys
         if (process.env.NODE_ENV === 'test') {
            companykeys = ['ACTO', 'VL', 'QS']; // Mock keys for tests
        } else {
            // Fetch all company keys
            const companies = await Company.find({}, 'key');
            companykeys = companies.map(company => company.key);
        }

        // Define a schema
        const Schema = mongoose.Schema;
        /**
         * Roles Schema
         */
        const rolesSchema = new Schema({
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            },
            company: {
                type: String,
                enum: companykeys, // Dynamic enum based on company keys from the database
                required: true
            },
            role: {
                type: String,
                enum: ['engineer', 'qe', 'pm', 'designer', 'devOps', 'teamLead', 'manager', 'cto', 'cfo', 'ceo'],
                required: true
            }
        });

        return rolesSchema; // Return the schema instead of model directly
    } catch (error) {
        console.error('Error fetching company keys:', error);
        throw error; // Rethrow the error if needed
    }
}

// Define and export both the schema and the model
async function createRolesModel() {
    const rolesSchema = await createRolesSchema();
    const Roles = mongoose.model('Roles', rolesSchema);
    return { rolesSchema, Roles }; // Export both schema and model
}

// Get the Roles model and schema dynamically
const { rolesSchema, Roles } = await createRolesModel();

export { rolesSchema, Roles };

