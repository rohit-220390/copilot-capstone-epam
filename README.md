# AI-Native Agentic SDLC – Automated Documentation Sync

A GitHub Copilot capstone project implementing an agentic SDLC workflow that detects requirement changes in Jira and synchronizes repository documentation through a 10-agent pipeline with human approval gates.

> **New to this repo?** Jump to [Quick Start](#quick-start-5-minutes) to get it running, or [How to Review / Demo This Project](#how-to-review--demo-this-project) if you're evaluating it. Planning to exercise the Jira-connected steps? Read [Before You Test: Verify Your Environment](#before-you-test-verify-your-environment) first.

## What This Project Does

1. Retrieves requirements from Jira.
2. Detects changes against previously synchronized versions.
3. Routes the change through a specialist agent pipeline: Requirement Analyst → Architecture → Design Review → Planning → Documentation → Implementation → Test & Verification → Code Review → PR.
4. Produces a pull request with Summary, Changes Made, Test Evidence, Known Limitations, and a Reviewer Checklist.
5. Enforces human approval at every consequential gate — nothing merges automatically.

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| [Node.js](https://nodejs.org/) 20.x+ | Matches `@types/node@^20` used across `package.json` / `bookstore-app/package.json` |
| [VS Code](https://code.visualstudio.com/) 1.101+ | Required for GitHub Copilot Chat agent mode and remote MCP server support |
| [GitHub Copilot](https://github.com/features/copilot) subscription + extension | Powers the agents, skills, prompts, and hooks under `.github/` |
| A Jira instance (Cloud or Data Center/Server) with an issue you can read | Only needed to exercise the requirement-analysis step; the rest of the repo (tests, bookstore-app demo) works without it. This capstone's sample requirement lives at `https://jiraeu.epam.com/browse/EPMCDMETST-52015` (EPAM internal Jira Data Center) |

## Quick Start (5 minutes)

```bash
git clone <this-repo-url>
cd "Coplilot Capstone"
npm install
npm test
```

If `npm test` passes (12 suites, ~63 tests), the core pipeline tooling is working correctly — no external credentials required for this step.

## Copilot Customization Mechanisms Used

| Mechanism | Location | Purpose |
|-----------|----------|---------|
| Agents | `.github/agents/` | 10 specialist roles with minimum required tools |
| Instructions | `.github/instructions/`, `.github/copilot-instructions.md` | Always-on and scoped engineering rules |
| Skills | `.github/skills/` | Reusable domain procedures (Jira integration, testing, security, etc.) |
| Prompts | `.github/prompts/` | Reusable task entry points for each SDLC stage |
| Hooks | `.github/hooks/` | Deterministic security, validation, and audit controls |
| MCP | `.vscode/mcp.json` | Remote GitHub MCP server (OAuth) used by the `pr` agent to push branches and open pull requests |

## Repository Structure

```
.github/
  agents/        10 agent definitions
  skills/        9 skill packages
  instructions/  5 scoped instruction files
  prompts/       11 reusable prompt files
  hooks/         3 hook configurations (security, validation, audit)
docs/
  requirements.md, architecture.md, design-review.md,
  impl-plan.md, documentation-map.md, changelog.md
src/
  integrations/  Jira REST adapter (Cloud + Data Center/Server)
  requirement/   Normalized requirement model, normalizer, and analyze-requirement CLI
  change-detection/  Hashing, delta calculation, impact classification
  documentation-sync/  Requirement-to-artifact mapping & impact analysis
  validation/    Documentation quality checks
  security/      Secret scanning, log redaction, tool policy, hook scripts
tests/           unit, integration, and security test suites
bookstore-app/   Sample product built by the pipeline (see bookstore-app/README.md) — self-contained, own package.json/tests
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. (Optional — only needed to fetch live requirements from Jira) Copy `.env.example` to `.env` and fill in your Jira credentials. This project supports both deployment types:
   - **Data Center/Server** (e.g. a company-hosted instance): generate a **Personal Access Token** from your Jira profile settings, and set only `JIRA_BASE_URL` + `JIRA_AUTH_TOKEN`. Leave `JIRA_EMAIL` unset — Data Center uses Bearer auth alone.
   - **Cloud** (`*.atlassian.net`): generate an API token at `id.atlassian.com/manage-profile/security/api-tokens`, and set `JIRA_BASE_URL`, `JIRA_AUTH_TOKEN`, and `JIRA_EMAIL` (Cloud combines these as Basic auth).
   
   **Never commit `.env`.** It is already listed in `.gitignore`.
3. (Optional — only needed for the `pr` agent to open a real pull request) Reload VS Code so it picks up `.vscode/mcp.json`, then sign in to GitHub via OAuth the first time a `github` MCP tool runs. No token to create or paste in.

## Before You Test: Verify Your Environment

`npm install` and `npm test` work with **no** credentials — skip this section if you're only running the automated test suite (see [Option A](#option-a--no-jira-access-needed-fastest-5-min)).

Any step that talks to Jira (the `requirement-analyst` agent, the `analyze-requirement-cli`, or the full `sdlc-orchestrator` pipeline) reads its configuration from `.env` at startup and **fails fast with a clear error** if it's missing or incomplete — it will never silently proceed with bad credentials. Before running one of those steps, check the following yourself (or let the error message guide you):

1. **Does `.env` exist?** If not: `cp .env.example .env` (or copy it manually on Windows).
2. **Is `JIRA_BASE_URL` set?** This must be the root URL of your Jira instance only — e.g. `https://your-domain.atlassian.net` (Cloud) or `https://jira.your-company.com` (Data Center/Server) — **not** a full issue URL like `.../browse/ABC-123`.
3. **Is `JIRA_AUTH_TOKEN` set?**
   - **Cloud** (`*.atlassian.net`): generate an API token at `id.atlassian.com/manage-profile/security/api-tokens`.
   - **Data Center/Server** (any other domain): generate a Personal Access Token from your Jira profile → Personal Access Tokens.
4. **Is `JIRA_EMAIL` set — only if you're on Jira Cloud?** Cloud pairs your email with the API token for Basic auth. Leave it unset for Data Center/Server (Bearer-token auth only); setting it there will cause 401 errors.
5. **Do you have a valid Jira issue ID/key to test with** (e.g. `ABC-123`)? This isn't stored in `.env` — it's passed per-run via `--id <KEY>`, so have one ready from your own Jira project (or use `EPMCDMETST-52015`, the sample story on this capstone's own instance, if you have access to it).

If any of `JIRA_BASE_URL` or `JIRA_AUTH_TOKEN` is missing, `loadJiraConfig()` throws:

```
Error: Jira configuration missing. Set JIRA_BASE_URL and JIRA_AUTH_TOKEN (plus JIRA_EMAIL for Cloud).
```

When you see this, stop and fill in the missing value(s) in `.env` (using the checklist above) before re-running the command — do not hardcode credentials in source files, agent/skill/prompt files, or pass them as plain CLI arguments. **Never commit `.env`** (it's already in `.gitignore`; only `.env.example` with empty values is committed).

## Running

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile TypeScript |
| `npm test` | Run the full Jest suite with coverage |
| `npm run test:unit` | Unit tests only |
| `npm run test:integration` | Integration tests only (mocked HTTP) |
| `npm run test:security` | Secret scanning / redaction / tool-policy tests |
| `npm run secret-scan` | Scan the repository for credential patterns |
| `npx tsx src/requirement/analyze-requirement-cli.ts --source jira --id <KEY>` | Fetch, normalize, diff, and write a requirement to `docs/requirements.md` |

> On Windows PowerShell, invoke the CLI directly with `npx tsx ...` rather than `npm run ... -- --flag value` — npm does not reliably forward flags after `--` in PowerShell.

## How to Review / Demo This Project

Use whichever path fits your available time and access:

### Option A — No Jira access needed (fastest, ~5 min)
1. `npm install && npm test` at the repo root — confirms the pipeline tooling (normalization, change detection, documentation mapping, security hooks) all work, with real test output as evidence.
2. Look at `bookstore-app/` — this is the actual feature (`EPMCDMETST-52015`, Non‑Fiction search filters) that the pipeline produced end-to-end from a Jira requirement. Source story: `https://jiraeu.epam.com/browse/EPMCDMETST-52015`. Run it standalone:
   ```bash
   cd bookstore-app
   npm install
   npm test
   npm start   # starts the search API on http://localhost:3000
   ```
3. Read `docs/requirements.md` → `docs/architecture.md` → `docs/design-review.md` → `docs/impl-plan.md` → `docs/documentation-map.md` → `docs/changelog.md` in order to see the full paper trail the agents produced for that one requirement.

### Option B — Full pipeline walkthrough (requires a Jira issue + GitHub Copilot Chat)
1. Complete `.env` setup (step 2 above) with a real Jira issue key. Set `JIRA_BASE_URL` to your instance's URL (e.g. `https://jiraeu.epam.com` for this capstone's own instance, or `https://your-domain.atlassian.net` for Cloud) — not the full issue URL.
2. In VS Code Copilot Chat, invoke the `sdlc-orchestrator` agent (or run each stage manually — see below) and give it a Jira issue key.
3. Approve each human gate as the orchestrator hands off between agents: Requirement Analyst → Architecture → Design Review → Planning → Documentation/Implementation → Test & Verification → Code Review → PR.
4. Inspect the resulting `docs/*.md` updates and, once a GitHub remote is configured, the pull request the `pr` agent opens.

### Manual Demo Scenario (single stage, no orchestrator)
1. Create a Jira story, e.g. `ABC-123: Payment timeout is 30 seconds`, on your `JIRA_BASE_URL` instance (viewable at `<JIRA_BASE_URL>/browse/ABC-123`).
2. Run: `npx tsx src/requirement/analyze-requirement-cli.ts --source jira --id ABC-123` (or ask the `requirement-analyst` agent to do this).
3. `docs/requirements.md` is generated/updated, referencing `ABC-123`.
4. Edit the Jira story to `60 seconds`.
5. Re-run the same command — the delta is detected, impact is classified, and the entry is updated in place.
6. Continue through the pipeline: Architecture → Design Review → Planning → Documentation/Implementation → Test & Verification → Code Review → PR, approving each gate.

## Troubleshooting

- **"Jira configuration missing"** — `.env` is missing `JIRA_BASE_URL` and/or `JIRA_AUTH_TOKEN`; walk through the [environment checklist](#before-you-test-verify-your-environment) and fill in the missing value(s).
- **401/403 errors** — verify the token is valid; for Cloud, confirm the email matches the account that generated the API token; for Data Center, confirm the PAT hasn't expired or been revoked, and confirm `JIRA_EMAIL` is unset (Data Center is Bearer-only — a stray email turns the request into invalid Basic auth).
- **Secret scan failures** — the scanner flags credential-shaped strings; check flagged lines and remove hardcoded values.
- **Hook denials** — `preToolUse` blocks reading `.env` or destructive commands; this is intentional. Use environment variables instead.
- **npm script not receiving CLI flags on Windows** — invoke `npx tsx src/requirement/analyze-requirement-cli.ts --source ... --id ...` directly instead of `npm run analyze-requirement -- ...`.
- **`github` MCP tools unavailable** — confirm VS Code is 1.101+, `.vscode/mcp.json` exists, and you completed the OAuth sign-in prompt; also confirm the repo has a `git` remote before asking the `pr` agent to open a PR.
