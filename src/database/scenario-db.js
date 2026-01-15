import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', '..', 'database', 'scenarios.json');

// Ensure database directory and file exist
const ensureDatabase = () => {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ scenarios: [] }, null, 2));
  }
};

// Read all scenarios from database
export const getAllScenarios = () => {
  ensureDatabase();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

// Save a new scenario group
export const saveScenario = (featureData, generatedScenarios, provider = 'openai') => {
  ensureDatabase();
  const db = getAllScenarios();

  const scenarioEntry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    feature: featureData,
    scenarios: generatedScenarios,
    provider,
  };

  db.scenarios.push(scenarioEntry);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

  return scenarioEntry;
};

// Get scenario by ID
export const getScenarioById = id => {
  const db = getAllScenarios();
  return db.scenarios.find(scenario => scenario.id === id);
};

// Delete scenario by ID
export const deleteScenarioById = id => {
  ensureDatabase();
  const db = getAllScenarios();
  const initialLength = db.scenarios.length;

  db.scenarios = db.scenarios.filter(scenario => scenario.id !== id);

  if (db.scenarios.length === initialLength) {
    return null; // Not found
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  return true;
};
