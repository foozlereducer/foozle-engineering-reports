export class SprintInterface {
    getSprints(boardId) {
        throw new Error("Method 'getSprints()' must be implemented.");
    }
    
    getIssuesInSprint(sprintId) {
        throw new Error("Method 'getIssuesInSprint()' must be implemented.");
    }
    
    getStoryPoints(issue) {
        throw new Error("Method 'getStoryPoints()' must be implemented.");
    }
}