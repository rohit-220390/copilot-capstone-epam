export interface DocumentationMapEntry {
  requirementId: string;
  source: 'jira';
  artifact: string;
  impactType: string;
}

const VALID_SOURCES = new Set(['jira']);

/** Parses the documentation-map.md table into structured entries. */
export function parseDocumentationMap(markdown: string): DocumentationMapEntry[] {
  const entries: DocumentationMapEntry[] = [];

  for (const line of markdown.split('\n')) {
    if (!line.startsWith('|') || !line.endsWith('|')) continue;
    const cells = line
      .slice(1, -1)
      .split('|')
      .map((cell) => cell.trim());
    if (cells.length !== 4) continue;

    const [requirementId, source, artifact, impactType] = cells;
    const normalizedSource = source.toLowerCase();
    if (!VALID_SOURCES.has(normalizedSource)) continue;

    entries.push({ requirementId, source: normalizedSource as 'jira', artifact, impactType });
  }

  return entries;
}


/** Serializes documentation map entries back into the Markdown table format. */
export function serializeDocumentationMap(entries: DocumentationMapEntry[]): string {
  const header = '| Requirement | Source | Repository Artifact | Impact Type |\n|-------------|--------|-------------------|-------------|';
  const rows = entries.map((e) => `| ${e.requirementId} | ${e.source} | ${e.artifact} | ${e.impactType} |`);
  return [header, ...rows].join('\n');
}

/** Returns all artifacts mapped to a given requirement ID. */
export function findArtifactsForRequirement(entries: DocumentationMapEntry[], requirementId: string): string[] {
  return entries.filter((e) => e.requirementId === requirementId).map((e) => e.artifact);
}
