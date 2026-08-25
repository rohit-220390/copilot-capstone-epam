import { evaluateToolUse } from '../../src/security/tool-policy.js';

describe('evaluateToolUse', () => {
  it('denies access to .env files', () => {
    const result = evaluateToolUse({ toolName: 'read_file', filePath: '.env' });
    expect(result.allowed).toBe(false);
  });

  it('denies access to nested credentials.json', () => {
    const result = evaluateToolUse({ toolName: 'read_file', filePath: 'config/credentials.json' });
    expect(result.allowed).toBe(false);
  });

  it('denies destructive git commands', () => {
    const result = evaluateToolUse({ toolName: 'run_in_terminal', command: 'git push --force origin main' });
    expect(result.allowed).toBe(false);
  });

  it('allows reading a normal source file', () => {
    const result = evaluateToolUse({ toolName: 'read_file', filePath: 'src/index.ts' });
    expect(result.allowed).toBe(true);
  });

  it('allows a safe terminal command', () => {
    const result = evaluateToolUse({ toolName: 'run_in_terminal', command: 'npm test' });
    expect(result.allowed).toBe(true);
  });
});
