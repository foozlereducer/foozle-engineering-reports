export async function fetchSprintVelocity(sprintName) {
  const response = await fetch(`/api/v1/getSprintVelocity?sprintName=${encodeURIComponent(sprintName)}`);

  if (!response.ok) {
    throw new Error(`Error fetching sprint velocity: ${response.statusText}`);
  }

  return await response.json(); // returns { sprintName, velocity }
}

export async function fetchCurrentSprint() {
  const response = await fetch(`/api/v1/getCurrentSprint`)
  if (!response.ok) throw new Error(`Error fetching current sprint: ${response.statusText}`)
  return await response.json() // Expected: { sprintName: "Sprint 12" }
}