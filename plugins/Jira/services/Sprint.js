import { JiraRest } from "./jiraRest.js";
import { config } from "./config.js";
import { Projects } from "../../../models/projects.js";

export class Sprint {
    constructor(JiraRestInstance) {
        // Ensure we have a Jira Rest instance passed
        if (JiraRestInstance instanceof JiraRest) {
            this.jr = JiraRestInstance; // Assign the passed instance, not the class
        } else {
            throw new Error('SprintCommitment requires a JiraRest instance as the first parameter');
        }
    }

    /**
     * 
     * @param {string} isCore - JSON either { core: true } or { core: false } defined as false 
     * will return all core plus non core projects.
     * @returns {array} - JSON project objects that contain key, name,  expertise, core, 
     * boardId and timestamps
     */
    async getProjects(isCore={ core: true }) {
        try {
          const coreProjects = await Projects.find(isCore);
          return coreProjects;
        } catch (error) {
            if ( true === core ) {
                console.error('Error finding core projects:', error);
            } else {
                console.error('Error finding projects', error);
            }
          
        }
    }

    async getBoardIds(Validator, isCore={ core: true }) {
        const projs = await this.getProjects(isCore);
        let boardIds = [];
        if (Validator.validate(projs).notEmpty()) {
            for(const proj of projs) {
                if ( proj.boardId[0]) {
                    boardIds.push(proj.boardId[0])
                }
            }
        }
        return boardIds;
    }

     /**
     * Get Sprints for the Board
     * Retrieve the sprints for a given board ID:
     * @param {number} boardId 
     * @returns 
     */
     async getSprint(boardId, queryParams = { state: 'active' }) {
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
            const response = await this.jr.call(fullUri);
            return response.issues;
        } catch (error) {
            console.error('Error fetching issues:', error);
            return [];
        }
    }

    async consolidateSprint(boardId) {
        const activeSprintRawObj = await this.getSprint(boardId);
        const activeSprint = activeSprintRawObj.values[0]
        const sprintId = activeSprint.id;
        const issues = await this.extractIssueData(sprintId);
        return issues;
    }

    async extractSprintDetails(boardId) {
        const activeSprintRawObj = await this.getSprint(boardId);
        console.log(activeSprintRawObj)

        return true;
    }

    async extractIssueData(sprintId) {
        const issues = await this.getIssuesInSprint(sprintId)
        return issues.map(issue => {
            return {
                id: issue.id,
                name: issue.fields.summary,
                link: issue.self,
                key: issue.key,
                assignee: issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned',
                engineer: issue.fields.customfield_10183 ? issue.fields.customfield_10183.displayName : 'N/A',
                qualityEngineer: issue.fields.qe ? issue.fields.qe.map(qe => qe.displayName).join(', ') : 'N/A',
                description: issue.fields.description,
                status: issue.fields.status ? issue.fields.status.name : 'Unknown',
                type: issue.fields.issuetype ? issue.fields.issuetype.name : 'Unknown',
                storyPoints: issue.fields.customfield_10023 || 0
            };
        });
    }

    /**
     * Get Sprint in a date range
     * @param {string} boardIds - JSON array of boardIds
     * @param {object} jiraRest - will handle the Jira auth and set / run routes
     * @param {string} jiraDomain - the base jira domain
     * @param {string} startDate - date formatted string like: '2024-01-01'
     * @param {string} endDate - date formatted string like: '2024-12-31'
     * @returns {array} Sprints - each full sprint objects
     */
    async getSprintsInRange(boardIds, jiraRest, jiraDomain, startDate, endDate) {
        try {
        let response;
        let filteredSprints;
        let Sprints = []
    
        for (const boardId of boardIds) {
            jiraRest.setRoute(`${jiraDomain}/rest/agile/1.0/board/${boardId}/sprint`);
            response = await jiraRest.runRoute();
        
            const sprints = response.data.values;
            // Filter sprints that fall within the given range
            filteredSprints = sprints.filter((sprint) => {
            const startDateObj = new Date(sprint.startDate);
            const endDateObj = new Date(sprint.endDate);
            return startDateObj >= new Date(startDate) && endDateObj <= new Date(endDate);
            });
    
            sprints.push(filteredSprints)
        }
        console.log('Filtered Sprints:', sprints);
        return sprints;
        } catch (error) {
        console.error('Error fetching sprints:', error.message);
        }
    }
}