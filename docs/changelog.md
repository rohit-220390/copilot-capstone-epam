# Changelog

Human-readable change summary for the Agentic SDLC Documentation Sync project.

<!-- Entries added by the PR Agent -->

## [Unreleased] - 2026-08-25

### Added - EPMCDMETST-52015: Sorting Support for Non-Fiction Filters
**Scenario: "Filtering works with sorting"**

#### Core Data Model
- Extended `Book` interface with `price: number` field for sorting by price
- Updated seed data with realistic price values ($5-$50 range)
- Added books with identical prices for stable-sort testing (f1, nf4, nf11: $24.99; f4, nf2: $19.99)

#### Sorting Infrastructure
- New `SortOption` type: `'price-high-to-low' | 'price-low-to-high' | 'rating-high-to-low' | 'publication-date-newest' | 'publication-date-oldest' | 'relevance'`
- Added `getSortOptions(category)` function maintaining Fiction/Non-Fiction parity
- Implemented `sortBooks()` function with ES2019+ stable sort for consistent ordering

#### Query Execution
- Updated `searchBooks()` to enforce Filter → Sort → Paginate execution order (DR-013)
- Sorting applied after filtering, before pagination
- Applied filters remain active when sorting is selected (AC requirement)

#### API & Validation
- Extended API endpoint to accept `?sort=` query parameter
- Invalid sort values default to 'relevance' (graceful degradation, no errors per DR-014)
- Server-side sort validation against Sort Option Catalog

#### UI Components
- Added `selectSort(option: SortOption)` method to SearchFiltersPanel
- Sort state included in `SelectedFilters` interface
- Clear All Filters also resets sort to default (DR-017)

#### State Persistence
- Extended FilterStatePort to persist and restore sort selections
- Sort validation on restore: invalid persisted sort values are dropped (DR-010)
- Sort state preserved across page refresh alongside filters

#### Testing
- 80 tests passing with 92.5% code coverage
- New acceptance test: "Scenario: Filtering works with sorting"
- Tests verify: sort options parity, execution order, persistence, and integration with filters

### Technical Details
- Execution order: Filter → Sort → Paginate (per approved architecture DR-013)
- Stable sort using ES2019+ `Array.sort()` (Node 12+ compatible)
- Sort options identical for Fiction and Non-Fiction categories (parity requirement)
- Sorting operates on filtered result set, not full catalog
- Page resets to 1 when sort changes (same behavior as filter changes)
