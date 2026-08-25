import { scanContent } from '../../src/security/secret-scanner.js';

describe('scanContent', () => {
  it('detects an Atlassian API token pattern', () => {
    const matches = scanContent('config.ts', 'const token = "ATATT3xFfGF0abcdef123456";');
    expect(matches.some((m) => m.pattern === 'atlassian-token')).toBe(true);
  });

  it('detects a Bearer authorization header', () => {
    const matches = scanContent('log.txt', 'Authorization: Bearer abc123.def456');
    expect(matches.some((m) => m.pattern === 'bearer-header')).toBe(true);
  });

  it('detects a hardcoded password assignment', () => {
    const matches = scanContent('config.ts', 'const password = "hunter2!";');
    expect(matches.some((m) => m.pattern === 'hardcoded-credential')).toBe(true);
  });

  it('ignores .env.example regardless of content', () => {
    const matches = scanContent('.env.example', 'JIRA_API_TOKEN=ATATT3xFfGF0abcdef123456');
    expect(matches).toHaveLength(0);
  });

  it('returns no matches for clean content', () => {
    const matches = scanContent('readme.md', 'This is a normal document with no secrets.');
    expect(matches).toHaveLength(0);
  });
});
