export interface ToolUseRequest {
  toolName: string;
  filePath?: string;
  command?: string;
}

export interface ToolPolicyResult {
  allowed: boolean;
  reason?: string;
}

const DENIED_FILE_PATTERNS = [/(^|\/)\.env($|\.[^.]+$)/, /credentials\.json$/i];
const DENIED_COMMAND_PATTERNS = [/rm\s+-rf\s+\//, /git\s+push\s+--force/, /git\s+reset\s+--hard/];

/** Deterministic allow/deny check invoked by the preToolUse hook before any tool executes. */
export function evaluateToolUse(request: ToolUseRequest): ToolPolicyResult {
  if (request.filePath && DENIED_FILE_PATTERNS.some((pattern) => pattern.test(request.filePath!))) {
    return { allowed: false, reason: `Access to credential file denied: ${request.filePath}` };
  }
  if (request.command && DENIED_COMMAND_PATTERNS.some((pattern) => pattern.test(request.command!))) {
    return { allowed: false, reason: `Destructive command denied: ${request.command}` };
  }
  return { allowed: true };
}
