import { validateFeature } from '../schemas/feature-schema.js';
import { TestSuiteSchema } from '../schemas/test-scenario-schema.js';
import { AIService } from '../services/ai-service.js';
import { generateTestPrompt } from '../prompts/test-generation-prompt.js';

export class QAAgent {
  constructor(aiProvider = 'openai') {
    this.aiService = new AIService(aiProvider);
    this.agentName = 'QA Test Scenario Generator';
    this.version = '1.0.0';
  }

  async generateTestScenarios(featureData) {
    try {
      // Validate input
      const validatedFeature = validateFeature(featureData);

      // Generate prompt
      const prompt = generateTestPrompt(validatedFeature);

      // Call AI service
      const aiResponse = await this.aiService.generateCompletion(prompt);

      // Parse and validate output
      const testSuite = this.parseAIResponse(aiResponse, validatedFeature);

      return {
        success: true,
        data: testSuite,
        metadata: {
          agent: this.agentName,
          version: this.version,
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        metadata: {
          agent: this.agentName,
          version: this.version,
        },
      };
    }
  }

  parseAIResponse(aiResponse, feature) {
    try {
      const parsed = JSON.parse(aiResponse);

      const testSuite = {
        featureId: feature.id || `feat-${Date.now()}`,
        featureName: feature.name,
        generatedAt: new Date().toISOString(),
        scenarios: parsed.scenarios || [],
        coverage: parsed.coverage || {
          acceptanceCriteria: 0,
          edgeCases: 0,
          negativeScenarios: 0,
        },
        recommendations: parsed.recommendations || [],
      };

      return TestSuiteSchema.parse(testSuite);
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  }

  async analyzeCoverage(testSuite, feature) {
    // Analyze test coverage against acceptance criteria
    const coverage = {
      total: feature.acceptanceCriteria.length,
      covered: 0,
      gaps: [],
    };

    // Implementation of coverage analysis
    // This could be enhanced with AI analysis

    return coverage;
  }
}
