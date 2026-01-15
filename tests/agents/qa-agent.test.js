import { describe, it, expect, jest } from '@jest/globals';
import { QAAgent } from '../../src/agents/qa-agent.js';

// Set fake API keys for testing
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';

describe('QAAgent', () => {
  describe('Constructor', () => {
    it('should create instance with default provider', () => {
      const agent = new QAAgent();
      expect(agent.agentName).toBe('QA Test Scenario Generator');
      expect(agent.version).toBe('1.0.0');
    });

    it('should create instance with specified provider', () => {
      const agent = new QAAgent('anthropic');
      expect(agent.aiService).toBeDefined();
    });
  });

  describe('parseAIResponse', () => {
    it('should parse valid AI response', () => {
      const agent = new QAAgent();
      const feature = {
        id: 'feat-001',
        name: 'Test Feature',
        description: 'Test description',
        type: 'user-story',
        acceptanceCriteria: ['Criterion 1'],
      };

      const aiResponse = JSON.stringify({
        scenarios: [
          {
            scenarioId: 'test-001',
            title: 'Test Scenario',
            type: 'functional',
            priority: 'high',
            description: 'Test description',
            preconditions: ['Precondition 1'],
            steps: [
              {
                stepNumber: 1,
                action: 'Do something',
                expectedResult: 'Result',
              },
            ],
            expectedOutcome: 'Success',
          },
        ],
        coverage: {
          acceptanceCriteria: 100,
          edgeCases: 5,
          negativeScenarios: 3,
        },
      });

      const result = agent.parseAIResponse(aiResponse, feature);
      expect(result.featureName).toBe('Test Feature');
      expect(result.scenarios).toHaveLength(1);
    });

    it('should handle AI response without optional fields', () => {
      const agent = new QAAgent();
      const feature = {
        name: 'Test Feature',
        description: 'Test description',
        type: 'task',
        acceptanceCriteria: ['Criterion 1'],
      };

      const aiResponse = JSON.stringify({
        scenarios: [],
      });

      const result = agent.parseAIResponse(aiResponse, feature);
      expect(result.featureName).toBe('Test Feature');
      expect(result.scenarios).toEqual([]);
      expect(result.coverage).toBeDefined();
    });

    it('should throw error for invalid JSON', () => {
      const agent = new QAAgent();
      const feature = {
        name: 'Test Feature',
        description: 'Test description',
        type: 'task',
        acceptanceCriteria: ['Criterion 1'],
      };

      expect(() => agent.parseAIResponse('invalid json', feature)).toThrow(
        'Failed to parse AI response'
      );
    });

    it('should generate feature ID when not provided', () => {
      const agent = new QAAgent();
      const feature = {
        name: 'Test Feature',
        description: 'Test description',
        type: 'task',
        acceptanceCriteria: ['Criterion 1'],
      };

      const aiResponse = JSON.stringify({
        scenarios: [],
        coverage: {
          acceptanceCriteria: 0,
          edgeCases: 0,
          negativeScenarios: 0,
        },
      });

      const result = agent.parseAIResponse(aiResponse, feature);
      expect(result.featureId).toMatch(/^feat-\d+$/);
    });
  });

  describe('Error Handling', () => {
    it('should return error response on validation failure', async () => {
      const agent = new QAAgent();
      const invalidFeature = {
        name: 'Test',
        // missing required fields
      };

      const result = await agent.generateTestScenarios(invalidFeature);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle parseAIResponse errors gracefully', async () => {
      const agent = new QAAgent();
      const feature = {
        name: 'Test Feature',
        description: 'Test description',
        type: 'task',
        acceptanceCriteria: ['Criterion 1'],
      };

      // Mock the AI service to return invalid JSON
      agent.aiService.generateCompletion = async () => 'invalid json';

      const result = await agent.generateTestScenarios(feature);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to parse AI response');
    });

    it('should handle AI service errors', async () => {
      const agent = new QAAgent();
      const feature = {
        name: 'Test Feature',
        description: 'Test description',
        acceptanceCriteria: ['Criterion 1'],
      };

      // Mock the AI service to throw error
      agent.aiService.generateCompletion = async () => {
        throw new Error('AI service error');
      };

      const result = await agent.generateTestScenarios(feature);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('analyzeCoverage', () => {
    it('should analyze test coverage', async () => {
      const agent = new QAAgent();
      const testSuite = {
        scenarios: [],
      };
      const feature = {
        acceptanceCriteria: ['Criterion 1', 'Criterion 2'],
      };

      const coverage = await agent.analyzeCoverage(testSuite, feature);
      expect(coverage.total).toBe(2);
      expect(coverage.covered).toBeDefined();
      expect(coverage.gaps).toBeDefined();
    });

    it('should handle empty acceptance criteria', async () => {
      const agent = new QAAgent();
      const testSuite = { scenarios: [] };
      const feature = { acceptanceCriteria: [] };

      const coverage = await agent.analyzeCoverage(testSuite, feature);
      expect(coverage.total).toBe(0);
    });

    it('should handle null test suite', async () => {
      const agent = new QAAgent();
      const feature = { acceptanceCriteria: ['Criterion 1'] };

      const coverage = await agent.analyzeCoverage(null, feature);
      expect(coverage).toBeDefined();
    });
  });
});
