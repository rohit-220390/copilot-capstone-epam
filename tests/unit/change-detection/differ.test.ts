import { calculateDelta } from '../../../src/change-detection/differ.js';
import type { NormalizedRequirement } from '../../../src/requirement/model.js';
import { computeContentHash } from '../../../src/change-detection/hasher.js';

function makeRequirement(overrides: Partial<NormalizedRequirement> = {}): NormalizedRequirement {
  const base = {
    source: 'jira' as const,
    sourceId: 'PAY-123',
    title: 'Payment timeout',
    description: 'Timeout is 30 seconds',
    acceptanceCriteria: ['Timeout must be configurable'],
    version: '1',
    updatedAt: '2026-01-01T00:00:00Z',
    links: [],
    ...overrides,
  };
  return { ...base, contentHash: computeContentHash(base) };
}

describe('calculateDelta', () => {
  it('classifies a brand new requirement as unclear with all fields added', () => {
    const current = makeRequirement();
    const delta = calculateDelta(undefined, current);
    expect(delta.impactType).toBe('unclear');
    expect(delta.added).toContain('description');
  });

  it('returns documentation-only when content hash is unchanged', () => {
    const previous = makeRequirement();
    const current = makeRequirement();
    const delta = calculateDelta(previous, current);
    expect(delta.impactType).toBe('documentation-only');
    expect(delta.modified).toHaveLength(0);
  });

  it('classifies a description change as code-impacting', () => {
    const previous = makeRequirement({ description: 'Timeout is 30 seconds' });
    const current = makeRequirement({ description: 'Timeout is 60 seconds' });
    const delta = calculateDelta(previous, current);
    expect(delta.impactType).toBe('code-impacting');
    expect(delta.modified).toContain('description');
  });

  it('classifies an acceptance criteria change as test-impacting', () => {
    const previous = makeRequirement({ acceptanceCriteria: ['A'] });
    const current = makeRequirement({ acceptanceCriteria: ['A', 'B'] });
    const delta = calculateDelta(previous, current);
    expect(delta.impactType).toBe('test-impacting');
    expect(delta.added).toContain('B');
  });
});
