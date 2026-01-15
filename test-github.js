import fs from 'fs';

const data = fs.readFileSync('examples/feature-example.json', 'utf8');

const url = 'http://localhost:3000/api/generate-scenarios';

console.log('🚀 Testando com GitHub Models API...');
console.log('📋 Feature:', JSON.parse(data).name);
console.log('');

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-ai-provider': 'github'
  },
  body: data
})
  .then(async res => {
    console.log('📊 Status:', res.status);
    const text = await res.text();
    console.log('');
    console.log('📝 Resposta:');
    console.log('─────────────────────────────────────');
    try {
      const json = JSON.parse(text);
      console.log(JSON.stringify(json, null, 2));
    } catch {
      console.log(text);
    }
  })
  .catch(err => {
    console.error('❌ Erro:', err.message);
  });
