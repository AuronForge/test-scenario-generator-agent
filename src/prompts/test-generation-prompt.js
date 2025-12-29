export function generateTestPrompt(feature) {
  return `
You are an expert QA engineer. Generate comprehensive test scenarios for the following feature.

**Feature Details:**
- Name: ${feature.name}
- Type: ${feature.type}
- Description: ${feature.description}
- Priority: ${feature.priority}

**Acceptance Criteria:**
${feature.acceptanceCriteria.map((ac, i) => `${i + 1}. ${ac}`).join('\n')}

${feature.userFlows ? `
**User Flows:**
${feature.userFlows.map(flow => `Step ${flow.step}: ${flow.action} -> ${flow.expectedResult}`).join('\n')}
` : ''}

${feature.businessRules ? `
**Business Rules:**
${feature.businessRules.map((rule, i) => `${i + 1}. ${rule}`).join('\n')}
` : ''}

**Requirements:**
1. Create test scenarios covering ALL acceptance criteria
2. Include positive, negative, and edge case scenarios
3. Ensure scenarios are clear, actionable, and detailed
4. Prioritize scenarios based on risk and impact
5. Suggest automation potential for each scenario

**Output Format (JSON):**
{
  "scenarios": [
    {
      "scenarioId": "unique-id",
      "title": "Clear scenario title",
      "type": "functional|integration|e2e|unit|edge-case|negative",
      "priority": "low|medium|high|critical",
      "description": "Detailed description",
      "preconditions": ["precondition 1", "precondition 2"],
      "steps": [
        {
          "stepNumber": 1,
          "action": "What to do",
          "expectedResult": "What should happen",
          "testData": {}
        }
      ],
      "expectedOutcome": "Final expected result",
      "testData": {},
      "tags": ["tag1", "tag2"],
      "estimatedDuration": "5min",
      "automationPotential": "high|medium|low"
    }
  ],
  "coverage": {
    "acceptanceCriteria": 100,
    "edgeCases": 5,
    "negativeScenarios": 3
  },
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Generate the test scenarios now.
`;
}
