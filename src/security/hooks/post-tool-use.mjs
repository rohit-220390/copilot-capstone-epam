import { readFileSync } from 'node:fs';

const REDACTION_PATTERNS = [
  /Authorization:\s*\S+(\s+\S+)?/gi,
  /Bearer\s+[A-Za-z0-9\-._~+/]+=*/g,
  /Basic\s+[A-Za-z0-9+/]+=*/g,
  /(?:token|api_key|apitoken|password|secret)\s*[:=]\s*["']?[^"'\s,}]+["']?/gi,
];

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf-8'));
  } catch {
    return {};
  }
}

const input = readInput();
const toolResult = input.toolResult ?? input.tool_result ?? {};
function extractText(result) {
  if (typeof result.textResultForLlm === 'string') return result.textResultForLlm;
  if (typeof result.text_result_for_llm === 'string') return result.text_result_for_llm;
  return '';
}
const original = extractText(toolResult);

let redacted = original;
for (const pattern of REDACTION_PATTERNS) {
  redacted = redacted.replace(pattern, '[REDACTED]');
}

if (redacted === original) {
  console.log(JSON.stringify({}));
} else {
  console.log(JSON.stringify({ modifiedResult: { resultType: 'success', textResultForLlm: redacted } }));
}

