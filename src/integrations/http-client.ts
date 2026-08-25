export interface HttpClientConfig {
  baseUrl: string;
  /** Personal Access Token — sent as `Authorization: Bearer <token>`. Preferred for Jira Data Center. */
  authToken?: string;
  /** Account email — combined with authToken as Basic auth. Used for Jira Cloud API tokens. */
  email?: string;
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    // unref so a pending retry backoff never keeps the Node process/test worker alive.
    setTimeout(resolve, ms).unref();
  });
}


function buildAuthHeader(config: HttpClientConfig): string {
  if (!config.authToken) {
    throw new Error('No auth token configured.');
  }
  // Cloud API tokens are paired with an account email via Basic auth; Data Center PATs use Bearer alone.
  if (config.email) {
    const credentials = `${config.email}:${config.authToken}`;
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
  }
  return `Bearer ${config.authToken}`;
}

/** Shared authenticated REST client with bounded retry/backoff for both Atlassian products (Cloud or Data Center). */
export async function authenticatedFetch(
  config: HttpClientConfig,
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const url = `${config.baseUrl}${path}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: buildAuthHeader(config),
        Accept: 'application/json',
      },
    });

    if (response.status === 401 || response.status === 403) {
      throw new HttpError(response.status, 'Authentication/authorization failed. Check credentials configuration.');
    }
    if (response.status === 404) {
      throw new HttpError(404, 'Not Found');
    }
    if (response.status === 429 || response.status >= 500) {
      if (attempt === MAX_RETRIES) {
        throw new HttpError(response.status, `Request failed after ${MAX_RETRIES} retries`);
      }
      await sleep(BASE_BACKOFF_MS * 2 ** attempt);
      continue;
    }
    if (!response.ok) {
      throw new HttpError(response.status, `Unexpected response: ${response.status}`);
    }

    return response.json();
  }

  throw new HttpError(0, 'Unreachable retry loop exit');
}
