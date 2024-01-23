export class GetSprintDataJob {
    projectIds;

    constructor() {
        this.projectIds = [];
    }

    async getProjects(GetProjects) {
        return await GetProjects.run()
    }

    async getProjectIds(GetProjects) {
        const projs = await this.getProjects(GetProjects)
        for(const proj of projs) {
            if(Array.isArray(proj) && 3 == proj.length ) {
                this.projectIds.push(proj[1])
            }
        }
        return this.projectIds;
    }

    async getSprints(SprintBoards) {

    }
}