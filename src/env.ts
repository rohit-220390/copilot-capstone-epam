import { readFileSync, existsSync } from 'node:fs';

/** Parses simple KEY=VALUE lines from a .env file into process.env, without overriding already-set variables. */
export function loadEnvFile(path = '.env'): void {
  if (!existsSync(path)) return;

  const content = readFileSync(path, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}
