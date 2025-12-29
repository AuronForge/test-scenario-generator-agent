import { describe, it, expect } from '@jest/globals';
import { generateTestPrompt } from '../../src/prompts/test-generation-prompt.js';

describe('generateTestPrompt', () => {
  it('should generate prompt with all feature details', () => {
    const feature = {
      name: 'User Login',
      type: 'user-story',
      description: 'Implement secure login',
      priority: 'high',
      acceptanceCriteria: [
        'User can login with valid credentials',
        'Error shown for invalid credentials'
      ],
      userFlows: [
        {
          step: 1,
          action: 'Enter credentials',
          expectedResult: 'Form validates'
        }
      ],
      businessRules: ['Password must be 8+ characters']
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('User Login');
    expect(prompt).toContain('user-story');
    expect(prompt).toContain('Implement secure login');
    expect(prompt).toContain('high');
    expect(prompt).toContain('User can login with valid credentials');
    expect(prompt).toContain('Enter credentials');
    expect(prompt).toContain('Password must be 8+ characters');
  });

  it('should handle feature without optional fields', () => {
    const feature = {
      name: 'Simple Feature',
      type: 'task',
      description: 'A simple task',
      priority: 'low',
      acceptanceCriteria: ['Criterion 1']
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('Simple Feature');
    expect(prompt).not.toContain('**User Flows:**');
    expect(prompt).not.toContain('**Business Rules:**');
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

    expect(prompt).toContain('**Output Format (JSON):**');
    expect(prompt).toContain('scenarios');
    expect(prompt).toContain('coverage');
    expect(prompt).toContain('recommendations');
  });
});