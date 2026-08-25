export type RequirementSource = 'jira';

export interface NormalizedRequirement {
  source: RequirementSource;
  sourceId: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  version: string;
  updatedAt: string;
  contentHash: string;
  links: string[];
}

export type ImpactType =
  | 'documentation-only'
  | 'architecture-impacting'
  | 'code-impacting'
  | 'test-impacting'
  | 'unclear';

export interface RequirementDelta {
  added: string[];
  removed: string[];
  modified: string[];
  impactType: ImpactType;
}
