import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const HOOKS_DIR = join(process.cwd(), 'src', 'security', 'hooks');

function runHook(scriptName: string, input: unknown, cwd = process.cwd()): Record<string, unknown> {
  const output = execFileSync('node', [join(HOOKS_DIR, scriptName)], {
    cwd,
    input: JSON.stringify(input),
    encoding: 'utf-8',
  });
  return JSON.parse(output);
}

describe('pre-tool-use hook', () => {
  it('denies edits to .env using the real toolArgs.filePath shape', () => {
    const result = runHook('pre-tool-use.mjs', {
      toolName: 'edit',
      toolArgs: { filePath: '.env' },
    });
    expect(result.permissionDecision).toBe('deny');
  });

  it('denies destructive bash commands using the real toolArgs.command shape', () => {
    const result = runHook('pre-tool-use.mjs', {
      toolName: 'bash',
      toolArgs: { command: 'git push --force origin main' },
    });
    expect(result.permissionDecision).toBe('deny');
  });

  it('allows safe tool calls', () => {
    const result = runHook('pre-tool-use.mjs', {
      toolName: 'bash',
      toolArgs: { command: 'npm test' },
    });
    expect(result.permissionDecision).toBe('allow');
  });
});

describe('post-tool-use hook', () => {
  it('redacts credentials from toolResult.textResultForLlm', () => {
    const result = runHook('post-tool-use.mjs', {
      toolName: 'bash',
      toolResult: { resultType: 'success', textResultForLlm: 'Authorization: Bearer abc123.def456xyz' },
    }) as { modifiedResult?: { textResultForLlm: string } };
    expect(result.modifiedResult?.textResultForLlm).toContain('[REDACTED]');
  });

  it('returns an empty object when there is nothing to redact', () => {
    const result = runHook('post-tool-use.mjs', {
      toolName: 'bash',
      toolResult: { resultType: 'success', textResultForLlm: 'ordinary output' },
    });
    expect(result.modifiedResult).toBeUndefined();
  });
});

describe('agent-stop hook', () => {
  it('allows completion when no secrets are present in the repo', () => {
    const result = runHook('agent-stop.mjs', { stopReason: 'end_turn' });
    expect(result.decision).toBe('allow');
  });
});

describe('subagent-stop hook', () => {
  it('blocks the pr agent when docs/changelog.md has no dated entry', () => {
    const fixtureDir = mkdtempSync(join(tmpdir(), 'subagent-stop-hook-'));
    try {
      const result = runHook('subagent-stop.mjs', { agentName: 'pr', response: 'done' }, fixtureDir);
      expect(result.decision).toBe('block');
    } finally {
      rmSync(fixtureDir, { recursive: true, force: true });
    }
  });

  it('allows non-pr subagents to complete when no secrets are present', () => {
    const result = runHook('subagent-stop.mjs', { agentName: 'architecture', response: 'done' });
    expect(result.decision).toBe('allow');
  });
});
