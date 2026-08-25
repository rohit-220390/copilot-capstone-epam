import { redact } from '../../src/security/redactor.js';

describe('redact', () => {
  it('redacts Authorization header values', () => {
    const result = redact('Authorization: Bearer abc123.def456');
    expect(result).not.toContain('abc123');
    expect(result).toContain('[REDACTED]');
  });

  it('redacts Basic auth headers', () => {
    const result = redact('sending header Basic dXNlcjpwYXNz to server');
    expect(result).not.toContain('dXNlcjpwYXNz');
  });

  it('redacts token/password key-value pairs', () => {
    const result = redact('config: { token: "abc123", password: "secretvalue" }');
    expect(result).not.toContain('abc123');
    expect(result).not.toContain('secretvalue');
  });

  it('leaves non-sensitive text unchanged', () => {
    const text = 'This is a normal log line with no secrets.';
    expect(redact(text)).toBe(text);
  });
});
