import { Projects } from '../../../models/Jira/projects.js';
import { connectDB } from '../../../datatabase/db.js';

export class GetProjects {
    isCore;

    constructor(
        jiraRest, 
        baseRoutePath = 'https://actocloud.atlassian.net', 
        isCore = true
    ) {
        this.JiraRest = jiraRest;
        this.baseRoutePath = baseRoutePath;
        this.isCore = isCore;
    }
    /**
     * Run - connects to mongo atlas and retrieves the stored projects
     * @returns 
     */
    async run() {
        connectDB()
        const projects = await Projects.find({})
        
        const targetBoardIds = [];
        for(let proj of projects) {
            
            if ( true === this.isCore) {
                if (true === proj.core) {
                    targetBoardIds.push([proj.name, proj.boardId, proj.key])

                }
            } else {
                targetBoardIds.push([proj.name, proj.boardId, proj.key])
            }
        }

       return targetBoardIds;
    }

    /**
     * Set isCore - flag that determines if the results will be core ACTO projects
     * or not
     * @param {boolean} - true to set it as being core, false to set for all projects
     * to return
     */
    setIsCore(isCore) {
        if(isCore !== typeof 'boolean') {
                isCore = true;
        }
        this.isCore = isCore;
    }
}