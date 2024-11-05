// Refactored getStoryPoints function with SOLID principles
export async function getStoryPoints(sprint, boardId, queryParams = { state: 'active' }, calculatorClass = StoryPointCalculator) {
  if (typeof boardId !== 'number' || !sprint || typeof sprint.getSprint !== 'function') {
      throw new Error('Invalid parameters');
  }

  try {
      const response = await sprint.getSprint(boardId, queryParams);
      const issues = response.data?.issues || [];

      const calculator = new calculatorClass(issues);
      return calculator.calculate();
  } catch (error) {
      console.error('Error fetching sprint issues:', error);
      return StoryPointCalculator.defaultStoryPoints();
  }
}

// StoryPointCalculator class for calculating story points
class StoryPointCalculator {
  constructor(issues) {
      this.issues = issues;
  }

  calculate() {
      let estimatedPoints = 0;
      let committedPoints = 0;
      let completedPoints = 0;
      let acceptedPoints = 0;

      this.issues.forEach((issue) => {
          const storyPoints = issue.fields?.customfield_10016;
          const status = issue.fields?.status?.name;

          if (storyPoints != null) {
              estimatedPoints += storyPoints;
              committedPoints += storyPoints;

              if (StoryPointCalculator.isCompleted(status)) {
                  completedPoints += storyPoints;
              }

              if (StoryPointCalculator.isAccepted(status)) {
                  acceptedPoints += storyPoints;
              }
          }
      });

      return {
          estimatedPoints,
          committedPoints,
          completedPoints,
          acceptedPoints
      };
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
