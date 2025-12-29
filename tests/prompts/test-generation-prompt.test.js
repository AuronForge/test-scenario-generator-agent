import { describe, it, expect } from '@jest/globals';
import { generateTestPrompt } from '../../src/prompts/test-generation-prompt.js';

describe('generateTestPrompt', () => {
  it('should generate prompt with all feature details', () => {
    const feature = {
      name: 'User Login',
      type: 'user-story',
      description: 'Implement secure login',
      priority: 'high',
      acceptanceCriteria:  [
        'User can login with valid credentials'
      ]
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('User Login');
    expect(prompt).toContain('user-story');
    expect(prompt).toContain('Implement secure login');
  });

  it('should include JSON format requirements', () => {
    const feature = {
      name: 'Test',
      type: 'task',
      description: 'Test description',
      priority: 'medium',
      acceptanceCriteria: ['Test']
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('scenarios');
    expect(prompt).toContain('coverage');
  });

  it('should include optional userFlows when provided', () => {
    const feature = {
      name: 'Test',
      type: 'task',
      description: 'Test description',
      priority: 'medium',
      acceptanceCriteria: ['Test'],
      userFlows: [
        {
          step: 1,
          action: 'Test action',
          expectedResult: 'Test result'
        }
      ]
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('User Flows:');
    expect(prompt).toContain('Test action');
  });

  it('should include optional businessRules when provided', () => {
    const feature = {
      name: 'Test',
      type: 'task',
      description: 'Test description',
      priority: 'medium',
      acceptanceCriteria: ['Test'],
      businessRules: ['Rule 1', 'Rule 2']
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('Business Rules:');
    expect(prompt).toContain('Rule 1');
  });
});
