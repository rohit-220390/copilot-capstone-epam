import type { RequirementDelta } from '../requirement/model.js';
import type { DocumentationMapEntry } from './documentation-map.js';
import { findArtifactsForRequirement } from './documentation-map.js';

export interface ImpactAnalysisResult {
  requiresHumanApproval: boolean;
  affectedArtifacts: string[];
  reason: string;
}

/** Determines which artifacts are affected by a requirement delta and whether human approval is needed. */
export function analyzeImpact(
  requirementId: string,
  delta: RequirementDelta,
  documentationMap: DocumentationMapEntry[],
): ImpactAnalysisResult {
  const affectedArtifacts = findArtifactsForRequirement(documentationMap, requirementId);

  const requiresHumanApproval =
    delta.impactType === 'architecture-impacting' || delta.removed.length > 0 || delta.impactType === 'unclear';

  const reason = requiresHumanApproval
    ? `Change impact is "${delta.impactType}" with ${delta.removed.length} removed item(s); human review required.`
    : `Change impact is "${delta.impactType}"; safe to auto-propose documentation update.`;

  return { requiresHumanApproval, affectedArtifacts, reason };
}
