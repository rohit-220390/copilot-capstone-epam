import { existsSync } from 'node:fs';

const requiredPaths = [
  'docs/requirements.md',
  'docs/architecture.md',
  'docs/design-review.md',
  'docs/impl-plan.md',
  'docs/documentation-map.md',
  '.env.example',
];

const missing = requiredPaths.filter((path) => !existsSync(path));

// sessionStart output cannot block the session; missing files are surfaced as context only.
if (missing.length > 0) {
  console.log(
    JSON.stringify({ additionalContext: `Warning: missing required repository files: ${missing.join(', ')}` }),
  );
} else {
  console.log(JSON.stringify({}));
}

