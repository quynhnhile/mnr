export function generateSurveyNo(lastIndex = 0, prefix = 'SUR_'): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const index = (lastIndex + 1).toString().padStart(8, '0');

  return `${prefix}${date}${index}`;
}
