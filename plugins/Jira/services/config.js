import * as dotenv from 'dotenv';
dotenv.config();
export const config = {
    JIRA_API_BASE_URI: process.env.JIRA_API_BASE_URI || 'https://actocloud.atlassian.net/rest',
    JIRA_API_SPRINT_ISSUES_PATH: process.env.JIRA_API_SPRINT_ISSUES_PATH || '/agile/1.0/sprint/{sprintId}/issue'
}