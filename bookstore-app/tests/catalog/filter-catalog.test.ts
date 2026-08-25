import { getFilterOptions } from '../../src/catalog/filter-catalog.js';

describe('getFilterOptions', () => {
  it('returns identical filter groups/options for fiction and non-fiction (parity requirement)', () => {
    expect(getFilterOptions('fiction')).toEqual(getFilterOptions('non-fiction'));
  });

  it('includes all four required filter groups with the specified options', () => {
    const options = getFilterOptions('fiction');
    expect(options.format).toEqual(['hardcover', 'paperback', 'ebook', 'audiobook']);
    expect(options.language).toEqual(['english', 'spanish', 'french', 'german']);
    expect(options.publicationDate).toEqual(['last-30-days', 'last-6-months', 'last-year']);
    expect(options.minRating).toEqual([3, 4]);
  });
});
