export class StoryPoints {
    constructor(calculator) {
        this.calculator = calculator; // Dependency Injection for Calculator
        this.storyPointsCache = new Map(); // Cache for Story Points
    }

    async calculateTotalStoryPoints(Sp, sprintsInRange, logger = console) {
        // Ensure sprintsInRange is always an array
        if (!Array.isArray(sprintsInRange)) {
            logger.error('sprintsInRange should be an array.');
            throw new TypeError('sprintsInRange should be an array.');
        }

        const cacheKey = JSON.stringify(sprintsInRange.map(sprint => sprint.id));

        // Check if the story points for this range are already cached
        if (this.storyPointsCache.has(cacheKey)) {
            logger.log('Cache hit for story points of sprints in range');
            return this.storyPointsCache.get(cacheKey);
        }

        try {
            let totalStoryPoints = {
                estimatedPoints: 0,
                committedPoints: 0,
                completedPoints: 0,
                acceptedPoints: 0
            };

            // Iterate over sprints and calculate story points
            for (let sprint of sprintsInRange) {
                const issuesInSprint = await Sp.getIssuesInSprint(sprint.id);
                logger.log(`Issues for sprint ${sprint.id}:`, issuesInSprint);

                if (!issuesInSprint || issuesInSprint.length === 0) {
                    logger.warn(`No issues found for sprint ${sprint.id}`);
                    continue;
                }

                this.calculatePointsForSprint(issuesInSprint, totalStoryPoints);
            }

            // Cache the result for future use
            this.storyPointsCache.set(cacheKey, totalStoryPoints);
            return totalStoryPoints;

        } catch (error) {
            logger.error('Error calculating total story points:', error);
            throw error;
        }
    }

    // Converted to an arrow function
    calculatePointsForSprint = (issuesInSprint, totalStoryPoints) => {
        for (let issue of issuesInSprint) {
            const storyPoints = issue.fields?.customfield_10023 || 0;

            totalStoryPoints.estimatedPoints += storyPoints;

            if (['To Do', 'In Progress', 'Done'].includes(issue.fields?.status?.name)) {
                totalStoryPoints.committedPoints += storyPoints;
            }

            if (['Done'].includes(issue.fields?.status?.name)) {
                totalStoryPoints.completedPoints += storyPoints;
            }

            if (['Accepted'].includes(issue.fields?.status?.name)) {
                totalStoryPoints.acceptedPoints += storyPoints;
            }
        }
    }

    // Method to get the story points for a single sprint
    async getStoryPoints(sprintInstance, sprintId, logger = console) {
        const cacheKey = JSON.stringify(sprintId);

        // Check if the story points for this sprintId are already cached
        if (this.storyPointsCache.has(cacheKey)) {
            logger.log('Cache hit for story points of sprint:', sprintId);
            return this.storyPointsCache.get(cacheKey);
        }

        try {
            const issuesInSprint = await sprintInstance.getIssuesInSprint(sprintId);
            this.calculator.setIssues(issuesInSprint);
            const result = this.calculator.calculate();

            // Cache the result for future use
            this.storyPointsCache.set(cacheKey, result);
            return result;
        } catch (error) {
            logger.error('Error fetching story points for sprint:', error);
            throw error;
        }
    }

    // Method to clear the cache (can be useful for testing or refreshing the cache)
    clearCache() {
        this.storyPointsCache.clear();
    }
}