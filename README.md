# AI QA Agent - Test Scenario Generator

🤖 An intelligent AI agent that automatically generates comprehensive test scenarios from feature descriptions.

## Overview

This is the first agent in a multi-agent system designed to automate software development tasks. The QA Agent specializes in creating detailed, actionable test scenarios based on feature specifications.

## Features

- ✅ **Smart AI-powered analysis** - Agent automatically generates user flows and acceptance criteria
- ✅ Automated test scenario generation from minimal input
- ✅ Support for multiple test types (functional, integration, e2e, edge cases)
- ✅ Schema validation for inputs and outputs
- ✅ Multiple AI provider support (OpenAI, GitHub Models, Anthropic)
- ✅ **GitHub Models integration (Free!)** - Use GPT-4o via GitHub API
- ✅ Coverage analysis
- ✅ Hosted on Vercel for easy deployment
- ✅ RESTful API with **Swagger documentation**
- ✅ Auto-save to database
- ✅ **Comprehensive unit tests with >70% coverage**

## 📚 API Documentation

Access the interactive Swagger documentation:

- **Local**: http://localhost:3000/docs
- **Production**: https://your-app.vercel.app/docs

The Swagger UI provides:

- Complete API reference
- Interactive request/response testing
- Request/response examples
- Schema definitions
- Try-it-out functionality

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o

# GitHub Models Configuration (Free! Recommended)
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_MODEL=gpt-4o

# Anthropic Configuration
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Environment
NODE_ENV=development
```

### GitHub Models Setup (Recommended)

1. Generate a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scope: `read:packages`
   - Copy the generated token

2. Add to `.env`:

   ```env
   GITHUB_TOKEN=ghp_your_token_here
   GITHUB_MODEL=gpt-4o
   ```

3. **Benefits**: Free access to GPT-4o with generous rate limits!

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

## Code Quality

### Linters & Formatters

O projeto utiliza:

- **ESLint**: Análise estática de código JavaScript
- **Prettier**: Formatação automática de código
- **EditorConfig**: Padronização de configurações do editor

### Scripts Disponíveis

```bash
npm run lint         # Verifica problemas de lint
npm run lint:fix     # Corrige problemas de lint automaticamente
npm run format       # Formata código com Prettier
npm run format:check # Verifica se código está formatado
```

### Regras Principais

- ✅ `eqeqeq`: Sempre usar `===` ao invés de `==`
- ✅ `prefer-const`: Preferir const para variáveis não reatribuídas
- ✅ `no-var`: Proibir uso de `var`
- ✅ `curly`: Sempre usar chaves em blocos
- ⚠️ `no-console`: Permitido (logs são úteis em serverless)

### Conventional Commits

O projeto utiliza **Commitlint** e **Commitizen** para padronizar mensagens de commit:

#### Criando Commits

```bash
npm run commit  # Interface interativa para criar commits
# ou
git commit -m "feat: add new feature"
```

#### Formato de Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types permitidos:**

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `perf`: Melhoria de performance
- `test`: Testes
- `build`: Sistema de build
- `ci`: CI/CD
- `chore`: Manutenção

**Exemplos:**

```bash
feat: add GitHub Models support
fix: resolve coverage calculation bug
docs: update README with CI/CD instructions
test: increase coverage to 95%
ci: add commitlint validation
```

### Git Hooks (Husky)

**Pre-commit**: Roda lint-staged (lint + format) nos arquivos staged e testes completos
**Commit-msg**: Valida formato da mensagem de commit

### Lint-staged

O projeto utiliza **lint-staged** para rodar validações apenas nos arquivos que estão em staged:

```json
{
  "*.js": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

**Benefícios:**

- ⚡ Mais rápido (valida apenas arquivos modificados)
- ✅ Auto-fix de problemas de lint e formatação
- 🎯 Foco nos arquivos que serão commitados

## Versionamento e Changelog

O projeto utiliza **standard-version** para versionamento automático seguindo o [Semantic Versioning](https://semver.org/):

### Gerando Releases

```bash
# Release automático (detecta o tipo baseado nos commits)
npm run release

# Release específico
npm run release:patch  # 1.0.0 → 1.0.1 (bug fixes)
npm run release:minor  # 1.0.0 → 1.1.0 (new features)
npm run release:major  # 1.0.0 → 2.0.0 (breaking changes)
```

### O que acontece em um release:

1. ✅ Analisa commits desde a última tag
2. ✅ Determina a nova versão (semver)
3. ✅ Atualiza `package.json` com nova versão
4. ✅ Gera/atualiza `CHANGELOG.md`
5. ✅ Cria commit de release
6. ✅ Cria tag git

### Após o release:

```bash
git push --follow-tags origin main
```

### Tipos de commit e impacto na versão:

- `feat:` → **MINOR** version (1.0.0 → 1.1.0)
- `fix:` → **PATCH** version (1.0.0 → 1.0.1)
- `BREAKING CHANGE:` → **MAJOR** version (1.0.0 → 2.0.0)
- `docs:`, `style:`, `refactor:`, `test:`, `ci:` → Não afetam versão

## Usage

### Local Development

```bash
npm run dev
```

The server will start at `http://localhost:3000`

**Access the API Documentation:** `http://localhost:3000/docs`

### API Endpoints

#### 1. Generate Test Scenarios

**Endpoint:** `POST /api/generate-scenarios`

**Headers:**

- `Content-Type: application/json`
- `x-ai-provider: openai|github|anthropic` (optional, default: openai)

**Request Body:**

```json
{
  "name": "User Login",
  "description": "Funcionalidade de autenticação de usuários no sistema"
}
```

#### 2. List Generated Scenarios

**Endpoint:** `GET /api/generated-scenarios`

**Query Parameters:**

- `id` (optional): ID do cenário específico

### API Request Examples

**Using GitHub Models (Recommended):**

```bash
curl -X POST http://localhost:3000/api/generate-scenarios \
  -H "Content-Type: application/json" \
  -H "x-ai-provider: github" \
  -d @tests/mocks/feature-example.json
```

**Using OpenAI:**

```bash
curl -X POST http://localhost:3000/api/generate-scenarios \
  -H "Content-Type: application/json" \
  -H "x-ai-provider: openai" \
  -d @tests/mocks/feature-example.json
```

**List all scenarios:**

```bash
curl http://localhost:3000/api/generated-scenarios
```

**Get specific scenario:**

```bash
curl "http://localhost:3000/api/generated-scenarios?id=uuid-123"
```

### Programmatic Usage

```javascript
import { QAAgent } from './src/agents/qa-agent.js';

// Using GitHub Models (Free!)
const agent = new QAAgent('github');

// Or use OpenAI
// const agent = new QAAgent('openai');

// Or use Anthropic
// const agent = new QAAgent('anthropic');

const result = await agent.generateTestScenarios(featureData);
console.log(result.data.scenarios);

// Results are automatically saved to database/scenarios.json
```

## API Documentation

### POST `/api/generate-scenarios`

Generate test scenarios from a feature specification.

**Headers:**

- `Content-Type: application/json`
- `x-ai-provider: openai|github|anthropic` (optional, default: openai)

**Request Body:**

```json
{
  "name": "User Login Authentication",
  "description": "Allow users to login using email and password",
  "type": "Feature"
}
```

**Response:**

```json
{
  "success": true,
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": {
    "scenarios": [...],
    "coverage": {...}
  },
  "metadata": {...},
  "savedTo": "feature-user-login-authentication.json"
}
```

### GET `/api/generated-scenarios`

List all generated test scenarios.

**Query Parameters:**

- `id` (optional): Get specific scenario by ID

**Response (List All):**

```json
{
  "success": true,
  "total": 5,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-01-15T10:30:00.000Z",
      "feature": {
        "name": "User Login Authentication",
        "description": "...",
        "type": "Feature"
      },
      "scenarios": {...},
      "provider": "github"
    }
  ]
}
```

**Response (Get by ID):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "feature": {...},
    "scenarios": {...},
    "provider": "github"
  }
}
```

**Examples:**

```bash
# List all scenarios
curl http://localhost:3000/api/generated-scenarios

# Get specific scenario
curl http://localhost:3000/api/generated-scenarios?id=550e8400-e29b-41d4-a716-446655440000
```

### POST `/api/generate-scenarios` (Legacy Headers)

Generate test scenarios from a feature specification.

**Headers:**

- `Content-Type: application/json`
- `x-ai-provider: openai|github|anthropic` (optional, default: openai)

**Request Body:**

```json
{
  "name": "Feature Name",
  "description": "Detailed feature description (required, min 10 chars)",
  "type": "user-story|epic|task|bug-fix",
  "technicalDetails": {
    "endpoints": ["/api/endpoint"],
    "components": ["Component1"],
    "dependencies": ["package1"]
  },
  "businessRules": ["Rule 1", "Rule 2"]
}
```

**Note:** The agent automatically generates:

- ✨ **User flows** - Step-by-step user interactions
- ✨ **Acceptance criteria** - Based on description, technical details, and business rules
- ✨ **Test scenarios** - Comprehensive coverage including positive, negative, and edge cases

**Minimal Example:**

```json
{
  "name": "User Login",
  "description": "Implement secure user login with email and password",
  "type": "user-story"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "featureId": "feat-123",
    "featureName": "User Login Authentication",
    "scenarios": [...],
    "coverage": {
      "acceptanceCriteria": 100,
      "edgeCases": 5,
      "negativeScenarios": 3
    },
    "recommendations": [...]
  },
  "metadata": {...},
  "savedTo": "feature-user-login-authentication.json"
}
```

**Note**: Results are automatically saved to the database at `database/scenarios.json`.

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

### Automated Pipeline

O projeto inclui um pipeline automatizado no GitHub Actions que:

1. **Executa testes automaticamente** em cada push/PR para a branch `main`
2. **Valida cobertura de testes**: a média de cobertura (statements, branches, functions, lines) deve ser ≥ 95%
3. **Bloqueia deploy** se a cobertura estiver abaixo do threshold
4. **Deploy automático** para Vercel após testes passarem

### Configuração dos Secrets

Para ativar o pipeline, configure os seguintes secrets no GitHub:

```
VERCEL_TOKEN          # Token de deploy do Vercel
VERCEL_ORG_ID         # ID da organização no Vercel
VERCEL_PROJECT_ID     # ID do projeto no Vercel
CODECOV_TOKEN         # (Opcional) Token do Codecov para relatórios
```

**Como obter os valores:**

1. **VERCEL_TOKEN**: Vercel Dashboard → Settings → Tokens → Create Token
2. **VERCEL_ORG_ID** e **VERCEL_PROJECT_ID**: Execute `vercel link` no projeto
3. **CODECOV_TOKEN**: codecov.io → Add Repository

### Status do Coverage Atual

- **Statements**: 97.72%
- **Branches**: 97.67%
- **Functions**: 100%
- **Lines**: 97.22%
- **Average**: 98.15% ✅

### Rodando testes localmente

```bash
npm test              # Testes unitários
npm run test:coverage # Testes com relatório de cobertura
```

## Future Agents

This QA Agent is part of a larger multi-agent ecosystem:

1. **QA Agent** (Current) - Test scenario generation
2. **Developer Agent** - Code implementation
3. **Code Review Agent** - Code quality analysis
4. **Documentation Agent** - Auto-documentation
5. **DevOps Agent** - Deployment automation

## License

MIT
