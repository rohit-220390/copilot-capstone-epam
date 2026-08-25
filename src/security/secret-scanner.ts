export interface SecretMatch {
  pattern: string;
  file: string;
  line: number;
}

const SECRET_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  { name: 'atlassian-token', regex: /ATATT3x[a-zA-Z0-9_-]+/ },
  // require a digit in the token so plain English words after "Bearer"/"Basic" don't false-positive
  { name: 'bearer-header', regex: /Bearer\s+(?=[A-Za-z0-9\-._~+/]*\d)[A-Za-z0-9\-._~+/]{8,}=*/ },
  { name: 'basic-header', regex: /Basic\s+(?=[A-Za-z0-9+/]*\d)[A-Za-z0-9+/]{8,}=*/ },
  { name: 'query-token', regex: /(?:token|api_key)=[^&\s"']+/i },
  { name: 'hardcoded-credential', regex: /(?:password|secret|apitoken)\s*[:=]\s*["'][^"'\s]{6,}["']/i },
];

const EXCLUDED_FILES = new Set(['.env.example']);

/** Scans file content line-by-line for known credential patterns. */
export function scanContent(fileName: string, content: string): SecretMatch[] {
  if (EXCLUDED_FILES.has(fileName)) return [];

  const matches: SecretMatch[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    for (const { name, regex } of SECRET_PATTERNS) {
      if (regex.test(line)) {
        matches.push({ pattern: name, file: fileName, line: index + 1 });
      }
    }
  });

  return matches;
}
