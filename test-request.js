import fs from 'fs';

const featureData = JSON.parse(
  fs.readFileSync('./examples/feature-example.json', 'utf-8')
);

const response = await fetch('http://localhost:3000/api/generate-tests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(featureData),
});

const result = await response.json();
console.log(JSON.stringify(result, null, 2));
