# AI QA Agent - Test Scenario Generator

🤖 An intelligent AI agent that automatically generates comprehensive test scenarios from feature descriptions.

## Overview

This is the first agent in a multi-agent system designed to automate software development tasks. The QA Agent specializes in creating detailed, actionable test scenarios based on feature specifications.

## Features

- ✅ Automated test scenario generation
- ✅ Support for multiple test types (functional, integration, e2e, edge cases)
- ✅ Schema validation for inputs and outputs
- ✅ Multiple AI provider support (OpenAI, Anthropic)
- ✅ Coverage analysis
- ✅ Hosted on Vercel for easy deployment
- ✅ RESTful API
- ✅ **Comprehensive unit tests with >70% coverage**

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4-turbo-preview

# Or use Anthropic
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

## Testing

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

### Test Structure
```
tests/
├── schemas/
│   ├── feature-schema.test.js
│   └── test-scenario-schema.test.js
├── agents/
│   └── qa-agent.test.js
├── services/
│   └── ai-service.test.js
├── prompts/
│   └── test-generation-prompt.test.js
└── api/
    └── generate-tests.test.js
```

### Coverage Thresholds
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Usage

### Local Development

```bash
npm run dev
```

### API Request

```bash
curl -X POST http://localhost:3000/api/generate-tests \
  -H "Content-Type: application/json" \
  -d @examples/feature-example.json
```

### Programmatic Usage

```javascript
import { QAAgent } from './src/agents/qa-agent.js';

const agent = new QAAgent('openai');
const result = await agent.generateTestScenarios(featureData);
```

## API Documentation

### POST `/api/generate-tests`

Generate test scenarios from a feature specification.

**Headers:**
- `Content-Type: application/json`
- `x-ai-provider: openai|anthropic` (optional, default: openai)

**Request Body:** See `examples/feature-example.json`

**Response:**
```json
{
  "success": true,
  "data": {
    "featureId": "feat-123",
    "featureName": "User Login Authentication",
    "scenarios": [...],
    "coverage": {...},
    "recommendations": [...]
  },
  "metadata": {...}
}
```

## Schema

Input and output schemas are validated using Zod. See:
- `src/schemas/feature-schema.js` - Feature input schema
- `src/schemas/test-scenario-schema.js` - Test output schema

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

## CI/CD

Tests are automatically run on every push. Coverage reports are generated and must meet minimum thresholds.

## Future Agents

This QA Agent is part of a larger multi-agent ecosystem:

1. **QA Agent** (Current) - Test scenario generation
2. **Developer Agent** - Code implementation
3. **Code Review Agent** - Code quality analysis
4. **Documentation Agent** - Auto-documentation
5. **DevOps Agent** - Deployment automation

## License

MIT
