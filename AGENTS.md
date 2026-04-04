# Seqera Docs Repository Agent Policy

This file is the repo-local extension of the Seqera global coding agent policy.

Apply policy in this order:

1. system and tool safety constraints
2. global Seqera and tool-specific installed policy
3. this repository `AGENTS.md`
4. task-specific user instructions

If rules conflict, follow the more restrictive rule unless the user explicitly directs otherwise and the action is safe.

## Repository Intent

- This repository is the initial pilot for Seqera's repo-local coding agent policy model.
- Treat the pilot as lightweight and observable first.
- Prefer advisory checks and clear operator guidance over hard enforcement.
- Keep friction low for documentation-only work.

## Docs Repo Work Classification

Use the shared classes from the global policy:

- `docs`
- `minor`
- `poc`
- `small-feature`
- `medium`
- `large`

Docs-repo refinements:

- `docs`: content-only edits, frontmatter changes, copy editing, examples, images, link fixes, comments, and navigation updates that do not change site behavior
- `minor`: low-risk maintenance in docs tooling, linting, CI, styling, or repo automation with bounded impact
- `poc`: experiments for docs automation, agent workflows, review flow, or content tooling that are not yet hardened
- `small-feature`: bounded behavior changes to docs site components, content generation flows, or contributor workflows with clear scope
- `medium`: broader docs platform or pipeline changes across multiple areas, contracts, or workflows
- `large`: major structural or architectural changes to docs delivery, docs tooling, or cross-repo documentation systems

When uncertain, classify conservatively.

## Spec-Gating In This Repo

- `docs`, `minor`, and `poc` work can proceed with direct user instruction or a clear local objective.
- `small-feature` work can proceed with a clear issue, story, or explicit request.
- `medium` and `large` work should stop without appropriate planning artifacts unless explicitly exploratory.

## Validation Expectations

This repo is intentionally lighter than product-code repos.

- `docs`: human review is enough before commit unless the user asks for automated checks
- `minor`: run targeted checks when practical
- `poc`: validate the specific experiment enough to understand risk and reversibility
- `small-feature`: run relevant automated checks before commit when behavior changes
- `medium` and `large`: run broader automated validation before PR readiness

Examples of relevant checks in this repo:

- `npm run markdownlint` for markdown or MDX content changes in covered doc areas
- `npm run typecheck` for TypeScript or frontend code changes
- targeted script execution for repo automation changes
- human review of diff quality for docs-only changes

If a useful check is too expensive for the change, record that choice explicitly.

## Pilot Scripts

This repo-local pilot uses:

- `scripts/agent/classify-work.sh`
- `scripts/agent/pre-commit-check.sh`
- `scripts/agent/pre-pr-check.sh`

Current intent:

- classification should be lightweight and explainable
- pre-commit guidance should mostly advise rather than block
- pre-PR guidance should remind the operator to pause for review before remote publication

## Review Before Publication

Before any remote publication step, pause for user review.

For this pilot, acceptable evidence is lightweight:

- the user reviewed the local diff directly
- the user explicitly approved moving to push or PR
- PR metadata or templates may carry this later, but they are not required for the pilot scaffold

## Repo-Specific Boundaries

- Do not widen this pilot into strict enforcement without explicit direction.
- Prefer small, readable shell scripts over complex policy engines.
- Reuse existing repo workflows and scripts where practical instead of duplicating logic.
- Keep future adoption by heavier codebases in mind, but optimize this pilot for learning value first.
