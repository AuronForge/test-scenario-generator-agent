import { z } from 'zod';

export const TestScenarioSchema = z.object({
  scenarioId: z.string(),
  title: z.string(),
  type: z.string(), // Aceita qualquer string incluindo valores combinados
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string(),
  preconditions: z.array(z.string()),
  steps: z.array(
    z.object({
      stepNumber: z.number(),
      action: z.string(),
      expectedResult: z.string(),
      testData: z.any().optional(),
    })
  ),
  expectedOutcome: z.string(),
  testData: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  estimatedDuration: z.string().optional(),
  automationPotential: z.enum(['high', 'medium', 'low']).optional(),
});

export const TestSuiteSchema = z.object({
  featureId: z.string(),
  featureName: z.string(),
  generatedAt: z.string(),
  scenarios: z.array(TestScenarioSchema),
  coverage: z.object({
    acceptanceCriteria: z.number(),
    edgeCases: z.number(),
    negativeScenarios: z.number(),
  }),
  recommendations: z.array(z.string()).optional(),
});
