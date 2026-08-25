import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadEnvFile } from '../../src/env.js';

describe('loadEnvFile', () => {
  const originalEnv = { ...process.env };
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'env-test-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
    process.env = { ...originalEnv };
  });

  it('sets variables from a KEY=VALUE file', () => {
    const path = join(dir, '.env');
    writeFileSync(path, 'FOO=bar\nBAZ=qux\n');
    loadEnvFile(path);
    expect(process.env.FOO).toBe('bar');
    expect(process.env.BAZ).toBe('qux');
  });

  it('ignores blank lines and comments', () => {
    const path = join(dir, '.env');
    writeFileSync(path, '# comment\n\nFOO=bar\n');
    loadEnvFile(path);
    expect(process.env.FOO).toBe('bar');
  });

  it('does not override an already-set environment variable', () => {
    process.env.FOO = 'already-set';
    const path = join(dir, '.env');
    writeFileSync(path, 'FOO=from-file\n');
    loadEnvFile(path);
    expect(process.env.FOO).toBe('already-set');
  });

  it('does nothing when the file does not exist', () => {
    expect(() => loadEnvFile(join(dir, 'missing.env'))).not.toThrow();
  });
});
