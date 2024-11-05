import { JiraRest } from "./jiraRest.js";
import { config } from "./config.js";
import { Projects } from "../../../models/projects.js";

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
    constructor(jiraRest, issueTransformer = IssueTransformer) {
        if (!(jiraRest instanceof JiraRest)) {
            throw new Error('Sprint requires a valid JiraRest instance');
        }
        this.jiraRest = jiraRest;
        this.transformer = issueTransformer;
    }

    async getProjects(isCore = { core: true }) {
        return await this._handleProjects(isCore, Projects.find);
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
        return await this.jiraRest.call(fullUri);
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
                const filtered = result.value.values.filter(sprint => {
                    const startDateObj = new Date(sprint.startDate);
                    const endDateObj = new Date(sprint.endDate);
                    return startDateObj >= new Date(startDate) && endDateObj <= new Date(endDate);
                });
                sprints.push(...filtered);
            }
        });

        return sprints;
    }

    _constructUri(uriPath, queryParams) {
        const jiraBaseUri = process.env.JIRA_API_BASE_URI;
        const queryString = new URLSearchParams(queryParams).toString();
        return `${jiraBaseUri}${uriPath}${queryString ? '?' + queryString : ''}`;
    }

    _handleProjects(isCore, projectsFunction) {
        return projectsFunction(isCore).catch(error => {
            console.error('Error finding projects:', error);
            throw error;
        });
    }
}