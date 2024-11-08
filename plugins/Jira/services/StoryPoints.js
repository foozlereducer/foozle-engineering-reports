export async function getStoryPoints(sprint, boardId, calculatorInstance, logger = console, queryParams = { state: 'active' }) {
    const cacheKey = JSON.stringify({ boardId, ...queryParams });
    if (storyPointsCache.has(cacheKey)) {
        logger.log('Cache hit for story points');
        return storyPointsCache.get(cacheKey);
    }

    if (typeof boardId !== 'number' || !sprint || typeof sprint.getSprint !== 'function') {
        throw new Error('Invalid parameters');
    }

    try {
        const response = await sprint.getSprint(boardId, queryParams);
        if (!response.values || response.values.length === 0) {
            throw new Error('No sprints available to fetch issues');
        }

        logger.log('Response from getSprint:', response);
        
        const issues = await sprint.getIssuesInSprint(response.values[0].id, queryParams);
        logger.log('Issues fetched in getStoryPoints:', issues);

        if (calculatorInstance && typeof calculatorInstance.setIssues === 'function') {
            calculatorInstance.setIssues(issues);
        } else {
            throw new Error('Invalid calculator instance');
        }

        const result = calculatorInstance.calculate();
        logger.log('Calculated story points:', result);

        storyPointsCache.set(cacheKey, result);
        return result;
    } catch (error) {
        logger.error('Error fetching sprint issues:', error);
        return StoryPointCalculator.defaultStoryPoints();
    }
}

// Cache for Story Points
const storyPointsCache = new Map();

// StoryPointCalculator class for calculating story points
export class StoryPointCalculator {
    constructor(issues = []) {
        this.issues = issues;
    }
  
    setIssues(issues) {
        console.log('Setting issues:', issues);
        this.issues = issues;
    }
  
    calculate() {
        console.log('Calculating points for issues:', this.issues);
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
  