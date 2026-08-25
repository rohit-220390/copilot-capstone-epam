import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
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

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf-8'));
  } catch {
    return {};
  }
}

const input = readInput();
const agentName = input.agentName ?? input.agent_name ?? '';

const secretHits = findSecrets();
if (secretHits.length > 0) {
  console.log(
    JSON.stringify({
      decision: 'block',
      reason: `Secret-like pattern(s) detected: ${secretHits.join(', ')}. Remove the credential(s) before completing this subagent.`,
    }),
  );
  process.exit(0);
}

// PR agent must have recorded a changelog entry before it is allowed to finish.
if (agentName === 'pr') {
  const changelog = existsSync('docs/changelog.md') ? readFileSync('docs/changelog.md', 'utf-8') : '';
  if (!/##\s+\[/.test(changelog)) {
    console.log(
      JSON.stringify({ decision: 'block', reason: 'docs/changelog.md has no dated entry yet. Add a changelog entry before finishing.' }),
    );
    process.exit(0);
  }
}

console.log(JSON.stringify({ decision: 'allow' }));

