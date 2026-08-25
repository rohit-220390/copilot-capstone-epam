import type { Book } from '../catalog/book.js';
import type { ValidatedSearchFilters } from './validate-filters.js';
import { isWithinPublicationWindow } from './date-filter.js';
import { getFilterOptions } from '../catalog/filter-catalog.js';

export interface Pagination {
  page: number;
  limit: number;
}

export interface SearchResult {
  items: Book[];
  total: number;
  page: number;
  limit: number;
}

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;

/** Validates and normalizes raw page/limit query params (per docs/design-review.md DR-006): rejects non-positive-integer values, clamps limit to MAX_LIMIT. */
export function parsePagination(rawPage?: string, rawLimit?: string): Pagination {
  const page = rawPage === undefined ? DEFAULT_PAGE : Number(rawPage);
  const limit = rawLimit === undefined ? DEFAULT_LIMIT : Number(rawLimit);

  if (!Number.isInteger(page) || page < 1) {
    throw new Error(`Invalid page: ${String(rawPage)}`);
  }
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error(`Invalid limit: ${String(rawLimit)}`);
  }

  return { page, limit: Math.min(limit, MAX_LIMIT) };
}

/**
 * Filters the catalog by validated filters, then paginates. Category/format/language are exact
 * matches; publicationDate is threshold-based. minRating is bucketed (exclusive of the next
 * higher tier) so each Customer Reviews option shows a distinct rating range rather than an
 * overlapping "and above" set — e.g. "3-stars" means [3, 4), "4-stars" means [4, 5]. Fiction and
 * Non-Fiction run through the same code path, parameterized only by `filters.category`.
 */
export function searchBooks(
  catalog: Book[],
  filters: ValidatedSearchFilters,
  pagination: Pagination,
  referenceTime: Date = new Date(),
): SearchResult {
  const matched = catalog.filter((book) => {
    if (book.category !== filters.category) return false;
    if (filters.format && book.format !== filters.format) return false;
    if (filters.language && book.language !== filters.language) return false;
    if (
      filters.publicationDate &&
      !isWithinPublicationWindow(book.publicationDate, filters.publicationDate, referenceTime)
    ) {
      return false;
    }
    if (filters.minRating !== undefined) {
      if (book.averageRating < filters.minRating) return false;
      const tiers = getFilterOptions(filters.category).minRating.slice().sort((a, b) => a - b);
      const nextTier = tiers[tiers.indexOf(filters.minRating) + 1];
      if (nextTier !== undefined && book.averageRating >= nextTier) return false;
    }
    return true;
  });

  const start = (pagination.page - 1) * pagination.limit;
  const items = matched.slice(start, start + pagination.limit);

  return { items, total: matched.length, page: pagination.page, limit: pagination.limit };
}
