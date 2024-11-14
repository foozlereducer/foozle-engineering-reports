import { JiraRest } from "./jiraRest.js";
import { config } from "./config.js";
import { Projects } from "../../../models/projects.js";
import { connectDB } from "../../../datatabase/db.js";
import { StoryPoints } from "./StoryPoints.js";
import { StoryPointCalculator } from "./StoryPointCalculator.js";

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
    constructor(jiraRest, issueTransformer = IssueTransformer, storyPointsInstance = new StoryPoints(new StoryPointCalculator())) {
        if (!(jiraRest instanceof JiraRest)) {
            throw new Error('Sprint requires a valid JiraRest instance');
        }
        this.jiraRest = jiraRest;
        this.transformer = issueTransformer;
        this.storyPoints = storyPointsInstance; // Assigning the StoryPoints instance to this.storyPoints
        // Status sets for different types
        this.statusSets = {
            committed: new Set(),
            completed: new Set(),
            accepted: new Set(),
        };
    }

    addStatuses(type, statuses) {
        if (this.statusSets[type]) {
            statuses.forEach(status => this.statusSets[type].add(status));
        } else {
            throw new Error(`Invalid status type: ${type}`);
        }
    }

    validateStatuses() {
        for (const [type, set] of Object.entries(this.statusSets)) {
            if (set.size === 0) {
                throw new Error(`Status set for type '${type}' is empty. Please add necessary statuses.`);
            }
        }
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
        let sprints = [];
        try {
            const promises = boardIds.map(boardId => this.getSprint(boardId).catch(error => ({ error, boardId })));
            const results = await Promise.allSettled(promises);
    
            results.forEach(result => {
                if (result.status === 'fulfilled' && !result.value.error) {
                    if (result.value && result.value.values && Array.isArray(result.value.values)) {
                        const filtered = this.filterSprintsByDate(result.value.values, startDate, endDate);
                        sprints.push(...filtered);
                    } else {
                        console.warn('Unexpected structure in result.value:', result.value);
                    }
                } else if (result.status === 'fulfilled' && result.value.error) {
                    console.warn(`No sprints found for board ${result.value.boardId}:`, result.value.error.message);
                } else {
                    console.warn('Promise rejected:', result.reason);
                }
            });
        } catch (e) {
            console.error('Error processing sprints:', e);
        }
        return sprints;
    }
    
    filterSprintsByDate(sprints, startDate, endDate) {
        const filterStartDate = new Date(startDate);
        const filterEndDate = new Date(endDate);
        filterStartDate.setHours(0, 0, 0, 0);
        filterEndDate.setHours(0, 0, 0, 0);
    
        return sprints.filter(sprint => {
            const sprintStartDate = new Date(sprint.startDate);
            const sprintEndDate = new Date(sprint.endDate);
            sprintStartDate.setHours(0, 0, 0, 0);
            sprintEndDate.setHours(0, 0, 0, 0);
    
            return sprintStartDate <= filterEndDate && sprintEndDate >= filterStartDate;
        });
    }
    async getTotalStoryPointsForSprintsInRange(boardIds, startDate, endDate, logger = console) {
        try {
            // Validate if all status sets are correctly populated
            this.validateStatuses();
    
            // Fetch sprints in the range provided
            const sprintsInRange = await this.getSprintsInRange(boardIds, startDate, endDate);
    
            // Delegate the calculation of total story points to the StoryPoints instance
            if (this instanceof Sprint) {
                return await this.storyPoints.calculateTotalStoryPoints(this, sprintsInRange, logger);
            } else {
                throw 'this is not of type Sprint';
            }
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