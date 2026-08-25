import { readFileSync, appendFileSync, mkdirSync } from 'node:fs';

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf-8'));
  } catch {
    return {};
  }
}

const input = readInput();
const record = { timestamp: new Date().toISOString(), event: 'sessionEnd', reason: input.reason ?? 'unknown' };

mkdirSync('.github/workflow-state', { recursive: true });
appendFileSync('.github/workflow-state/audit.log', `${JSON.stringify(record)}\n`);

// sessionEnd output is not processed by the runtime; nothing further to emit.

