import { analyzeImpact } from '../../../src/documentation-sync/impact-analyzer.js';
import type { DocumentationMapEntry } from '../../../src/documentation-sync/documentation-map.js';
import type { RequirementDelta } from '../../../src/requirement/model.js';

const MAP: DocumentationMapEntry[] = [
  { requirementId: 'PAY-123', source: 'jira', artifact: 'docs/requirements.md', impactType: 'behavior' },
  { requirementId: 'PAY-123', source: 'jira', artifact: 'docs/architecture.md', impactType: 'architecture' },
];

function makeDelta(overrides: Partial<RequirementDelta> = {}): RequirementDelta {
  return { added: [], removed: [], modified: [], impactType: 'documentation-only', ...overrides };
}

describe('analyzeImpact', () => {
  it('does not require human approval for documentation-only changes with no removals', () => {
    const result = analyzeImpact('PAY-123', makeDelta({ impactType: 'documentation-only' }), MAP);
    expect(result.requiresHumanApproval).toBe(false);
    expect(result.affectedArtifacts).toEqual(['docs/requirements.md', 'docs/architecture.md']);
  });

  it('requires human approval for architecture-impacting changes', () => {
    const result = analyzeImpact('PAY-123', makeDelta({ impactType: 'architecture-impacting' }), MAP);
    expect(result.requiresHumanApproval).toBe(true);
  });

  it('requires human approval when content is removed', () => {
    const result = analyzeImpact('PAY-123', makeDelta({ removed: ['old criterion'] }), MAP);
    expect(result.requiresHumanApproval).toBe(true);
  });

  it('requires human approval for unclear impact', () => {
    const result = analyzeImpact('PAY-123', makeDelta({ impactType: 'unclear' }), MAP);
    expect(result.requiresHumanApproval).toBe(true);
  });
});
