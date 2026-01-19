import * as scenarioController from '../../src/controllers/scenario.controller.js';

/**
 * @swagger
 * /api/v1/generated-scenarios:
 *   get:
 *     summary: Lista cenários gerados ou recupera um cenário específico
 *     description: Retorna todos os cenários de teste gerados ou um cenário específico pelo ID. Os cenários são salvos automaticamente no banco de dados após a geração.
 *     tags: [Scenarios]
 *     parameters:
 *       - $ref: '#/components/parameters/ScenarioId'
 *     responses:
 *       200:
 *         description: Lista de cenários ou cenário específico
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     total:
 *                       type: integer
 *                       description: Número total de cenários
 *                       example: 5
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ScenarioEntry'
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     data:
 *                       $ref: '#/components/schemas/ScenarioEntry'
 *       404:
 *         description: Cenário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: Scenario not found
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return scenarioController.getScenarios(req, res);
}
