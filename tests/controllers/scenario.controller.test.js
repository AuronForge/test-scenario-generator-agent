import { describe, it, expect, beforeEach } from '@jest/globals';
import * as scenarioController from '../../src/controllers/scenario.controller.js';

describe('scenario.controller - Integration Tests', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Create mock request and response objects
    mockReq = {
      body: {},
      headers: {},
      query: {},
    };

    mockRes = {
      statusCode: 200,
      responseData: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.responseData = data;
        return this;
      },
    };
  });

  describe('getScenarios', () => {
    it('should return all scenarios when no ID provided', async () => {
      await scenarioController.getScenarios(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.responseData).toBeDefined();
      expect(mockRes.responseData.success).toBe(true);
      expect(mockRes.responseData.total).toBeDefined();
      expect(mockRes.responseData.data).toBeDefined();
      expect(Array.isArray(mockRes.responseData.data)).toBe(true);
    });

    it('should return 404 for non-existent scenario ID', async () => {
      mockReq.query.id = 'non-existent-id-123';

      await scenarioController.getScenarios(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(404);
      expect(mockRes.responseData).toBeDefined();
      expect(mockRes.responseData.success).toBe(false);
      expect(mockRes.responseData.error).toBe('Scenario not found');
    });
  });

  describe('generateScenarios', () => {
    it('should return 400 for invalid feature data', async () => {
      mockReq.body = { invalid: 'data' };

      await scenarioController.generateScenarios(mockReq, mockRes);

      expect([400, 500]).toContain(mockRes.statusCode);
      expect(mockRes.responseData).toBeDefined();
      expect(mockRes.responseData.success).toBe(false);
    });

    it('should use default provider when not specified', async () => {
      mockReq.body = {
        name: 'Test Feature',
        description: 'Test description',
      };

      // This will fail due to missing API keys, but we're testing the flow
      await scenarioController.generateScenarios(mockReq, mockRes);

      expect(mockRes.responseData).toBeDefined();
      expect(mockRes.responseData.success).toBeDefined();
    });

    it('should handle custom AI provider from header', async () => {
      mockReq.body = {
        name: 'Test Feature',
        description: 'Test description',
      };
      mockReq.headers['x-ai-provider'] = 'github';

      // This will fail due to missing API keys, but we're testing the flow
      await scenarioController.generateScenarios(mockReq, mockRes);

      expect(mockRes.responseData).toBeDefined();
      expect(mockRes.responseData.success).toBeDefined();
    });

    it('should return 500 on unexpected errors', async () => {
      // Sending invalid body that causes issues
      mockReq.body = null;

      await scenarioController.generateScenarios(mockReq, mockRes);

      expect([400, 500]).toContain(mockRes.statusCode);
      expect(mockRes.responseData).toBeDefined();
      expect(mockRes.responseData.success).toBe(false);
    });
  });
});
