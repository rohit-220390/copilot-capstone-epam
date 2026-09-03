# Documentation Map

Mapping between source requirements and repository artifacts.

| Requirement | Source | Repository Artifact | Impact Type |
|-------------|--------|-------------------|-------------|
| EPMCDMETST-52015 | Jira | [docs/requirements.md](./requirements.md) | test-impacting |
| EPMCDMETST-52015 | Jira | [docs/architecture.md](./architecture.md) | architecture-impacting |
| EPMCDMETST-52015 | Jira | [docs/design-review.md](./design-review.md) | architecture-impacting |
| EPMCDMETST-52015 | Jira | [docs/impl-plan.md](./impl-plan.md) | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/catalog/book.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/catalog/filter-catalog.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/catalog/seed-data.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/catalog/seed-data.json` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/search/validate-filters.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/search/date-filter.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/search/query-builder.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/api/search-endpoint.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/api/start.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/api/app-server.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/web/search-filters-panel.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/web/results-view.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/web/filter-state-persistence.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/src/web/browser-app.ts` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/public/index.html` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/public/styles.css` | code-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/tests/catalog/filter-catalog.test.ts` | test-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/tests/search/validate-filters.test.ts` | test-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/tests/search/date-filter.test.ts` | test-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/tests/search/query-builder.test.ts` | test-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/tests/api/search-endpoint.test.ts` | test-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/tests/web/search-filters-panel.test.ts` | test-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/tests/web/results-view.test.ts` | test-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/tests/web/filter-state-persistence.test.ts` | test-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/tests/acceptance/non-fiction-filters.test.ts` | test-impacting |
| EPMCDMETST-52015 | Jira | `bookstore-app/tests/api/app-server.test.ts` | test-impacting |
<!-- Maintained by the Documentation Agent -->
<!-- Last synchronized: 2026-08-25 - Added sorting support (price field, sort options catalog, sort query builder logic) per "Scenario: Filtering works with sorting" -->

## Change Summary for EPMCDMETST-52015

### Initial Implementation (Filtering + Clear All + Persistence)
- Non-Fiction search filters with Fiction parity (6 scenarios)
- Clear All Filters functionality
- Filter state persistence across page refresh

### Delta: Sorting Integration (Current)
- **New Scenario**: "Filtering works with sorting"
- **Modified**: `Book` model extended with `price` field
- **Modified**: `filter-catalog.ts` - added `SortOption` type and `getSortOptions()`
- **Modified**: `query-builder.ts` - added sorting logic (Filter → Sort → Paginate)
- **Modified**: `validate-filters.ts` - added sort parameter validation
- **Modified**: `seed-data.json` - added price values ($5-$50 range, includes duplicates for stable-sort testing)
- **Modified**: All affected components to support sort state in `SelectedFilters`

### Execution Order
Per approved architecture (DR-013): **Filter → Sort → Paginate**

