import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { loadEnvFile } from '../env.js';
import { loadJiraConfig, getIssue } from '../integrations/jira/jira-adapter.js';
import { normalizeJiraIssue } from './normalizer.js';
import type { NormalizedRequirement } from './model.js';
import { calculateDelta } from '../change-detection/differ.js';

loadEnvFile();

interface CliArgs {
  source: 'jira';
  id: string;
}

function parseArgs(argv: string[]): CliArgs {
  const get = (flag: string) => {
    const index = argv.indexOf(flag);
    return index >= 0 ? argv[index + 1] : undefined;
  };
  const source = get('--source');
  const id = get('--id');
  if (source !== 'jira') {
    throw new Error('Usage: analyze-requirement --source jira --id <key>');
  }
  if (!id) {
    throw new Error('Missing --id <key>');
  }
  return { source, id };
}

async function fetchNormalized(args: CliArgs): Promise<NormalizedRequirement> {
  const issue = await getIssue(loadJiraConfig(), args.id);
  return normalizeJiraIssue(issue);
}

const REQUIREMENTS_FILE = 'docs/requirements.md';

function findPreviousEntry(source: string, sourceId: string): NormalizedRequirement | undefined {
  if (!existsSync(REQUIREMENTS_FILE)) return undefined;
  const content = readFileSync(REQUIREMENTS_FILE, 'utf-8');
  const marker = `<!-- requirement:${source}:${sourceId} `;
  const start = content.indexOf(marker);
  if (start === -1) return undefined;
  const end = content.indexOf('-->', start);
  const json = content.slice(start + marker.length, end).trim();
  try {
    return JSON.parse(json) as NormalizedRequirement;
  } catch {
    return undefined;
  }
}

function formatAcceptanceCriteria(criteria: string[]): string {
  if (criteria.length === 0) return '**Acceptance Criteria:** _none extracted_';
  const lines = criteria.map((c: string) => `- ${c}`).join('\n');
  return `**Acceptance Criteria:**\n${lines}`;
}

function upsertEntry(requirement: NormalizedRequirement): void {
  const marker = `<!-- requirement:${requirement.source}:${requirement.sourceId} `;
  const section = [
    `### ${requirement.sourceId} (${requirement.source})`,
    '',
    `**Title:** ${requirement.title}`,
    '',
    requirement.description,
    '',
    formatAcceptanceCriteria(requirement.acceptanceCriteria),
    '',
    `${marker}${JSON.stringify(requirement)} -->`,
    '',
  ].join('\n');

  let content = existsSync(REQUIREMENTS_FILE) ? readFileSync(REQUIREMENTS_FILE, 'utf-8') : '# Requirements\n\n';
  const start = content.indexOf(marker);
  if (start === -1) {
    appendFileSync(REQUIREMENTS_FILE, `\n${section}`);
    return;
  }
  const sectionStart = content.lastIndexOf('### ', start);
  const end = content.indexOf('-->', start) + '-->'.length;
  content = content.slice(0, sectionStart) + section + content.slice(end).replace(/^\n+/, '\n');
  writeFileSync(REQUIREMENTS_FILE, content);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const previous = findPreviousEntry(args.source, args.id);
  const current = await fetchNormalized(args);
  const delta = calculateDelta(previous, current);

  upsertEntry(current);

  console.log(`Updated ${REQUIREMENTS_FILE} for ${args.source}:${args.id}`);
  console.log(`Impact: ${delta.impactType}`);
  if (delta.modified.length > 0) console.log(`Modified fields: ${delta.modified.join(', ')}`);
  if (delta.added.length > 0) console.log(`Added: ${delta.added.join(', ')}`);
  if (delta.removed.length > 0) console.log(`Removed: ${delta.removed.join(', ')}`);
}

try {
  await main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : JSON.stringify(error);
  console.error(message);
  process.exit(1);
}
