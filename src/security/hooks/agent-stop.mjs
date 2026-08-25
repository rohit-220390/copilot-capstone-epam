import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SECRET_PATTERNS = [
  { name: 'atlassian-token', regex: /ATATT3x[a-zA-Z0-9_-]+/ },
  { name: 'bearer-header', regex: /Bearer\s+(?=[A-Za-z0-9\-._~+/]*\d)[A-Za-z0-9\-._~+/]{8,}=*/ },
  { name: 'hardcoded-credential', regex: /(?:password|secret|apitoken)\s*[:=]\s*["'][^"'\s]{6,}["']/i },
];
const SCAN_ROOTS = ['src', 'docs', '.github'];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);

function collectFiles(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((entry) => {
    if (SKIP_DIRS.has(entry)) return [];
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    return stat.isDirectory() ? collectFiles(fullPath) : [fullPath];
  });
}

function findSecrets() {
  const hits = [];
  for (const root of SCAN_ROOTS) {
    for (const file of collectFiles(root)) {
      if (file.endsWith('.env.example')) continue;
      const content = readFileSync(file, 'utf-8');
      for (const { name, regex } of SECRET_PATTERNS) {
        if (regex.test(content)) hits.push(`${relative(process.cwd(), file)} (${name})`);
      }
    }
  }
  return hits;
}

const secretHits = findSecrets();

// agentStop fires on every main-agent turn, so only block on a concrete secret finding.
if (secretHits.length > 0) {
  console.log(
    JSON.stringify({
      decision: 'block',
      reason: `Secret-like pattern(s) detected: ${secretHits.join(', ')}. Remove the credential(s) before continuing.`,
    }),
  );
} else {
  console.log(JSON.stringify({ decision: 'allow' }));
}

