# Requirements

This document contains approved requirements and acceptance criteria synchronized from Jira.

## Requirements Register

<!-- Requirements will be added here by the Requirement Analyst Agent -->
<!-- Each entry includes: source, sourceId, title, description, acceptanceCriteria, version -->

### EPMCDMETST-52015 (jira)

**Title:** Add filters to Non‑Fiction book search results (parity with Fiction)

## General Description

As a bookstore customer browsing Non‑Fiction books,
I want the same filtering options available in Fiction (format, language, publication date, and customer reviews),
So that I can narrow down Non‑Fiction search results easily and have a consistent browsing experience across categories.
## Business Value
 * Improves discoverability of Non‑Fiction titles by enabling users to narrow large result sets.
 * Creates consistent, predictable filtering experience across Fiction and Non‑Fiction categories.

## Preconditions
 * User can access Non‑Fiction search results page.
 * Fiction search results already support filters for Book Format, Language, Publication Date, and Customer Reviews.

## Scenarios of Use
 # User opens Non‑Fiction search results and uses filters to narrow results.
 # User applies Book Format filter to see only hardcover/paperback/eBook/audiobook.
 # User applies Language filter to see only books in selected language(s).
 # User applies Publication Date filter to see titles from last 30 days / last 6 months / last year.
 # User applies Customer Reviews filter to see titles with 3+ or 4+ stars.
 # User switches between Fiction and Non‑Fiction and expects consistent filter categories/options.

## Expected Result

Non‑Fiction search results display the same filter categories and options as Fiction, and applying filters updates the results accordingly.
## Affected Areas
 * Search results UI for Non‑Fiction category
 * Search/filter backend/query logic for Non‑Fiction category
 * QA regression for Fiction filters (ensure no regressions)

## Acceptance Criteria

Scenario: Filter availability on Non‑Fiction results
Given I am viewing Non‑Fiction search results
When the page loads
Then I can see filters for Book Format, Language, Publication Date, and Customer Reviews

Scenario: Book Format filter works
Given I am on Non‑Fiction results
When I select hardcover / paperback / eBook / audiobook
Then the results update to show only matching formats

Scenario: Language filter works
Given I am on Non‑Fiction results
When I select English / Spanish / French / German
Then the results update to show only books in the selected language(s)

Scenario: Publication Date filter works
Given I am on Non‑Fiction results
When I select last 30 days / last 6 months / last year
Then the results update to show only titles published within the selected range

Scenario: Customer Reviews filter works
Given I am on Non‑Fiction results
When I select 4-stars and above or 3-stars and above
Then the results update to show only books meeting the selected rating threshold

Scenario: Consistency with Fiction
Given I switch between Fiction and Non‑Fiction categories
When I view the search results filters
Then the filter categories and options are consistent across both tabs

Additional Requirements


### Scenario: Clear all filters

Given I have applied one or more filters to Non-Fiction search results
When I select the Clear All Filters option
Then all filters should be removed
And the original unfiltered Non-Fiction search results should be displayed


### EPMCDMETST-52015 (jira)

**Title:** Add filters to Non‑Fiction book search results (parity with Fiction)

## General Description

As a bookstore customer browsing Non‑Fiction books,
I want the same filtering options available in Fiction (format, language, publication date, and customer reviews),
So that I can narrow down Non‑Fiction search results easily and have a consistent browsing experience across categories.
## Business Value
 * Improves discoverability of Non‑Fiction titles by enabling users to narrow large result sets.
 * Creates consistent, predictable filtering experience across Fiction and Non‑Fiction categories.

## Preconditions
 * User can access Non‑Fiction search results page.
 * Fiction search results already support filters for Book Format, Language, Publication Date, and Customer Reviews.

## Scenarios of Use
 # User opens Non‑Fiction search results and uses filters to narrow results.
 # User applies Book Format filter to see only hardcover/paperback/eBook/audiobook.
 # User applies Language filter to see only books in selected language(s).
 # User applies Publication Date filter to see titles from last 30 days / last 6 months / last year.
 # User applies Customer Reviews filter to see titles with 3+ or 4+ stars.
 # User switches between Fiction and Non‑Fiction and expects consistent filter categories/options.

## Expected Result

Non‑Fiction search results display the same filter categories and options as Fiction, and applying filters updates the results accordingly.
## Affected Areas
 * Search results UI for Non‑Fiction category
 * Search/filter backend/query logic for Non‑Fiction category
 * QA regression for Fiction filters (ensure no regressions)

## Acceptance Criteria

Scenario: Filter availability on Non‑Fiction results
Given I am viewing Non‑Fiction search results
When the page loads
Then I can see filters for Book Format, Language, Publication Date, and Customer Reviews

Scenario: Book Format filter works
Given I am on Non‑Fiction results
When I select hardcover / paperback / eBook / audiobook
Then the results update to show only matching formats

Scenario: Language filter works
Given I am on Non‑Fiction results
When I select English / Spanish / French / German
Then the results update to show only books in the selected language(s)

Scenario: Publication Date filter works
Given I am on Non‑Fiction results
When I select last 30 days / last 6 months / last year
Then the results update to show only titles published within the selected range

Scenario: Customer Reviews filter works
Given I am on Non‑Fiction results
When I select 4-stars and above or 3-stars and above
Then the results update to show only books meeting the selected rating threshold

Scenario: Consistency with Fiction
Given I switch between Fiction and Non‑Fiction categories
When I view the search results filters
Then the filter categories and options are consistent across both tabs

Additional Requirements
### Scenario: Clear all filters

Given I have applied one or more filters to Non-Fiction search results
When I select the Clear All Filters option
Then all filters should be removed
And the original unfiltered Non-Fiction search results should be displayed

### Scenario: Filter state is preserved after page refresh

Given I have applied one or more filters to Non-Fiction search results
When I refresh the page
Then the selected filters should remain applied
And the displayed results should continue to match the selected filters

 
### Scenario: Filtering works with sorting

Given I have applied one or more filters to Non-Fiction search results
When I select a supported sorting option
Then the filtered results should be sorted according to the selected sorting option
And the applied filters should remain active

**Acceptance Criteria:**
- Scenario: Filter availability on Non‑Fiction results
- Given I am viewing Non‑Fiction search results
- When the page loads
- Then I can see filters for Book Format, Language, Publication Date, and Customer Reviews
- Scenario: Book Format filter works
- Given I am on Non‑Fiction results
- When I select hardcover / paperback / eBook / audiobook
- Then the results update to show only matching formats
- Scenario: Language filter works
- Given I am on Non‑Fiction results
- When I select English / Spanish / French / German
- Then the results update to show only books in the selected language(s)
- Scenario: Publication Date filter works
- Given I am on Non‑Fiction results
- When I select last 30 days / last 6 months / last year
- Then the results update to show only titles published within the selected range
- Scenario: Customer Reviews filter works
- Given I am on Non‑Fiction results
- When I select 4-stars and above or 3-stars and above
- Then the results update to show only books meeting the selected rating threshold
- Scenario: Consistency with Fiction
- Given I switch between Fiction and Non‑Fiction categories
- When I view the search results filters
- Then the filter categories and options are consistent across both tabs
- Scenario: Clear all filters
- Given I have applied one or more filters to Non-Fiction search results
- When I select the Clear All Filters option
- Then all filters should be removed
- And the original unfiltered Non-Fiction search results should be displayed
- Scenario: Filter state is preserved after page refresh
- Given I have applied one or more filters to Non-Fiction search results
- When I refresh the page
- Then the selected filters should remain applied
- And the displayed results should continue to match the selected filters
- Scenario: Filtering works with sorting
- Given I have applied one or more filters to Non-Fiction search results
- When I select a supported sorting option
- Then the filtered results should be sorted according to the selected sorting option
- And the applied filters should remain active

<!-- requirement:jira:EPMCDMETST-52015 {"source":"jira","sourceId":"EPMCDMETST-52015","title":"Add filters to Non‑Fiction book search results (parity with Fiction)","description":"## General Description\r\n\r\nAs a bookstore customer browsing Non‑Fiction books,\r\nI want the same filtering options available in Fiction (format, language, publication date, and customer reviews),\r\nSo that I can narrow down Non‑Fiction search results easily and have a consistent browsing experience across categories.\r\n## Business Value\r\n * Improves discoverability of Non‑Fiction titles by enabling users to narrow large result sets.\r\n * Creates consistent, predictable filtering experience across Fiction and Non‑Fiction categories.\r\n\r\n## Preconditions\r\n * User can access Non‑Fiction search results page.\r\n * Fiction search results already support filters for Book Format, Language, Publication Date, and Customer Reviews.\r\n\r\n## Scenarios of Use\r\n # User opens Non‑Fiction search results and uses filters to narrow results.\r\n # User applies Book Format filter to see only hardcover/paperback/eBook/audiobook.\r\n # User applies Language filter to see only books in selected language(s).\r\n # User applies Publication Date filter to see titles from last 30 days / last 6 months / last year.\r\n # User applies Customer Reviews filter to see titles with 3+ or 4+ stars.\r\n # User switches between Fiction and Non‑Fiction and expects consistent filter categories/options.\r\n\r\n## Expected Result\r\n\r\nNon‑Fiction search results display the same filter categories and options as Fiction, and applying filters updates the results accordingly.\r\n## Affected Areas\r\n * Search results UI for Non‑Fiction category\r\n * Search/filter backend/query logic for Non‑Fiction category\r\n * QA regression for Fiction filters (ensure no regressions)\r\n\r\n## Acceptance Criteria\r\n\r\nScenario: Filter availability on Non‑Fiction results\r\nGiven I am viewing Non‑Fiction search results\r\nWhen the page loads\r\nThen I can see filters for Book Format, Language, Publication Date, and Customer Reviews\r\n\r\nScenario: Book Format filter works\r\nGiven I am on Non‑Fiction results\r\nWhen I select hardcover / paperback / eBook / audiobook\r\nThen the results update to show only matching formats\r\n\r\nScenario: Language filter works\r\nGiven I am on Non‑Fiction results\r\nWhen I select English / Spanish / French / German\r\nThen the results update to show only books in the selected language(s)\r\n\r\nScenario: Publication Date filter works\r\nGiven I am on Non‑Fiction results\r\nWhen I select last 30 days / last 6 months / last year\r\nThen the results update to show only titles published within the selected range\r\n\r\nScenario: Customer Reviews filter works\r\nGiven I am on Non‑Fiction results\r\nWhen I select 4-stars and above or 3-stars and above\r\nThen the results update to show only books meeting the selected rating threshold\r\n\r\nScenario: Consistency with Fiction\r\nGiven I switch between Fiction and Non‑Fiction categories\r\nWhen I view the search results filters\r\nThen the filter categories and options are consistent across both tabs\r\n\r\nAdditional Requirements\r\n### Scenario: Clear all filters\r\n\r\nGiven I have applied one or more filters to Non-Fiction search results\r\nWhen I select the Clear All Filters option\r\nThen all filters should be removed\r\nAnd the original unfiltered Non-Fiction search results should be displayed\r\n### Scenario: Filter state is preserved after page refresh\r\n\r\nGiven I have applied one or more filters to Non-Fiction search results\r\nWhen I refresh the page\r\nThen the selected filters should remain applied\r\nAnd the displayed results should continue to match the selected filters\r\n\r\n \r\n### Scenario: Filtering works with sorting\r\n\r\nGiven I have applied one or more filters to Non-Fiction search results\r\nWhen I select a supported sorting option\r\nThen the filtered results should be sorted according to the selected sorting option\r\nAnd the applied filters should remain active","acceptanceCriteria":["Scenario: Filter availability on Non‑Fiction results","Given I am viewing Non‑Fiction search results","When the page loads","Then I can see filters for Book Format, Language, Publication Date, and Customer Reviews","Scenario: Book Format filter works","Given I am on Non‑Fiction results","When I select hardcover / paperback / eBook / audiobook","Then the results update to show only matching formats","Scenario: Language filter works","Given I am on Non‑Fiction results","When I select English / Spanish / French / German","Then the results update to show only books in the selected language(s)","Scenario: Publication Date filter works","Given I am on Non‑Fiction results","When I select last 30 days / last 6 months / last year","Then the results update to show only titles published within the selected range","Scenario: Customer Reviews filter works","Given I am on Non‑Fiction results","When I select 4-stars and above or 3-stars and above","Then the results update to show only books meeting the selected rating threshold","Scenario: Consistency with Fiction","Given I switch between Fiction and Non‑Fiction categories","When I view the search results filters","Then the filter categories and options are consistent across both tabs","Scenario: Clear all filters","Given I have applied one or more filters to Non-Fiction search results","When I select the Clear All Filters option","Then all filters should be removed","And the original unfiltered Non-Fiction search results should be displayed","Scenario: Filter state is preserved after page refresh","Given I have applied one or more filters to Non-Fiction search results","When I refresh the page","Then the selected filters should remain applied","And the displayed results should continue to match the selected filters","Scenario: Filtering works with sorting","Given I have applied one or more filters to Non-Fiction search results","When I select a supported sorting option","Then the filtered results should be sorted according to the selected sorting option","And the applied filters should remain active"],"version":"2026-08-25T13:44:27.280+0000","updatedAt":"2026-08-25T13:44:27.280+0000","links":[],"contentHash":"e2a1f8bb89bfb301b616c2b1342608dc1236158eddf620be093c1f25e19c4a27"} -->


