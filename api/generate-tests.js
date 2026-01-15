import { QAAgent } from '../src/agents/qa-agent.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const featureData = req.body;
    
    const aiProvider = req.headers['x-ai-provider'] || 'openai';
    const qaAgent = new QAAgent(aiProvider);
    
    const result = await qaAgent.generateTestScenarios(featureData);
    
    if (result.success) {
      // Salvar resultado em arquivo
      try {
        const resultsDir = path.join(process.cwd(), 'results');
        
        // Criar pasta results se não existir
        if (!fs.existsSync(resultsDir)) {
          fs.mkdirSync(resultsDir, { recursive: true });
        }
        
        // Gerar nome do arquivo baseado no nome da feature
        const featureName = featureData.name || 'unnamed-feature';
        const sanitizedName = featureName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        
        const fileName = `feature-${sanitizedName}.json`;
        const filePath = path.join(resultsDir, fileName);
        
        // Salvar arquivo
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf8');
        
        // Adicionar caminho do arquivo na resposta
        result.savedTo = fileName;
        
        console.log(`✅ Resultado salvo em: ${filePath}`);
      } catch (saveError) {
        console.error('⚠️ Erro ao salvar arquivo:', saveError.message);
        // Não falha a requisição se houver erro ao salvar
      }
      
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}