


async function getStoryPoints(sprint, boardId, queryParams = { state: 'active' }) {
  try {
    
    const response = await sprint.getSprint(boardId, queryParams)
    const issues = response.data.issues;
    let estimatedPoints = 0;
    let committedPoints = 0;
    let completedPoints = 0;
    let acceptedPoints = 0;

    issues.forEach((issue) => {
      const storyPoints = issue.fields.customfield_10016; // Replace with your Story Points custom field ID
      const status = issue.fields.status.name;

      if (storyPoints != null) {
        estimatedPoints += storyPoints;
        committedPoints += storyPoints; // Assuming all issues in sprint are committed

        if (status === 'Done') {
          completedPoints += storyPoints;
        }

        if (status === 'Accepted') { // Adjust based on your workflow
          acceptedPoints += storyPoints;
        }
      }
    });

    console.log('Estimated Story Points:', estimatedPoints);
    console.log('Committed Story Points:', committedPoints);
    console.log('Completed Story Points:', completedPoints);
    console.log('Accepted Story Points:', acceptedPoints);
  } catch (error) {
    console.error('Error fetching sprint issues:', error);
  }
}

