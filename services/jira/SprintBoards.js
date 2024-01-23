import { MergeObjs } from "../utilities/MergeObjects.js";
import { sum } from "../utilities/Sum.js";
export class SprintBoards {
    sum;

    constructor(jiraRest,  basePath = 'https://actocloud.atlassian.net', ) {
        this.JiraRest = jiraRest;
        this.baseRoutePath = basePath;
        this.sprintBoards = [];
        this.completedStoryPoints = [];
        this.committedStoryPoints = [];
      
    }
    setSumUtil(sum) {
        this.sum = sum;
    }

    async getSprintBoards(boardIds) {
        for(const id of boardIds) {
            this.JiraRest.setRoute(this.baseRoutePath + `/rest/agile/1.0/board/${id[1][0]}/sprint?state=active`);
            let sprints = await this.JiraRest.runRoute();
            this.sprintBoards.push({
                boardId: id[1][0], 
                sprints: sprints,
            })

        }

        return this.sprintBoards;
    }
    getBoardIdsOnly(boardIds) {
        let boardIdsOnly = []
        for(const obj of boardIds) {
            boardIdsOnly.push(obj[1][0]);
        }
        return boardIdsOnly;
    }

    setEngineersOrQEs(issueObj, issue, isEng = true) {
        if (true === isEng) {
            // customfield_10188 == engineer (is array of objects)
            // customfield_10183 = engineer
            issueObj.engineers.push(issue.fields.customfield_10183.displayName)
            if(Array.isArray(issue.fields.customfield_10188)) {
                for(engineerData of issue.fields.customfield_10188) {
                    engineerData.displayName
                    if (-1 ===  issueObj.engineers.indexOf(engineerData.displayName)) {
                        issueObj.engineers.push(engineerData.displayName)
                    }
                }
            } else {
                issueObj.engineers.push(issue.fields.customfield_10188.displayName)
            }
        } else {
            // customfield_10184 == qe 
            // customfield_10185 == qes (is an array of objects)
            issueObj.qes.push(issue.fields.customfield_10184.displayName)
            if(Array.isArray(issue.fields.customfield_10185)) {
                for(qeData of issue.fields.customfield_10185) {
                    qeData.displayName
                    if (-1 ===  issueObj.qes.indexOf(qeData.displayName)) {
                        issueObj.qes.push(qeData.displayName)
                    }
                }
            } else {
                issueObj.qes.push(issue.fields.customfield_10188.displayName)
            }
        }
        return issueObj
    }
    async getSprintIssues(sprintId, boardId) {
        const sprintIssues = []

        // customfield_10023 == story point
        // customfield_10188 == engineer (is array of objects)
        // customfield_10183 = engineer
        // customfield_10184 == qe 
        // customfield_10185 == qes (is an array of objects)
        this.JiraRest.setRoute(
            this.baseRoutePath + 
            `/rest/agile/1.0/board/${boardId}/sprint/${sprintId}/issue?
            fields=summary,status,issuetype,
            customfield_10023,customfield_10183,assignee,customfield_10184,
            customfield_10185,customfield_10188,, customfield_10020`
        );
        
        const data =  await this.JiraRest.runRoute();
     
        for( const issue of data.issues) {
            if( boardId === issue.fields.customfield_10020[0].boardId ) {
                const iss = this.getIssueShell();
                iss.ticketId = issue.key;
                iss.issueName = issue.fields.summary;
                iss.issueLink = this.baseRoutePath +
                `/jira/software/c/projects/${sprintId}/boards/167?selectedIssue=${issue.key}`
                iss.issueType = issue.fields.issuetype.name;
                iss.description = issue.fields.issuetype.description;
                iss.status = issue.fields.status.name;
            
                if ('undefined' !== typeof issue.fields.assignee 
                    && null != issue.fields.assignee
                ){
                    iss.assignee = issue.fields.assignee.displayName;
                }

            //     iss = this.setEngineersOrQEs(iss, issue, true);
            //     iss = this.setEngineersOrQEs(iss, issue, false);

            //     if(isNaN(issue.fields.customfield_10023)) {
            //         issue.fields.customfield_10023 = 0.0
            //     }
            
            //     // customfield_10023 === story point field
            //     if( 
            //         issue.fields.status.name === 'Done' ||
            //         issue.fields.status.name === 'Ready To Release'
            //     ) {
            //         this.completedStoryPoints.push(issue.fields.customfield_10023) 

            //     } else {
            //         this.committedStoryPoints.push(issue.fields.customfield_10023) 
            //     }

            //     if ( 'undefined' === typeof this.sum ) {
            //         this.sum = sum;
            //     }
            //     issue.storyPoints.completed = this.sum(this.completedStoryPoints);
            //     storyPoints.committed = this.sum(this.committedStoryPoints)

                sprintIssues.push(iss)
            }
        }
        
        return sprintIssues;
    }

    async collectSprintData(boardIds) {
        const sprints = await this.getSprintBoards(boardIds);
        const boardIdsOnly = this.getBoardIdsOnly(boardIds);
       
       
        // Add data to sprints which match either only core or a 
        // mix of non-core and core teams / sprints. This is dependant 
        // on how the boardIds are set.
        let index = -1;
        let i = 0;
        let sprintModelShellObj;
        for(const sprint of sprints) {
            sprintModelShellObj = this.getIssueModelShell();
            sprintModelShellObj.team = boardIds[0];
            i++;
            let sprintObj = { 
                id: sprint.id, 
                name: sprint.name,
                desc: sprint.description,
                goal: sprint.goal,
                startDate: sprint.startDate,
                endDate: sprint.endDate,
            }

            sprintModelShellObj.team = boardIds[0];
            sprintModelShellObj.sprint = sprintObj;


            index = boardIdsOnly.indexOf(sprint.sprints.values[0].originBoardId);
            if (-1 !== index) {
              
                let data = await this.getSprintIssues(sprint.sprints.values[0].id, boardIds[index])
              
                // for( const issue of data.issues) {
                //     if(isNaN(issue.fields.customfield_10023)) {
                //         issue.fields.customfield_10023 = 0.0
                //     }
                
                //     // customfield_10023 === story point field
                //     if( 
                //         issue.fields.status.name === 'Done' ||
                //         issue.fields.status.name === 'Ready To Release'
                //     ) {
                //         this.completedStoryPoints.push(issue.fields.customfield_10023) 

                //     } else {
                //         this.committedStoryPoints.push(issue.fields.customfield_10023) 
                //     }

                //     if ( 'undefined' === typeof this.sum ) {
                //         this.sum = sum;
                //     }

                //     issue.storyPoints.completed = this.sum(this.completedStoryPoints);
                //     issue.storyPoints.committed = this.sum(this.committedStoryPoints)
                // }
                
            }
        }
    }
    getIssueShell() {
        return {
            ticketId: '',
            issueName: '',
            assignee: '',
            engineers: [],
            qes: [],
            description: '',
            status: '',
            issueType: 'Story',
            storyPoints: {
                accepted: 0,
                committed: 0,
                completed: 0,
                estimated: 0,
            }
        }
        
    }
    getIssueModelShell() {
        return {
            team: '',
            sprint: { 
                id: 0, 
                name: '',
                desc: '',
                goal: '',
                startDate: new Date(),
                endDate: new Date(),
            },
            teamRoles: [
                {
                    firstName: '',
                    lastName: '',
                    role: '',
                },
            ],
            issues: [
                {
                    ticketId: '',
                    issueName: '',
                    assignee: '',
                    engineers: [],
                    qes: [],
                    description: '',
                    issueType: 'Story',
                    storyPoints: {
                        accepted: 0,
                        committed: 0,
                        completed: 0,
                        estimated: 0,
                    }
                 },
            ]
        }
    }
} 