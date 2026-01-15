import * as scenarioController from '../src/controllers/scenario.controller.js';

/**
 * @swagger
 * /api/generate-scenarios:
 *   post:
 *     summary: Gera cenários de teste a partir de uma feature
 *     description: Utiliza IA para gerar automaticamente cenários de teste detalhados baseados na descrição de uma feature. Suporta múltiplos provedores de IA.
 *     tags: [Scenarios]
 *     parameters:
 *       - $ref: '#/components/parameters/AIProvider'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feature'
 *           examples:
 *             userLogin:
 *               summary: Feature de Login
 *               value:
 *                 name: User Login
 *                 description: Funcionalidade de autenticação de usuários no sistema com validação de credenciais
 *             checkout:
 *               summary: Feature de Checkout
 *               value:
 *                 name: Checkout Process
 *                 description: Processo completo de finalização de compra incluindo pagamento e confirmação
 *     responses:
 *       200:
 *         description: Cenários gerados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenerateResponse'
 *       400:
 *         description: Erro de validação nos dados de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-ai-provider');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return scenarioController.generateScenarios(req, res);
}
