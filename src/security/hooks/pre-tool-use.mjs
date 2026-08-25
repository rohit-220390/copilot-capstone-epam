import { readFileSync } from 'node:fs';

const DENIED_FILE_PATTERNS = [/(^|\/)\.env($|\.[^.]+$)/, /credentials\.json$/i];
const DENIED_COMMAND_PATTERNS = [/rm\s+-rf\s+\//, /git\s+push\s+--force/, /git\s+reset\s+--hard/];

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf-8'));
  } catch {
    return {};
  }
}

// toolArgs shape varies by tool, so probe the field names likely to hold a path or command.
function extractPath(toolArgs) {
  if (!toolArgs || typeof toolArgs !== 'object') return undefined;
  return toolArgs.filePath ?? toolArgs.path ?? toolArgs.file;
}

function extractCommand(toolArgs) {
  if (!toolArgs || typeof toolArgs !== 'object') return undefined;
  return toolArgs.command;
}

const input = readInput();
const toolArgs = input.toolArgs ?? input.tool_input;
const filePath = extractPath(toolArgs) ?? '';
const command = extractCommand(toolArgs) ?? '';

if (DENIED_FILE_PATTERNS.some((p) => p.test(filePath))) {
  console.log(
    JSON.stringify({ permissionDecision: 'deny', permissionDecisionReason: `Access to credential file denied: ${filePath}` }),
  );
  process.exit(0);
}

if (DENIED_COMMAND_PATTERNS.some((p) => p.test(command))) {
  console.log(
    JSON.stringify({ permissionDecision: 'deny', permissionDecisionReason: `Destructive command denied: ${command}` }),
  );
  process.exit(0);
}

console.log(JSON.stringify({ permissionDecision: 'allow' }));

