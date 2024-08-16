import { JiraRest } from "./jiraRest.js";
import { config } from "./config.js";

export class Sprints {
    constructor(JiraRestInstance) {
        // Ensure we have a Jira Rest instance passed
        if (JiraRestInstance instanceof JiraRest) {
            this.jr = JiraRestInstance; // Assign the passed instance, not the class
        } else {
            throw new Error('SprintCommitment requires a JiraRest instance as the first parameter');
        }
    }
     /**
     * Get Sprints for the Board
     * Retrieve the sprints for a given board ID:
     * @param {number} boardId 
     * @returns 
     */
     async getSprints(boardId, queryParams = { state: 'active' }) {
        try {
            const jiraBaseUri = process.env.JIRA_API_BASE_URI;
            const uriPath = `/agile/1.0/board/${boardId}/sprint`;

            // Handle query parameters
            const queryString = new URLSearchParams(queryParams).toString();
            const fullUri = `${jiraBaseUri}${uriPath}${queryString ? '?' + queryString : ''}`;

            const response = await this.jr.call(fullUri);

            return response;
        } catch (error) {
            console.error('Error fetching sprints:', error);
            return [];
        }
    }
   
    /**
     * Get Issues in the Identified Sprint
     * Retrieve issues for a given sprint ID that will be used to get the story points:
     * @param {number} sprintId 
     * @returns 
     */
    async getIssuesInSprint(sprintId, queryParams = {}) {
        try {
            // Replace placeholders in the URI pattern with actual values
            const uriPath = config.JIRA_API_SPRINT_ISSUES_PATH.replace('{sprintId}', sprintId);
            // Construct the full URI with the base and path
            const uri = `${config.JIRA_API_BASE_URI}${uriPath}`;
              // Handle query parameters
            const queryString = new URLSearchParams(queryParams).toString();
            const fullUri = `${uri}${queryString ? '?' + queryString : ''}`;
            console.log(fullUri)
            const response = await this.jr.call(fullUri);
            return response.issues;
        } catch (error) {
            console.error('Error fetching issues:', error);
            return [];
        }
    }
}