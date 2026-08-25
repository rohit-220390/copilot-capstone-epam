import { createHash } from 'node:crypto';
import type { NormalizedRequirement } from '../requirement/model.js';

/** Strips volatile fields before hashing so metadata-only changes don't trigger a false delta. */
function canonicalize(requirement: Pick<NormalizedRequirement, 'title' | 'description' | 'acceptanceCriteria'>): string {
  const canonical = {
    title: requirement.title.trim(),
    description: requirement.description.trim(),
    acceptanceCriteria: [...requirement.acceptanceCriteria].map((c) => c.trim()).sort((a, b) => a.localeCompare(b)),
  };
  return JSON.stringify(canonical);
}

export function computeContentHash(
  requirement: Pick<NormalizedRequirement, 'title' | 'description' | 'acceptanceCriteria'>,
): string {
  return createHash('sha256').update(canonicalize(requirement)).digest('hex');
}
