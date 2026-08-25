import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { scanContent } from './secret-scanner.js';

const SCAN_ROOTS = ['src', 'mcp', 'docs', '.github'];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);

function collectFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (SKIP_DIRS.has(entry)) return [];
    const stat = statSync(fullPath);
    return stat.isDirectory() ? collectFiles(fullPath) : [fullPath];
  });
}

let totalMatches = 0;

for (const root of SCAN_ROOTS) {
  let files: string[];
  try {
    files = collectFiles(root);
  } catch {
    continue;
  }

  for (const file of files) {
    const relativePath = relative(process.cwd(), file);
    const content = readFileSync(file, 'utf-8');
    const matches = scanContent(relativePath, content);
    for (const match of matches) {
      console.error(`[SECRET DETECTED] ${match.file}:${match.line} (${match.pattern})`);
      totalMatches += 1;
    }
  }
}

if (totalMatches > 0) {
  console.error(`\n${totalMatches} potential secret(s) found.`);
  process.exit(1);
}

console.log('Secret scan passed: no credentials detected.');
