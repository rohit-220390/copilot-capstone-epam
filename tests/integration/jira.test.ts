import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getIssue, searchIssues } from '../../src/integrations/jira/jira-adapter.js';
import type { HttpClientConfig } from '../../src/integrations/http-client.js';
import { mockFetch } from './test-utils.js';

const patConfig: HttpClientConfig = { baseUrl: 'https://jira.company.com', authToken: 'pat-token' };
const cloudConfig: HttpClientConfig = { baseUrl: 'https://test.atlassian.net', authToken: 'api-token', email: 'a@b.com' };

describe('jira-adapter integration', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('retrieves a single issue using API v2 (Data Center + Cloud compatible)', async () => {
    const issue = { key: 'ABC-1', fields: { summary: 'Timeout', updated: '2026-01-01T00:00:00Z' } };
    (global as unknown as { fetch: unknown }).fetch = mockFetch().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => issue,
    });

    const result = await getIssue(patConfig, 'ABC-1');
    expect(result.key).toBe('ABC-1');
  });

  it('sends a Bearer header when only authToken is configured (Data Center PAT)', async () => {
    const fetchMock = mockFetch().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    (global as unknown as { fetch: unknown }).fetch = fetchMock;

    await getIssue(patConfig, 'ABC-1');
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer pat-token');
  });

  it('sends a Basic header when email + authToken are configured (Cloud)', async () => {
    const fetchMock = mockFetch().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    (global as unknown as { fetch: unknown }).fetch = fetchMock;

    await getIssue(cloudConfig, 'ABC-1');
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toMatch(/^Basic /);
  });

  it('throws on 401 without exposing the token', async () => {
    (global as unknown as { fetch: unknown }).fetch = mockFetch().mockResolvedValue({ ok: false, status: 401 });
    await expect(getIssue(patConfig, 'ABC-1')).rejects.toThrow(/Authentication/);
  });

  it('paginates through search results', async () => {
    const page1 = { issues: [{ key: 'A-1' }], startAt: 0, maxResults: 1, total: 2 };
    const page2 = { issues: [{ key: 'A-2' }], startAt: 1, maxResults: 1, total: 2 };
    let call = 0;
    (global as unknown as { fetch: unknown }).fetch = mockFetch().mockImplementation(() => {
      call += 1;
      return Promise.resolve({ ok: true, status: 200, json: async () => (call === 1 ? page1 : page2) });
    });

    const results = await searchIssues(patConfig, 'project = ABC');
    expect(results).toHaveLength(2);
  });

  it('marks 404 responses appropriately', async () => {
    (global as unknown as { fetch: unknown }).fetch = mockFetch().mockResolvedValue({ ok: false, status: 404 });
    await expect(getIssue(patConfig, 'MISSING-1')).rejects.toThrow('Not Found');
  });
});
