import {
  parseDocumentationMap,
  serializeDocumentationMap,
  findArtifactsForRequirement,
} from '../../../src/documentation-sync/documentation-map.js';

const SAMPLE = `# Documentation Map

| Requirement | Source | Repository Artifact | Impact Type |
|-------------|--------|-------------------|-------------|
| PAY-123 | Jira | docs/requirements.md | behavior |
| PAY-123 | Jira | docs/architecture.md | architecture |
`;

describe('parseDocumentationMap', () => {
  it('parses valid rows and ignores header/separator', () => {
    const entries = parseDocumentationMap(SAMPLE);
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual({
      requirementId: 'PAY-123',
      source: 'jira',
      artifact: 'docs/requirements.md',
      impactType: 'behavior',
    });
  });

  it('is case-insensitive for the source column', () => {
    const entries = parseDocumentationMap(SAMPLE);
    expect(entries.find((e) => e.requirementId === 'PAY-123')?.source).toBe('jira');
  });
});

describe('findArtifactsForRequirement', () => {
  it('returns all artifacts mapped to a requirement', () => {
    const entries = parseDocumentationMap(SAMPLE);
    expect(findArtifactsForRequirement(entries, 'PAY-123')).toEqual([
      'docs/requirements.md',
      'docs/architecture.md',
    ]);
  });

  it('returns an empty array for an unmapped requirement', () => {
    const entries = parseDocumentationMap(SAMPLE);
    expect(findArtifactsForRequirement(entries, 'UNKNOWN-1')).toEqual([]);
  });
});

describe('serializeDocumentationMap', () => {
  it('round-trips through parse and serialize', () => {
    const entries = parseDocumentationMap(SAMPLE);
    const serialized = serializeDocumentationMap(entries);
    const reparsed = parseDocumentationMap(serialized);
    expect(reparsed).toEqual(entries);
  });
});
