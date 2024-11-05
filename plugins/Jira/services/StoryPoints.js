export async function getStoryPoints(sprint, boardId, queryParams = { state: 'active' }, calculatorClass = StoryPointCalculator, logger = console) {
  const cacheKey = JSON.stringify({ boardId, ...queryParams });
  if (storyPointsCache.has(cacheKey)) {
      return storyPointsCache.get(cacheKey);
  }

  if (typeof boardId !== 'number' || !sprint || typeof sprint.getSprint !== 'function') {
      throw new Error('Invalid parameters');
  }

  try {
      const response = await sprint.getSprint(boardId, queryParams);
      const issues = response.data?.issues || [];

      const calculator = new calculatorClass(issues);
      const result = calculator.calculate();
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
class StoryPointCalculator {
  constructor(issues) {
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