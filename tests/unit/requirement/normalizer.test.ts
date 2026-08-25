import {
  extractAcceptanceCriteria,
  normalizeRequirement,
  normalizeJiraIssue,
} from '../../../src/requirement/normalizer.js';

describe('extractAcceptanceCriteria', () => {
  it('extracts bullet list lines', () => {
    const result = extractAcceptanceCriteria('Overview text\n- Timeout must be 60s\n- Must be configurable');
    expect(result).toEqual(['Timeout must be 60s', 'Must be configurable']);
  });

  it('extracts numbered list lines', () => {
    const result = extractAcceptanceCriteria('Overview\n1. First rule\n2. Second rule');
    expect(result).toEqual(['First rule', 'Second rule']);
  });

  it('returns an empty array when there are no list items', () => {
    expect(extractAcceptanceCriteria('Just a paragraph of prose.')).toEqual([]);
  });

  it('extracts Gherkin scenarios from under a Jira wiki "h2. Acceptance Criteria" heading', () => {
    const description = [
      'h2. Business Value',
      '* Improves discoverability of titles.',
      '* Creates a consistent experience.',
      '',
      'h2. Acceptance Criteria',
      'Scenario: Filter availability',
      'Given I am viewing search results',
      'When the page loads',
      'Then I can see filters',
      '',
      'h2. Affected Areas',
      '* Search results UI',
    ].join('\n');

    const result = extractAcceptanceCriteria(description);

    expect(result).toEqual([
      'Scenario: Filter availability',
      'Given I am viewing search results',
      'When the page loads',
      'Then I can see filters',
    ]);
    expect(result).not.toContain('Improves discoverability of titles.');
    expect(result).not.toContain('Search results UI');
  });

  it('extracts bullet lines under a Markdown "## Acceptance Criteria" heading', () => {
    const description = ['Some intro text.', '', '## Acceptance Criteria', '- First rule', '- Second rule'].join('\n');
    expect(extractAcceptanceCriteria(description)).toEqual(['First rule', 'Second rule']);
  });

  it('captures nested "### Scenario" sub-headings under an "Additional Requirements" marker', () => {
    const description = [
      '## Acceptance Criteria',
      'Scenario: Filter availability',
      'Given I am viewing search results',
      'When the page loads',
      'Then I can see filters',
      '',
      'Additional Requirements',
      '',
      '### Scenario: Clear all filters',
      'Given I have applied filters',
      'When I select Clear All Filters',
      'Then all filters should be removed',
      '',
      '## Affected Areas',
      '- Search results UI',
    ].join('\n');

    const result = extractAcceptanceCriteria(description);

    expect(result).toEqual([
      'Scenario: Filter availability',
      'Given I am viewing search results',
      'When the page loads',
      'Then I can see filters',
      'Scenario: Clear all filters',
      'Given I have applied filters',
      'When I select Clear All Filters',
      'Then all filters should be removed',
    ]);
    // Guardrail: the bare "Additional Requirements" label is a marker, not a criterion.
    expect(result).not.toContain('Additional Requirements');
    expect(result).not.toContain('Search results UI');
  });
});

describe('normalizeRequirement', () => {
  it('builds a normalized requirement with a computed content hash', () => {
    const result = normalizeRequirement({
      source: 'jira',
      sourceId: 'PAY-123',
      title: 'Payment timeout',
      description: 'Overview\n- Timeout must be 60s',
      version: '5',
      updatedAt: '2026-01-01T00:00:00Z',
    });
    expect(result.source).toBe('jira');
    expect(result.acceptanceCriteria).toEqual(['Timeout must be 60s']);
    expect(result.contentHash).toHaveLength(64);
  });

  it('defaults links to an empty array when omitted', () => {
    const result = normalizeRequirement({
      source: 'jira',
      sourceId: '999',
      title: 'Usage Guide',
      description: 'Intro text',
      version: '3',
      updatedAt: '2026-01-02T00:00:00Z',
    });
    expect(result.links).toEqual([]);
  });
});

describe('normalizeJiraIssue', () => {
  it('extracts acceptance criteria from bullet list in description', () => {
    const issue = {
      key: 'ABC-1',
      fields: {
        summary: 'Payment timeout',
        description: 'Overview text\n- Timeout must be 60s\n- Must be configurable',
        updated: '2026-01-01T00:00:00Z',
      },
    };
    const result = normalizeJiraIssue(issue);
    expect(result.source).toBe('jira');
    expect(result.sourceId).toBe('ABC-1');
    expect(result.acceptanceCriteria).toEqual(['Timeout must be 60s', 'Must be configurable']);
  });

  it('handles a missing description gracefully', () => {
    const issue = { key: 'ABC-2', fields: { summary: 'Title only', updated: '2026-01-01T00:00:00Z' } };
    const result = normalizeJiraIssue(issue);
    expect(result.description).toBe('');
    expect(result.acceptanceCriteria).toEqual([]);
  });

  it('converts Jira wiki headings and bullets to Markdown', () => {
    const issue = {
      key: 'ABC-3',
      fields: {
        summary: 'Wiki formatting',
        description: ['h2. Business Value', '* First point.', '* Second point.'].join('\n'),
        updated: '2026-01-01T00:00:00Z',
      },
    };
    const result = normalizeJiraIssue(issue);
    expect(result.description).toBe(['## Business Value', '- First point.', '- Second point.'].join('\n'));
  });

  it('converts Jira wiki numbered lists to sequential Markdown ordered lists', () => {
    const issue = {
      key: 'ABC-4',
      fields: {
        summary: 'Numbered list',
        description: ['h2. Steps', '# First step.', '# Second step.', '# Third step.'].join('\n'),
        updated: '2026-01-01T00:00:00Z',
      },
    };
    const result = normalizeJiraIssue(issue);
    expect(result.description).toBe(
      ['## Steps', '1. First step.', '2. Second step.', '3. Third step.'].join('\n'),
    );
  });
});

