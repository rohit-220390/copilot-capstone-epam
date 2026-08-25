import { authenticatedFetch, type HttpClientConfig } from '../http-client.js';

export interface JiraIssueResponse {
  key: string;
  fields: {
    summary: string;
    description?: string;
    updated: string;
  };
}

interface JiraSearchResponse {
  issues: JiraIssueResponse[];
  startAt: number;
  maxResults: number;
  total: number;
}

interface JiraChangelogResponse {
  values: Array<{ created: string; items: Array<{ field: string; fromString: string; toString: string }> }>;
}

export function loadJiraConfig(): HttpClientConfig {
  const baseUrl = process.env.JIRA_BASE_URL;
  const authToken = process.env.JIRA_AUTH_TOKEN;
  const email = process.env.JIRA_EMAIL;
  if (!baseUrl || !authToken) {
    throw new Error('Jira configuration missing. Set JIRA_BASE_URL and JIRA_AUTH_TOKEN (plus JIRA_EMAIL for Cloud).');
  }
  return { baseUrl, authToken, email };
}

// API v2 is supported by both Jira Cloud and Jira Data Center/Server; v3 is Cloud-only.
export async function getIssue(config: HttpClientConfig, key: string): Promise<JiraIssueResponse> {
  return (await authenticatedFetch(config, `/rest/api/2/issue/${encodeURIComponent(key)}`)) as JiraIssueResponse;
}

/** Iterates Jira's startAt/maxResults pagination until all matching issues are collected. */
export async function searchIssues(config: HttpClientConfig, jql: string): Promise<JiraIssueResponse[]> {
  const results: JiraIssueResponse[] = [];
  let startAt = 0;
  const maxResults = 50;

  for (;;) {
    const page = (await authenticatedFetch(
      config,
      `/rest/api/2/search?jql=${encodeURIComponent(jql)}&startAt=${startAt}&maxResults=${maxResults}`,
    )) as JiraSearchResponse;
    results.push(...page.issues);
    if (startAt + page.issues.length >= page.total) break;
    startAt += maxResults;
  }

  return results;
}

export async function getIssueHistory(config: HttpClientConfig, key: string): Promise<JiraChangelogResponse> {
  return (await authenticatedFetch(
    config,
    `/rest/api/2/issue/${encodeURIComponent(key)}/changelog`,
  )) as JiraChangelogResponse;
}
