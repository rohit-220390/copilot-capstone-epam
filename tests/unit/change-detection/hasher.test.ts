import { computeContentHash } from '../../../src/change-detection/hasher.js';

describe('computeContentHash', () => {
  it('produces the same hash for identical content regardless of criteria order', () => {
    const a = { title: 'T', description: 'D', acceptanceCriteria: ['one', 'two'] };
    const b = { title: 'T', description: 'D', acceptanceCriteria: ['two', 'one'] };
    expect(computeContentHash(a)).toBe(computeContentHash(b));
  });

  it('produces a different hash when description changes', () => {
    const a = { title: 'T', description: 'D1', acceptanceCriteria: [] };
    const b = { title: 'T', description: 'D2', acceptanceCriteria: [] };
    expect(computeContentHash(a)).not.toBe(computeContentHash(b));
  });

  it('trims whitespace before hashing', () => {
    const a = { title: 'T', description: 'D', acceptanceCriteria: [] };
    const b = { title: ' T ', description: ' D ', acceptanceCriteria: [] };
    expect(computeContentHash(a)).toBe(computeContentHash(b));
  });
});
