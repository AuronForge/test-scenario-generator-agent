import { describe, it, expect } from '@jest/globals';
import { generateTestPrompt } from '../../src/prompts/test-generation-prompt.js';

describe('generateTestPrompt', () => {
  it('should generate prompt with all feature details', () => {
    const feature = {
      name: 'User Login',
      type: 'user-story',
      description: 'Implement secure login',
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
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('scenarios');
    expect(prompt).toContain('coverage');
  });

  it('should instruct AI to generate user flows and acceptance criteria', () => {
    const feature = {
      name: 'Test',
      type: 'task',
      description: 'Test description',
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('User flows');
    expect(prompt).toContain('Acceptance criteria');
    expect(prompt).toContain('Analyze the feature');
  });

  it('should include optional businessRules when provided', () => {
    const feature = {
      name: 'Test',
      type: 'task',
      description: 'Test description',
      businessRules: ['Rule 1', 'Rule 2'],
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('Business Rules:');
    expect(prompt).toContain('Rule 1');
  });

  it('should not include Business Rules section when not provided', () => {
    const feature = {
      name: 'Test',
      type: 'task',
      description: 'Test description',
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).not.toContain('Business Rules:');
  });

  it('should include technical details with endpoints when provided', () => {
    const feature = {
      name: 'Test',
      type: 'task',
      description: 'Test description',
      technicalDetails: {
        endpoints: ['/api/test', '/api/users'],
      },
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('Technical Details:');
    expect(prompt).toContain('Endpoints:');
    expect(prompt).toContain('/api/test');
    expect(prompt).toContain('/api/users');
  });

  it('should include technical details with components when provided', () => {
    const feature = {
      name: 'Test',
      type: 'task',
      description: 'Test description',
      technicalDetails: {
        components: ['Component1', 'Component2'],
      },
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('Technical Details:');
    expect(prompt).toContain('Components:');
    expect(prompt).toContain('Component1');
  });

  it('should include technical details with dependencies when provided', () => {
    const feature = {
      name: 'Test',
      type: 'task',
      description: 'Test description',
      technicalDetails: {
        dependencies: ['package1', 'package2'],
      },
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('Technical Details:');
    expect(prompt).toContain('Dependencies:');
    expect(prompt).toContain('package1');
  });

  it('should include all technical details when all are provided', () => {
    const feature = {
      name: 'Test',
      type: 'task',
      description: 'Test description',
      technicalDetails: {
        endpoints: ['/api/test'],
        components: ['Component1'],
        dependencies: ['package1'],
      },
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('Technical Details:');
    expect(prompt).toContain('Endpoints:');
    expect(prompt).toContain('Components:');
    expect(prompt).toContain('Dependencies:');
  });

  it('should not include Technical Details section when not provided', () => {
    const feature = {
      name: 'Test',
      type: 'task',
      description: 'Test description',
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).not.toContain('Technical Details:');
  });

  it('should handle empty technicalDetails object', () => {
    const feature = {
      name: 'Test',
      type: 'task',
      description: 'Test description',
      technicalDetails: {},
    };

    const prompt = generateTestPrompt(feature);

    expect(prompt).toContain('Technical Details:');
  });
});
