import { readFileSync, appendFileSync, mkdirSync } from 'node:fs';

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf-8'));
  } catch {
    return {};
  }
}

const input = readInput();
const errorContext = input.errorContext ?? input.error_context ?? 'unknown';
const errorMessage = input.error?.message ?? 'unknown error';
const record = {
  timestamp: new Date().toISOString(),
  event: 'errorOccurred',
  errorContext,
  errorMessage,
  recoverable: input.recoverable ?? null,
};

mkdirSync('.github/workflow-state', { recursive: true });
appendFileSync('.github/workflow-state/audit.log', `${JSON.stringify(record)}\n`);

// errorOccurred output is not processed by the runtime; nothing further to emit.

