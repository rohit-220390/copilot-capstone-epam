export interface DocQualityIssue {
  file: string;
  rule: string;
  message: string;
}

const LINK_REGEX = /\[[^[\]]*\]\(([^()]+)\)/g;

/** Checks a single Markdown document against baseline quality rules. */
export function checkDocumentQuality(fileName: string, content: string, existingFiles: Set<string>): DocQualityIssue[] {
  const issues: DocQualityIssue[] = [];

  if (!/^#\s+.+/m.test(content)) {
    issues.push({ file: fileName, rule: 'require-h1', message: 'Document is missing an H1 title.' });
  }

  for (const match of content.matchAll(LINK_REGEX)) {
    const target = match[1];
    if (target.startsWith('http') || target.startsWith('#')) continue;
    const resolved = target.replace(/^\.\//, '');
    if (!existingFiles.has(resolved)) {
      issues.push({ file: fileName, rule: 'no-broken-links', message: `Broken link target: ${target}` });
    }
  }

  return issues;
}
