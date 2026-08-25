import type { NormalizedRequirement, RequirementDelta } from '../requirement/model.js';
import { classifyImpact } from './classifier.js';

/** Compares two versions of a requirement and reports which fields changed. */
export function calculateDelta(
  previous: NormalizedRequirement | undefined,
  current: NormalizedRequirement,
): RequirementDelta {
  if (!previous) {
    return { added: ['title', 'description', 'acceptanceCriteria'], removed: [], modified: [], impactType: 'unclear' };
  }

  if (previous.contentHash === current.contentHash) {
    return { added: [], removed: [], modified: [], impactType: 'documentation-only' };
  }

  const modified: string[] = [];
  if (previous.title !== current.title) modified.push('title');
  if (previous.description !== current.description) modified.push('description');

  const prevCriteria = new Set(previous.acceptanceCriteria);
  const currCriteria = new Set(current.acceptanceCriteria);
  const added = current.acceptanceCriteria.filter((c) => !prevCriteria.has(c));
  const removed = previous.acceptanceCriteria.filter((c) => !currCriteria.has(c));
  if (added.length || removed.length) modified.push('acceptanceCriteria');

  return { added, removed, modified, impactType: classifyImpact(modified) };
}

