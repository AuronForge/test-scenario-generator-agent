import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test Scenario Generator API',
      version: '1.0.0',
      description:
        'API para geração automatizada de cenários de teste usando IA. Suporta múltiplos provedores de IA (OpenAI, GitHub Models, Anthropic) para criar cenários de teste detalhados a partir de features.',
      contact: {
        name: 'API Support',
        url: 'https://github.com/AuronForge/test-scenario-generator-agent',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://test-scenario-generator-agent.vercel.app',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Scenarios',
        description: 'Endpoints para gerenciar cenários de teste',
      },
    ],
    components: {
      schemas: {
        Feature: {
          type: 'object',
          required: ['name', 'description'],
          properties: {
            name: {
              type: 'string',
              description: 'Nome da feature',
              example: 'User Login',
            },
            description: {
              type: 'string',
              description: 'Descrição detalhada da feature',
              example: 'Funcionalidade de autenticação de usuários no sistema',
            },
          },
        },
        TestScenario: {
          type: 'object',
          properties: {
            scenarioId: {
              type: 'string',
              description: 'ID único do cenário',
              example: 'TC-001',
            },
            title: {
              type: 'string',
              description: 'Título do cenário de teste',
              example: 'Login com credenciais válidas',
            },
            type: {
              type: 'string',
              enum: ['functional', 'non-functional', 'integration', 'e2e', 'unit'],
              description: 'Tipo do teste',
              example: 'functional',
            },
            priority: {
              type: 'string',
              enum: ['high', 'medium', 'low'],
              description: 'Prioridade do teste',
              example: 'high',
            },
            description: {
              type: 'string',
              description: 'Descrição do cenário',
              example: 'Verificar que o usuário consegue fazer login com credenciais válidas',
            },
            preconditions: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Pré-condições necessárias',
              example: ['Usuário cadastrado no sistema', 'Sistema disponível'],
            },
            steps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  stepNumber: {
                    type: 'integer',
                    example: 1,
                  },
                  action: {
                    type: 'string',
                    example: 'Acessar a página de login',
                  },
                  expectedResult: {
                    type: 'string',
                    example: 'Página de login é exibida',
                  },
                },
              },
            },
            expectedOutcome: {
              type: 'string',
              description: 'Resultado esperado final',
              example: 'Usuário autenticado e redirecionado para dashboard',
            },
          },
        },
        GenerateResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se a geração foi bem-sucedida',
              example: true,
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/TestScenario',
              },
            },
            metadata: {
              type: 'object',
              properties: {
                agent: {
                  type: 'string',
                  example: 'QA Test Scenario Generator',
                },
                version: {
                  type: 'string',
                  example: '1.0.0',
                },
                generatedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2026-01-15T10:30:00Z',
                },
              },
            },
            id: {
              type: 'string',
              description: 'ID do cenário salvo no banco de dados',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            savedTo: {
              type: 'string',
              description: 'Nome do arquivo onde o resultado foi salvo',
              example: 'feature-user-login.json',
            },
          },
        },
        ScenarioEntry: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do cenário',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2026-01-15T10:30:00Z',
            },
            feature: {
              $ref: '#/components/schemas/Feature',
            },
            scenarios: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/TestScenario',
              },
            },
            provider: {
              type: 'string',
              enum: ['openai', 'github', 'anthropic'],
              description: 'Provedor de IA utilizado',
              example: 'openai',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Validation error: Feature name is required',
            },
            stack: {
              type: 'string',
              description: 'Stack trace (apenas em desenvolvimento)',
            },
          },
        },
      },
      parameters: {
        AIProvider: {
          name: 'x-ai-provider',
          in: 'header',
          description: 'Provedor de IA a ser utilizado',
          required: false,
          schema: {
            type: 'string',
            enum: ['openai', 'github', 'anthropic'],
            default: 'openai',
          },
        },
        ScenarioId: {
          name: 'id',
          in: 'query',
          description: 'ID do cenário a ser recuperado',
          required: false,
          schema: {
            type: 'string',
          },
        },
      },
    },
  },
  apis: ['./api/*.js', './src/**/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
