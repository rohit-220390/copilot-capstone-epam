import { checkDocumentQuality } from '../../../src/validation/doc-quality.js';

describe('checkDocumentQuality', () => {
  it('flags a document missing an H1 title', () => {
    const issues = checkDocumentQuality('doc.md', 'Just some text', new Set());
    expect(issues.some((i) => i.rule === 'require-h1')).toBe(true);
  });

  it('passes a document with an H1 title and no links', () => {
    const issues = checkDocumentQuality('doc.md', '# Title\n\nBody text.', new Set());
    expect(issues).toHaveLength(0);
  });

  it('flags a broken internal link', () => {
    const issues = checkDocumentQuality('doc.md', '# Title\n\nSee [other](missing.md).', new Set(['present.md']));
    expect(issues.some((i) => i.rule === 'no-broken-links')).toBe(true);
  });

  it('does not flag existing internal links or external URLs', () => {
    const issues = checkDocumentQuality(
      'doc.md',
      '# Title\n\nSee [other](present.md) and [ext](https://example.com).',
      new Set(['present.md']),
    );
    expect(issues).toHaveLength(0);
  });
});
