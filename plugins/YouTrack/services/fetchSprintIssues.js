export async function fetchSprintIssues({ sprintName, baseUrl, token }) {
  const response = await fetch(`${baseUrl}/api/issues?query=Sprint: {${sprintName}} State: Done&fields=customFields(name,value(name))`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching issues: ${response.statusText}`);
  }

  return response.json();
}