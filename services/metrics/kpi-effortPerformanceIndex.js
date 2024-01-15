import { connectDB } from '../../datatabase/db.js';
import { effortPerformanceIndex } from '../../models/effortPerformanceIndex.js';
import { Projects } from '../../models/Jira/projects.js';

export class KpiEffortPerformanceIndex {
    constructor(jiraRest, MergeObjects, baseRoutePath = 'https://actocloud.atlassian.net', isCore = true) {
        this.JiraRest = jiraRest;
        this.baseRoutePath = baseRoutePath;
        this.MergeObjects = MergeObjects;
        this.completedStoryPoints = [];
        this.committedStoryPoints = [];
        this.isCore = isCore
    }
    
    /**
     * Setter isCore - flag that determines if the results will be core ACTO projects
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

    calculate() {
        this.getData(this.isCore)
    }
    /**
     * 
     * @param {boolean} isCore - if true then it should filter only isCore projects.
     * @returns 
     */
    async getProjectIds() {
        connectDB()
        const projects = await Projects.find({})
        const targetBoardIds = [];
        for(let proj of projects) {
            const name = proj.name.replace('Team ', '')
            if (true === this.isCore) {
                if( true === proj.isCore) {
                    targetBoardIds.push({name: name, boardId: proj.boardId})
                }
            } else {
                targetBoardIds.push({name: name, boardId: proj.boardId})
            }
        }
       return targetBoardIds;
    }

    sum(arrOfNumbers) {
        if (
            "undefined" === typeof arrOfNumbers || 
            null === arrOfNumbers ||
            false === Array.isArray(arrOfNumbers) ||
            0 === arrOfNumbers.length
        ) {
            arrOfNumbers = [0,0];
        }


        return arrOfNumbers.reduce((x,y) => {
            if( typeof x !== 'number') {
                x = 0;
            }
            if( typeof y != 'number') {
                y = 0;
            }
            return x+y;
        })
    }

    async getSprints(boards) {
        this.JiraRest.setRoute(this.baseRoutePath + `/rest/agile/1.0/board/${boards.boardId}/sprint?state=active`);
        return await this.JiraRest.runRoute();
    }

    async getDataCollected(activeSprints, boards) {
        const dataCollection = []
        
        for ( const sprint of activeSprints.values) {
            if (sprint.originBoardId === boards.boardId){
                sprint.team = boards.name;
                // Get the sprint issues
                this.JiraRest.setRoute(this.baseRoutePath + `/rest/agile/1.0/sprint/${sprint.id}/issue?fields=status,issuetype,customfield_10023`);
                const data = await this.JiraRest.runRoute();
              
                for( const issue of data.issues) {
                    if(isNaN(issue.fields.customfield_10023)) {
                        issue.fields.customfield_10023 = 0.0
                    }
                    // customfield_10023 === story point field
                    if( 
                        issue.fields.status.name === 'Done' ||
                        issue.fields.status.name === 'Ready To Release'
                    ) {
                        this.completedStoryPoints.push(issue.fields.customfield_10023) 
                       
                    } else {
                        this.committedStoryPoints.push(issue.fields.customfield_10023) 
                    }
                   
                    dataCollection.push(sprint)
                }
            }
        }
        let done = this.sum(this.completedStoryPoints)
        let committed = done + this.sum(this.committedStoryPoints)
    
        dataCollection.completedStoryPoints = done;
        dataCollection.committedStoryPoints = committed;
        dataCollection.effortPerformanceIndex = ((committed / done) * 100)
        return dataCollection;
    }

    async getData() {
        let dataCollection = [];
        const targetBoards = await this.getProjectIds(true);
        
        for ( const boards of targetBoards ) {
            let sprints = await this.getSprints(boards)
            dataCollection = await this.getDataCollected(sprints, boards)
            
        }
        console.log(dataCollection)
        return dataCollection
    }
}