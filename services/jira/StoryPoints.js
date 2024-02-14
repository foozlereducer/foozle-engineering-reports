export class StoryPoints {
    constructor(sum) {
        this.sum = sum;
    }
    a() {
         // // customfield_10023 === story point field
                // if( 
                //     issue.fields.status.name === 'Done' ||
                //     issue.fields.status.name === 'Ready To Release'
                // ) {
                //     this.completedStoryPoints.push(issue.fields.customfield_10023) 

                // } else {
                //     this.committedStoryPoints.push(issue.fields.customfield_10023) 
                // }
    }
    /**
     * 
     * @param {obj} points - object literal like {
        accepted: [1,2,8,3,5,5,3],
        committed: [1,2,8,3,5,3,1],
        completed: [1,2,3,5,1],
        estimated: [2,2,5,3,5,3,1]
    }
     * @returns {obj} - the storypoints object literal with summed story points
     */
    tallyStoryPoints(points) {
        return {
            accepted: this.sum(points.accepted),
            committed: this.sum(points.committed),
            completed: this.sum(points.completed),
            estimated: this.sum(points.estimated)
        }
    }
}