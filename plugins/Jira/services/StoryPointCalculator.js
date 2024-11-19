// StoryPointCalculator class for calculating story points
export class StoryPointCalculator {
    constructor(issues = []) {
        this.issues = issues;
    }
  
    setIssues(issues) {
        this.issues = issues;
    }
  
    calculate() {
        return this.issues.reduce((acc, issue) => {
            const storyPoints = issue.fields?.customfield_10016;
            const status = issue.fields?.status?.name;
  
            if (storyPoints != null) {
                acc.estimatedPoints += storyPoints;
                acc.committedPoints += storyPoints;
  
                if (StoryPointCalculator.isCompleted(status)) {
                    acc.completedPoints += storyPoints;
                }
  
                if (StoryPointCalculator.isAccepted(status)) {
                    acc.acceptedPoints += storyPoints;
                }
            }
  
            return acc;
        }, StoryPointCalculator.defaultStoryPoints());
    }
  
    static isCompleted(status) {
        return status === 'Done';
    }
  
    static isAccepted(status) {
        return status === 'Accepted';
    }
  
    static defaultStoryPoints() {
        return {
            estimatedPoints: 0,
            committedPoints: 0,
            completedPoints: 0,
            acceptedPoints: 0
        };
    }
  }