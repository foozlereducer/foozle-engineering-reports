export function getSprintVelocity(issues) {
  return issues.reduce((total, issue) => {
    const spField = issue.customFields.find(f => f.name === 'Story Points');
    const value = parseFloat(spField?.value?.name || 0);
    return total + (isNaN(value) ? 0 : value);
  }, 0);
}
