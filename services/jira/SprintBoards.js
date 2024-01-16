export class SprintBoards {
    constructor(jiraRest,  basePath = 'https://actocloud.atlassian.net' ) {
        this.JiraRest = jiraRest;
        this.baseRoutePath = basePath;
        this.sprintBoards = [];
    }

    async getSprintBoards(boardIds) {
        for(const id of boardIds) {
            this.JiraRest.setRoute(this.baseRoutePath + `/rest/agile/1.0/board/${id}/sprint?state=active`);
            let sprints = await this.JiraRest.runRoute();

            this.sprintBoards.push({boardId: id, sprints: sprints})
        }

        return this.sprintBoards;
    }

} 