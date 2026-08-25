# Copilot Instructions – Agentic SDLC Documentation Sync

## Project Context
This repository implements an AI-native SDLC workflow that detects requirement changes in Jira and synchronizes repository documentation through a multi-agent pipeline.

## Core Rules
- Requirements in Jira are authoritative. Never invent acceptance criteria.
- Ask for clarification when source requirements are ambiguous — do not guess.
- Never expose, persist, or log credentials (API tokens, passwords, auth headers).
- Do not modify production code before the implementation gate is approved.
- Every behavior change requires tests and documentation impact analysis.
- Do not silently delete existing documentation; explain removals in the change proposal.
- Do not claim tests passed unless they actually ran and produced evidence.
- Use repository conventions before introducing new dependencies.

## Architecture
- Agents in `.github/agents/` define specialist roles with minimum required tools.
- Skills in `.github/skills/` package reusable domain procedures.
- Prompts in `.github/prompts/` define reusable task entry points.
- Hooks in `.github/hooks/` enforce deterministic security and validation controls.
- Instructions in `.github/instructions/` define scoped engineering rules.
- External APIs are accessed through the REST adapter in `src/integrations/` (Jira Cloud/Data Center) using credentials from environment variables — agents never hold raw credentials, and credentials are never printed, logged, or written to any file.
- Pull requests are created via the remote GitHub MCP server (`.vscode/mcp.json`, OAuth-authenticated) rather than a custom GitHub integration — the repo must have a `git` remote configured before the `pr` agent can push/open a PR.

## Language and Style
- TypeScript with strict mode enabled.
- Use ES module imports (`import`/`export`), not CommonJS.
- Prefer `const` over `let`; avoid `any`.
- Name files in kebab-case. Name types/interfaces in PascalCase.
- Keep functions small and focused. Extract shared logic rather than duplicating.

## SDLC Artifacts
- `docs/requirements.md` — approved requirements and acceptance criteria
- `docs/architecture.md` — system design and data flow
- `docs/design-review.md` — risks, gaps, and decisions
- `docs/impl-plan.md` — dependency-ordered implementation tasks
- `docs/documentation-map.md` — requirement-to-artifact mapping
- `docs/changelog.md` — human-readable change summary
