import fs from 'fs';

const data = fs.readFileSync('examples/feature-example.json', 'utf8');

const url = 'http://localhost:3000/api/generate-scenarios';

console.log('📤 Enviando requisição para:', url);
console.log('📋 Feature:', JSON.parse(data).name);

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: data
})
  .then(async res => {
    console.log('📊 Status:', res.status);
    const text = await res.text();
    console.log('📝 Resposta:');
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
