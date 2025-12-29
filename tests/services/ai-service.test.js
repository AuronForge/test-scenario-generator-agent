import { describe, it, expect, beforeEach } from '@jest/globals';
import { AIService } from '../../src/services/ai-service.js';

// Set fake API keys for testing
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';

describe('AIService', () => {
  describe('Constructor', () => {
    it('should create instance with OpenAI provider', () => {
      const service = new AIService('openai');
      expect(service.provider).toBe('openai');
      expect(service.model).toBeDefined();
    });

    it('should create instance with Anthropic provider', () => {
      const service = new AIService('anthropic');
      expect(service.provider).toBe('anthropic');
      expect(service.model).toBeDefined();
    });

    it('should default to OpenAI provider', () => {
      const service = new AIService();
      expect(service.provider).toBe('openai');
    });

    it('should use environment variable for OpenAI model', () => {
      const originalModel = process.env.OPENAI_MODEL;
      process.env.OPENAI_MODEL = 'gpt-4';
      
      const service = new AIService('openai');
      expect(service.model).toBe('gpt-4');
      
      if (originalModel) {
        process.env.OPENAI_MODEL = originalModel;
      } else {
        delete process.env.OPENAI_MODEL;
      }
    });

    it('should use environment variable for Anthropic model', () => {
      const originalModel = process.env.ANTHROPIC_MODEL;
      process.env.ANTHROPIC_MODEL = 'claude-3-opus-20240229';
      
      const service = new AIService('anthropic');
      expect(service.model).toBe('claude-3-opus-20240229');
      
      if (originalModel) {
        process.env.ANTHROPIC_MODEL = originalModel;
      } else {
        delete process.env.ANTHROPIC_MODEL;
      }
    });
  });

  describe('Error Handling', () => {
    it('should throw error when AI service fails', async () => {
      const service = new AIService('openai');
      service.client = null;

      await expect(service.generateCompletion('test prompt'))
        .rejects
        .toThrow('AI Service Error');
    });

    it('should return undefined for unknown provider', async () => {
      const service = new AIService('unknown-provider');
      
      const result = await service.generateCompletion('test prompt');
      expect(result).toBeUndefined();
    });
  });
});
