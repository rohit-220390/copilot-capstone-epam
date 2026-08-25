const REDACTION_PATTERNS: RegExp[] = [
  /Authorization:\s*\S+(\s+\S+)?/gi,
  /Bearer\s+[A-Za-z0-9\-._~+/]+=*/g,
  /Basic\s+[A-Za-z0-9+/]+=*/g,
  /(?:token|api_key|apitoken|password|secret)\s*[:=]\s*["']?[^"'\s,}]+["']?/gi,
];

/** Replaces credential-shaped substrings with a fixed placeholder before logging. */
export function redact(text: string): string {
  return REDACTION_PATTERNS.reduce((result, pattern) => result.replace(pattern, '[REDACTED]'), text);
}
