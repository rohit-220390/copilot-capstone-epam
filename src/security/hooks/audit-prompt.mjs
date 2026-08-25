import { readFileSync, appendFileSync, mkdirSync } from 'node:fs';

const REDACTION_PATTERNS = [/Bearer\s+\S+/gi, /Basic\s+\S+/gi, /(?:token|password|secret)\s*[:=]\s*\S+/gi];

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf-8'));
  } catch {
    return {};
  }
}

const input = readInput();
let prompt = typeof input.prompt === 'string' ? input.prompt : '';
for (const pattern of REDACTION_PATTERNS) {
  prompt = prompt.replace(pattern, '[REDACTED]');
}

const record = { timestamp: new Date().toISOString(), event: 'userPromptSubmitted', promptPreview: prompt.slice(0, 200) };
mkdirSync('.github/workflow-state', { recursive: true });
appendFileSync('.github/workflow-state/audit.log', `${JSON.stringify(record)}\n`);

// userPromptSubmitted output is not honored by command hooks; emit {} per the documented contract.
console.log(JSON.stringify({}));

