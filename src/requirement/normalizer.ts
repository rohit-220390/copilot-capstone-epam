import type { NormalizedRequirement, RequirementSource } from './model.js';
import { computeContentHash } from '../change-detection/hasher.js';

/** Strips a Jira wiki (`h1.`–`h6.`) or Markdown (`#`–`######`) heading prefix, returning the remaining text, or undefined if the line isn't a heading. */
function stripHeadingPrefix(line: string): string | undefined {
  const jiraMatch = /^h[1-6]\./i.exec(line);
  if (jiraMatch) return line.slice(jiraMatch[0].length).trim();

  let hashCount = 0;
  while (hashCount < line.length && hashCount < 6 && line[hashCount] === '#') hashCount++;
  if (hashCount > 0) return line.slice(hashCount).trim();

  return undefined;
}

/** Returns a heading line's depth (1-6), or undefined if the line isn't a heading. */
function getHeadingLevel(line: string): number | undefined {
  const jiraMatch = /^h([1-6])\./i.exec(line);
  if (jiraMatch) return Number(jiraMatch[1]);

  let hashCount = 0;
  while (hashCount < line.length && hashCount < 6 && line[hashCount] === '#') hashCount++;
  return hashCount > 0 ? hashCount : undefined;
}

const ADDITIONAL_REQUIREMENTS_LABEL = 'additional requirements';

/**
 * Returns the lines under a dedicated "Acceptance Criteria" heading (Jira wiki `h2.` or Markdown `##`), if present.
 * Only a heading at the same depth or shallower ends the section, so nested sub-scenario headings
 * (e.g. `### Scenario: ...` under an "Additional Requirements" marker) stay inside it.
 */
function findAcceptanceCriteriaSection(lines: string[]): string[] | undefined {
  let start = -1;
  let level = 0;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const heading = stripHeadingPrefix(trimmed);
    if (heading?.toLowerCase() === 'acceptance criteria') {
      start = i + 1;
      level = getHeadingLevel(trimmed) ?? 1;
      break;
    }
  }
  if (start === -1) return undefined;

  const section: string[] = [];
  for (let i = start; i < lines.length; i++) {
    const headingLevel = getHeadingLevel(lines[i].trim());
    if (headingLevel !== undefined && headingLevel <= level) break;
    section.push(lines[i]);
  }
  return section;
}

/**
 * Extracts acceptance criteria from free-text description. Prefers the content under a
 * dedicated "Acceptance Criteria" heading (supports Gherkin Given/When/Then scenarios,
 * bullet lists, and a nested "Additional Requirements" sub-section); falls back to scanning
 * bullet/numbered lines across the whole description when no such heading exists.
 */
export function extractAcceptanceCriteria(description: string): string[] {
  const lines = description.split('\n');
  const section = findAcceptanceCriteriaSection(lines);

  if (section) {
    return section
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      // Guardrail: the bare label is a marker for the sub-section below it, not a criterion itself.
      .filter((line) => line.toLowerCase() !== ADDITIONAL_REQUIREMENTS_LABEL)
      .map((line) => stripHeadingPrefix(line) ?? line)
      .map((line) => line.replace(/^[-*]\s+/, ''));
  }

  return lines
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+|^\d+\.\s+/, ''));
}

export interface RawRequirementFields {
  source: RequirementSource;
  sourceId: string;
  title: string;
  description: string;
  version: string;
  updatedAt: string;
  links?: string[];
}

/**
 * Builds a NormalizedRequirement from fields already extracted from a Jira REST response.
 * This function performs no network calls — it only canonicalizes and hashes.
 */
export function normalizeRequirement(fields: RawRequirementFields): NormalizedRequirement {
  const base = {
    source: fields.source,
    sourceId: fields.sourceId,
    title: fields.title,
    description: fields.description,
    acceptanceCriteria: extractAcceptanceCriteria(fields.description),
    version: fields.version,
    updatedAt: fields.updatedAt,
    links: fields.links ?? [],
  };
  return { ...base, contentHash: computeContentHash(base) };
}

interface JiraIssueLike {
  key: string;
  fields: { summary: string; description?: string; updated: string };
}

/** Converts Jira wiki markup (`h1.`-`h6.` headings, `*`/`**` bullets, `#`/`##` numbered lists) to Markdown. */
function convertJiraWikiToMarkdown(text: string): string {
  const counters: number[] = [];
  return text
    .split('\n')
    .map((line) => {
      const heading = /^h([1-6])\.\s*/i.exec(line);
      if (heading) {
        counters.length = 0;
        return `${'#'.repeat(Number(heading[1]))} ${line.slice(heading[0].length)}`;
      }

      const bullet = /^(\*+)\s+/.exec(line);
      if (bullet) {
        counters.length = 0;
        return `${'  '.repeat(bullet[1].length - 1)}- ${line.slice(bullet[0].length)}`;
      }

      // Nested numbering restarts per depth (e.g. "##" resets after a shallower "#" item).
      const numbered = /^(#+)\s+/.exec(line);
      if (numbered) {
        const depth = numbered[1].length;
        counters.length = depth;
        counters[depth - 1] = (counters[depth - 1] ?? 0) + 1;
        return `${'  '.repeat(depth - 1)}${counters[depth - 1]}. ${line.slice(numbered[0].length)}`;
      }

      counters.length = 0;
      return line;
    })
    .join('\n');
}

export function normalizeJiraIssue(issue: JiraIssueLike): NormalizedRequirement {
  return normalizeRequirement({
    source: 'jira',
    sourceId: issue.key,
    title: issue.fields.summary,
    description: convertJiraWikiToMarkdown(issue.fields.description ?? ''),
    version: issue.fields.updated,
    updatedAt: issue.fields.updated,
  });
}


