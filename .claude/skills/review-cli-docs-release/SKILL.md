---
name: review-cli-docs-release
description: Review a generated Seqera Platform CLI release documentation PR, infer required conceptual documentation from verified release evidence, and update CLI overlays, command indexes, examples, and migration guidance. Use for tower-cli release parity work, CLI metadata comparison reports, auto-generated cli-docs-vX.Y.Z PRs, or questions about how a CLI release should change the docs.
---

# Review Platform CLI release documentation

Turn the deterministic command-model update into a complete, evidence-based documentation change.

## Establish the evidence

1. Read `platform-cli-docs/README.md` for the automation contract and ownership boundary.
2. Read the draft PR comparison report and download its `cli-docs-metadata-*` workflow artifact when available.
3. Read the tower-cli GitHub release notes and inspect source at the exact release tag for changed commands.
4. Run the released JAR with `--help` for every added, removed, or changed command. Prefer the release asset over a local development build.
5. Treat metadata as structural evidence only. It proves command paths, options, required status, defaults, and help text; it does not prove user intent, safe examples, migration impact, or product compatibility.

## Classify each change

For every reported difference, classify it as one or more of:

- reference-only: generated tables and syntax are sufficient
- discoverability: update `docs/commands-reference.md` or nearby conceptual navigation
- usage guidance: add or update the matching overlay
- migration: explain a removal, rename, changed default, or changed required input
- broader product behavior: verify against Platform or API source and update the correct Platform docs surface as well
- internal/noise: document why no prose change is needed

Do not equate a changed Java field or metadata representation with a user-visible CLI change.

## Update the durable sources

- Do not hand-edit generated option tables in `docs/reference/`.
- Put command-specific prose and examples in `overlays/tw-<command>-<subcommand>.md`.
- Update `docs/commands-reference.md` for new or removed top-level commands and category placement.
- Update `docs/overview.md` or `docs/installation.md` only when the release changes concepts, availability, installation, authentication, or compatibility.
- Remove or rename overlays when their command path no longer exists.
- Keep version notices under the `cli-release-version` markers; the workflow updates them idempotently.

## Apply inference safeguards

- Separate verified facts from inferred documentation needs in review notes.
- Verify examples against the released CLI and use non-sensitive placeholders.
- Never invent example output, defaults, supported providers, compatibility versions, or migration behavior.
- Flag ambiguous behavior for a CLI engineer instead of converting uncertainty into prose.
- Preserve useful manual overlays unless release evidence makes them incorrect.
- Use the Seqera style guidance and link to canonical Platform concepts rather than duplicating them.

## Validate

1. Regenerate the reference from the attached metadata or reproduce extraction from the release.
2. Confirm generation is deterministic and no stale command pages remain.
3. Check new top-level pages appear in the sidebar and categorized command index.
4. Run the CLI docs tests and the repository's relevant Markdown/link checks.
5. Build the Platform CLI docset and inspect affected pages in the preview.
6. Summarize verified changes, editorial inference, validation, and unresolved questions in the PR.

Keep the PR in draft until the conceptual review is complete; successful generation alone is not release parity.
