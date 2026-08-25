import type { ImpactType } from '../requirement/model.js';

/** Maps a set of changed field names to the highest-priority impact classification. */
export function classifyImpact(modifiedFields: string[]): ImpactType {
  if (modifiedFields.length === 0) return 'documentation-only';
  if (modifiedFields.includes('acceptanceCriteria')) return 'test-impacting';
  if (modifiedFields.includes('description')) return 'code-impacting';
  if (modifiedFields.includes('title')) return 'documentation-only';
  return 'unclear';
}

export function isArchitectureImpacting(description: string): boolean {
  const architectureKeywords = ['integration', 'component', 'service', 'data flow', 'architecture'];
  const lower = description.toLowerCase();
  return architectureKeywords.some((keyword) => lower.includes(keyword));
}
