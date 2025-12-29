import { describe, it, expect } from '@jest/globals';
import { TestScenarioSchema, TestSuiteSchema } from '../../src/schemas/test-scenario-schema.js';

describe('TestScenarioSchema', () => {
  describe('Valid Test Scenario', () => {
    it('should validate a complete test scenario', () => {
      const validScenario = {
        scenarioId: 'test-001',
        title: 'User Login - Valid Credentials',
        type: 'functional',
        priority: 'high',
        description: 'Test successful login with valid email and password',
        preconditions: ['User account exists', 'User is logged out'],
        steps: [
          {
            stepNumber: 1,
            action: 'Navigate to login page',
            expectedResult: 'Login form is displayed',
            testData: { url: '/login' }
          },
          {
            stepNumber: 2,
            action: 'Enter valid credentials',
            expectedResult: 'Credentials are accepted'
          }
        ],
        expectedOutcome: 'User is redirected to dashboard',
        testData: { email: 'test@example.com', password: 'Test123!' },
        tags: ['authentication', 'smoke-test'],
        estimatedDuration: '5min',
        automationPotential: 'high'
      };

      const result = TestScenarioSchema.parse(validScenario);
      expect(result).toEqual(validScenario);
    });

    it('should accept all valid scenario types', () => {
      const types = ['functional', 'integration', 'e2e', 'unit', 'edge-case', 'negative'];
      
      types.forEach(type => {
        const scenario = {
          scenarioId: 'test-001',
          title: 'Test Scenario',
          type,
          priority: 'medium',
          description: 'Test description',
          preconditions: [],
          steps: [
            { stepNumber: 1, action: 'Do something', expectedResult: 'Result' }
          ],
          expectedOutcome: 'Success'
        };
        
        expect(() => TestScenarioSchema.parse(scenario)).not.toThrow();
      });
    });
  });

  describe('Invalid Test Scenario', () => {
    it('should reject scenario without required fields', () => {
      const invalidScenario = {
        title: 'Test Scenario'
      };

      expect(() => TestScenarioSchema.parse(invalidScenario)).toThrow();
    });

    it('should reject scenario with invalid type', () => {
      const invalidScenario = {
        scenarioId: 'test-001',
        title: 'Test Scenario',
        type: 'invalid-type',
        priority: 'medium',
        description: 'Test description',
        preconditions: [],
        steps: [],
        expectedOutcome: 'Success'
      };

      expect(() => TestScenarioSchema.parse(invalidScenario)).toThrow();
    });
  });
});

describe('TestSuiteSchema', () => {
  describe('Valid Test Suite', () => {
    it('should validate a complete test suite', () => {
      const validSuite = {
        featureId: 'feat-001',
        featureName: 'User Authentication',
        generatedAt: '2025-12-29T10:00:00Z',
        scenarios: [
          {
            scenarioId: 'test-001',
            title: 'Valid Login',
            type: 'functional',
            priority: 'high',
            description: 'Test valid login',
            preconditions: ['User exists'],
            steps: [
              { stepNumber: 1, action: 'Login', expectedResult: 'Success' }
            ],
            expectedOutcome: 'User logged in'
          }
        ],
        coverage: {
          acceptanceCriteria: 100,
          edgeCases: 5,
          negativeScenarios: 3
        },
        recommendations: ['Add more edge cases', 'Consider security tests']
      };

      const result = TestSuiteSchema.parse(validSuite);
      expect(result.featureId).toBe('feat-001');
      expect(result.scenarios).toHaveLength(1);
      expect(result.recommendations).toHaveLength(2);
    });

    it('should validate suite without optional recommendations', () => {
      const suite = {
        featureId: 'feat-001',
        featureName: 'Test Feature',
        generatedAt: '2025-12-29T10:00:00Z',
        scenarios: [],
        coverage: {
          acceptanceCriteria: 0,
          edgeCases: 0,
          negativeScenarios: 0
        }
      };

      const result = TestSuiteSchema.parse(suite);
      expect(result.recommendations).toBeUndefined();
    });
  });
});