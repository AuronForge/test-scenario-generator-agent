import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import {
  ensureDirectoryExists,
  saveJsonFile,
  readJsonFile,
  fileExists,
} from '../../src/utils/file.utils.js';

describe('file.utils', () => {
  const testDir = path.join(process.cwd(), 'tests', '.temp-file-utils');
  const testFile = path.join(testDir, 'test.json');

  beforeEach(() => {
    // Clean up test directory before each test
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up test directory after each test
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('ensureDirectoryExists', () => {
    it('should create directory if it does not exist', () => {
      ensureDirectoryExists(testDir);
      expect(fs.existsSync(testDir)).toBe(true);
    });

    it('should not throw error if directory already exists', () => {
      fs.mkdirSync(testDir, { recursive: true });
      expect(() => ensureDirectoryExists(testDir)).not.toThrow();
    });

    it('should create nested directories', () => {
      const nestedDir = path.join(testDir, 'nested', 'deep', 'path');
      ensureDirectoryExists(nestedDir);
      expect(fs.existsSync(nestedDir)).toBe(true);
    });
  });

  describe('saveJsonFile', () => {
    it('should save JSON data to file', () => {
      const data = { name: 'test', value: 123 };
      saveJsonFile(testFile, data);

      expect(fs.existsSync(testFile)).toBe(true);
      const content = fs.readFileSync(testFile, 'utf8');
      expect(JSON.parse(content)).toEqual(data);
    });

    it('should create directory if it does not exist', () => {
      const data = { name: 'test' };
      saveJsonFile(testFile, data);

      expect(fs.existsSync(testDir)).toBe(true);
      expect(fs.existsSync(testFile)).toBe(true);
    });

    it('should format JSON with 2 spaces', () => {
      const data = { name: 'test', nested: { value: 123 } };
      saveJsonFile(testFile, data);

      const content = fs.readFileSync(testFile, 'utf8');
      expect(content).toContain('  "name"');
      expect(content).toContain('  "nested"');
    });

    it('should overwrite existing file', () => {
      const data1 = { name: 'first' };
      const data2 = { name: 'second' };

      saveJsonFile(testFile, data1);
      saveJsonFile(testFile, data2);

      const content = JSON.parse(fs.readFileSync(testFile, 'utf8'));
      expect(content).toEqual(data2);
    });

    it('should handle empty object', () => {
      saveJsonFile(testFile, {});
      const content = JSON.parse(fs.readFileSync(testFile, 'utf8'));
      expect(content).toEqual({});
    });

    it('should handle arrays', () => {
      const data = [1, 2, 3];
      saveJsonFile(testFile, data);
      const content = JSON.parse(fs.readFileSync(testFile, 'utf8'));
      expect(content).toEqual(data);
    });

    it('should throw error on write failure', () => {
      // Mock fs.writeFileSync to throw error
      const originalWriteFile = fs.writeFileSync;
      fs.writeFileSync = jest.fn(() => {
        throw new Error('Write error');
      });

      expect(() => saveJsonFile(testFile, {})).toThrow('Write error');

      // Restore original function
      fs.writeFileSync = originalWriteFile;
    });
  });

  describe('readJsonFile', () => {
    it('should read JSON data from file', () => {
      const data = { name: 'test', value: 123 };
      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(testFile, JSON.stringify(data), 'utf8');

      const result = readJsonFile(testFile);
      expect(result).toEqual(data);
    });

    it('should return default value if file does not exist', () => {
      const defaultValue = { scenarios: [] };
      const result = readJsonFile(testFile, defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('should handle empty default value', () => {
      const result = readJsonFile(testFile);
      expect(result).toBeNull();
    });

    it('should parse complex JSON structures', () => {
      const data = {
        nested: { array: [1, 2, 3], object: { key: 'value' } },
      };
      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(testFile, JSON.stringify(data), 'utf8');

      const result = readJsonFile(testFile);
      expect(result).toEqual(data);
    });

    it('should handle arrays', () => {
      const data = [{ id: 1 }, { id: 2 }];
      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(testFile, JSON.stringify(data), 'utf8');

      const result = readJsonFile(testFile);
      expect(result).toEqual(data);
    });

    it('should throw error on invalid JSON', () => {
      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(testFile, 'invalid json', 'utf8');

      expect(() => readJsonFile(testFile)).toThrow();
    });
  });

  describe('fileExists', () => {
    it('should return true if file exists', () => {
      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(testFile, 'test', 'utf8');

      expect(fileExists(testFile)).toBe(true);
    });

    it('should return false if file does not exist', () => {
      expect(fileExists(testFile)).toBe(false);
    });

    it('should return true for directories', () => {
      fs.mkdirSync(testDir, { recursive: true });
      expect(fileExists(testDir)).toBe(true);
    });

    it('should return false for non-existent paths', () => {
      expect(fileExists('/non/existent/path')).toBe(false);
    });
  });
});
