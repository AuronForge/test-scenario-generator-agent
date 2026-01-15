import { describe, it, expect } from '@jest/globals';
import { TestScenarioSchema, TestSuiteSchema } from '../../src/schemas/test-scenario-schema.js';

describe('TestScenarioSchema', () => {
  it('should validate a complete test scenario', () => {
    const validScenario = {
      scenarioId: 'test-001',
      title: 'User Login - Valid Credentials',
      type: 'functional',
      priority: 'high',
      description: 'Test successful login',
      preconditions: ['User account exists'],
      steps: [
        {
          stepNumber: 1,
          action: 'Navigate to login page',
          expectedResult: 'Login form is displayed',
        },
      ],
      expectedOutcome: 'User is redirected to dashboard',
    };

    const result = TestScenarioSchema.parse(validScenario);
    expect(result).toEqual(validScenario);
  });
});

describe('TestSuiteSchema', () => {
  it('should validate a complete test suite', () => {
    const validSuite = {
      featureId: 'feat-001',
      featureName: 'User Authentication',
      generatedAt: '2025-12-29T10:00:00Z',
      scenarios: [],
      coverage: {
        acceptanceCriteria: 100,
        edgeCases: 5,
        negativeScenarios: 3,
      },
    };

    const result = TestSuiteSchema.parse(validSuite);
    expect(result.featureId).toBe('feat-001');
  });
});
