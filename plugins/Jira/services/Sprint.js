import { JiraRest } from "./jiraRest.js";
import { config } from "./config.js";
import { Projects } from "../../../models/projects.js";
import { connectDB } from "../../../datatabase/db.js";
import { StoryPointCalculator } from "./StoryPoints.js";
import { getStoryPoints } from "./StoryPoints.js";

export class IssueTransformer {
    static transform(issue) {
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
    }
}

export class Sprint {
    constructor(jiraRest, issueTransformer = IssueTransformer, storyPointCalculatorInstance = new StoryPointCalculator()) {
        if (!(jiraRest instanceof JiraRest)) {
            throw new Error('Sprint requires a valid JiraRest instance');
        }
        this.jiraRest = jiraRest;
        this.transformer = issueTransformer; // Assign the transformer to a property
        this.storyPointCalculator = storyPointCalculatorInstance; // Assign story point calculator
    }

    async getProjects(isCore = { core: true }) {
        try {
            const coreProjects = await Projects.find(isCore);
            return coreProjects;
        } catch (error) {
            console.error('Error finding projects:', error);
            throw error;
        }
    }

    async getBoardIds(validator, isCore = { core: true }) {
        const projects = await this.getProjects(isCore);
        if (!validator.validate(projects).notEmpty()) {
            return [];
        }
        return projects.map(proj => proj.boardId[0]).filter(boardId => boardId !== undefined);
    }

    async getSprint(boardId, queryParams = { state: 'active' }) {
        const fullUri = this._constructUri(`/agile/1.0/board/${boardId}/sprint`, queryParams);
        const response = await this.jiraRest.call(fullUri);
        if (!response.values || response.values.length === 0) {
            throw new Error(`No sprints found for board ${boardId}`);
        }
        return response;
    }

    async getIssuesInSprint(sprintId, queryParams = {}) {
        const uriPath = config.JIRA_API_SPRINT_ISSUES_PATH.replace('{sprintId}', sprintId);
        const fullUri = this._constructUri(uriPath, queryParams);
        const response = await this.jiraRest.call(fullUri);
        return Array.isArray(response.issues) ? response.issues : [];
    }

    async consolidateSprint(boardId) {
        const activeSprint = (await this.getSprint(boardId)).values?.[0];
        if (!activeSprint) return [];
        return await this.extractIssueData(activeSprint.id);
    }

    async extractSprintDetails(boardId) {
        return await this.getSprint(boardId);
    }

    async extractIssueData(sprintId) {
        const issues = await this.getIssuesInSprint(sprintId);
        return issues.map(issue => this.transformer.transform(issue));
    }

    async getSprintsInRange(boardIds, startDate, endDate) {
        const promises = boardIds.map(boardId => this.getSprint(boardId));
        const results = await Promise.allSettled(promises);

        let sprints = [];
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                if (result.value && result.value.values && Array.isArray(result.value.values)) {
                    const filtered = result.value.values.filter(sprint => {
                        const sprintStartDate = new Date(sprint.startDate);
                        const sprintEndDate = new Date(sprint.endDate);
                        const filterStartDate = new Date(startDate);
                        const filterEndDate = new Date(endDate);

                        sprintStartDate.setHours(0, 0, 0, 0);
                        sprintEndDate.setHours(0, 0, 0, 0);
                        filterStartDate.setHours(0, 0, 0, 0);
                        filterEndDate.setHours(0, 0, 0, 0);

                        return sprintStartDate <= filterEndDate && sprintEndDate >= filterStartDate;
                    });

                    sprints.push(...filtered);
                } else {
                    console.warn('Unexpected structure in result.value:', result.value);
                }
            } else {
                console.warn('Promise rejected:', result.reason);
            }
        });

        return sprints;
    }

    async getStoryPointsForSprintsInRange(boardIds, startDate, endDate, calculatorClass = this.storyPointCalculator, logger = console) {
        try {
            // Fetch sprints in the range provided
            const sprintsInRange = await this.getSprintsInRange(boardIds, startDate, endDate);
            
            // Initialize total story points with all categories
            let totalStoryPoints = {
                estimatedPoints: 0,
                committedPoints: 0,
                completedPoints: 0,
                acceptedPoints: 0,
            };

            // Iterate over each sprint
            for (let sprint of sprintsInRange) {
                const issuesInSprint = await this.getIssuesInSprint(sprint.id);
               
                // Iterate over issues to calculate points
                for (let issue of issuesInSprint) {
                    const storyPoints = issue.fields.customfield_10023 || 0;
    
                    // Add to estimated points
                    totalStoryPoints.estimatedPoints += storyPoints;
    
                    // Add to committed points if status is 'To Do', 'In Progress', or 'Done'
                    if (['To Do', 'In Progress', 'Done'].includes(issue.fields.status.name)) {
                        totalStoryPoints.committedPoints += storyPoints;
                    }
    
                    // Add to completed points if status is 'Done'
                    if (issue.fields.status.name === 'Done') {
                        totalStoryPoints.completedPoints += storyPoints;
                    }
    
                    // Add to accepted points if status is 'Accepted'
                    if (issue.fields.status.name === 'Accepted') {
                        totalStoryPoints.acceptedPoints += storyPoints;
                    }
                }
            }
    
            return totalStoryPoints;
        } catch (error) {
            logger.error('Error fetching story points:', error);
            throw error;
        }
    }    
    
    _constructUri(uriPath, queryParams) {
        const jiraBaseUri = process.env.JIRA_API_BASE_URI;
        const queryString = new URLSearchParams(queryParams).toString();
        return `${jiraBaseUri}${uriPath}${queryString ? '?' + queryString : ''}`;
    }

    _handleProjects(isCore, projectsFunction) {
        connectDB;
        return projectsFunction(isCore).catch(error => {
            console.error('Error finding projects:', error);
            throw error;
        });
    }
}
