# Platform API documentation

This directory contains the generated Seqera Platform API docs, the OpenAPI
specs that feed them, and the automation that keeps the public docs in sync
with Platform API changes.

The current v1 process is intentionally human-reviewed. Automation finds API
changes, asks Claude to draft Speakeasy overlays, and then applies approved
overlays to the decorated public spec and generated MDX docs.

## Workflow overview

The docs repo has two API docs workflows:

1.  `Generate API Documentation Overlays`
   (`.github/workflows/generate-openapi-overlays.yml`)
2.  `Apply Overlays and Regenerate Docs`
   (`.github/workflows/apply-overlays-and-regenerate.yml`)

The normal flow is:

1.  Platform publishes or identifies a new flattened OpenAPI spec.
2.  The generate workflow copies that base spec into this repo, compares it with
   the previous base spec, and opens a draft docs PR with Claude-generated
   overlay suggestions.
3.  A human reviews and edits the generated overlays in the draft PR.
4.  After review, add the `overlays-approved` label.
5.  The apply workflow consolidates the overlays, updates the decorated spec,
   regenerates the MDX docs, updates the sidebar, validates sidebar drift, and
   marks the PR ready for final review.

The generated docs are for the public Platform API surface. Admin-only
endpoints can exist in the flattened base spec but still be absent from
`seqera-api-latest-decorated.yml`, the generated docs, and the sidebar.

## Generate overlays

The generate workflow can be triggered in two ways:

- Automatically by a `repository_dispatch` event of type
  `api-version-updated`.
- Manually from GitHub Actions with:
  - `api_version`: required, for example `1.181.0`
  - `platform_ref`: optional Platform branch, tag, or SHA. Defaults to `master`.

Before doing the full checkout and Claude generation work, the workflow checks
whether an open PR already exists for `api-docs-v{version}` and whether the
base spec version already exists under `platform-api-docs/scripts/specs/`.
The version check uses a sparse checkout at `docs-version-check`; the full docs
checkout happens only when a new API version needs processing.

When the version is new, the workflow:

1.  Creates a GitHub App token for `seqeralabs/platform` using
   `DOCS_BOT_APP_ID` and `DOCS_BOT_APP_PRIVATE_KEY`.
2.  Checks out the Platform repo at the requested ref.
3.  Copies
   `tower-backend/src/main/resources/META-INF/openapi/seqera-api-latest-flattened.yml`
   to `platform-api-docs/scripts/specs/seqera-api-{version}.yaml`.
4.  Finds the previous checked-in base spec.
5.  Runs Speakeasy `1.759.2` to produce a comparison overlay.
6.  Runs `.claude/skills/api-overlay-generator/scripts/analyze_comparison.py`.
7.  Calls Claude with the `api-overlay-generator` skill standards and patterns.
8.  Opens a draft PR containing only
   `platform-api-docs/scripts/specs` changes.

The generated PR includes `claude-generated-overlays.md`, comparison output,
and analysis JSON. The overlay Markdown should put each overlay filename as a
plain Markdown line immediately before the YAML block; the apply workflow also
supports a first-line YAML filename comment as a fallback.

## Review overlays

Before adding `overlays-approved`, review the generated overlay suggestions for
technical accuracy and documentation quality.

Typical review checks:

- Endpoint summaries use sentence case and no trailing period.
- Descriptions are complete sentences.
- Common parameters use the standard descriptions from
  `.claude/skills/api-overlay-generator/references/standards.md`.
- Overlay targets match real paths in the decorated spec.
- Public docs do not add admin-only operations that are intentionally excluded
  from `seqera-api-latest-decorated.yml`.

Useful local validation commands:

```bash
python3 .claude/skills/api-overlay-generator/scripts/validate_overlay.py \
  platform-api-docs/scripts/specs/{overlay-file}.yaml

python3 .claude/skills/api-overlay-generator/scripts/check_consistency.py \
  platform-api-docs/scripts/specs/{overlay-file}.yaml
```

## Apply overlays and regenerate docs

The apply workflow runs when the draft PR receives the `overlays-approved`
label. It can also be run manually with a PR number.

The workflow:

1.  Checks out the PR branch.
2.  Installs Python dependencies, Node dependencies, and Speakeasy `1.759.2`.
3.  Detects the latest base spec version in
   `platform-api-docs/scripts/specs/`.
4.  Extracts versioned overlay files from `claude-generated-overlays.md`.
5.  Consolidates versioned overlays into
   `all-changes-overlay-{version}.yaml`.
6.  Applies the consolidated overlay to `seqera-api-latest-decorated.yml`.
7.  Validates the decorated spec with `speakeasy validate openapi`.
8.  Updates the Platform API info page version.
9.  Regenerates parameter tables.
10.  Runs Docusaurus API doc generation for the Platform API only.
11.  Updates `platform-api-docs/docs/sidebar/sidebar.js` with
    `.claude/skills/api-overlay-generator/scripts/update_sidebar_v2.py`.
12.  Validates that generated operation docs and sidebar operation entries
    match.
13.  Archives used overlay, comparison, generated Markdown, and analysis files
    under `platform-api-docs/scripts/overlay_archives/`.
14.  Keeps only the latest two base specs.
15.  Commits and pushes the regenerated docs to the PR branch.
16.  Marks the PR ready for review and comments with a summary.

The sidebar validation step is deliberately strict for generated operation
pages. If the workflow reports either "Sidebar operation IDs with no generated
doc" or "Generated operation docs missing from the sidebar", update
`platform-api-docs/docs/sidebar/sidebar.js` before merging the docs PR.
Info pages under `platform-api-docs/docs/info/` are linked by path and are not
part of that operation-page drift check.

## Local build check

Install dependencies if needed:

```bash
npm install
```

Build the docs with the other generated API surfaces excluded:

```bash
NO_UPDATE_NOTIFIER=1 \
EXCLUDE_MULTIQC=true \
EXCLUDE_FUSION=true \
EXCLUDE_WAVE=true \
npm run build
```

For local development, run:

```bash
npm run start
```

Then open <http://localhost:3000/platform-api/>.

## Manual fallback

If the workflows are unavailable, use the same files and commands manually.

Copy the flattened base spec from Platform:

```bash
cp platform-repo/tower-backend/src/main/resources/META-INF/openapi/seqera-api-latest-flattened.yml \
  platform-api-docs/scripts/specs/seqera-api-{version}.yaml
```

Generate and analyze the comparison:

```bash
cd platform-api-docs/scripts/specs

speakeasy overlay compare \
  -b seqera-api-{old-version}.yaml \
  -a seqera-api-{version}.yaml \
  > base-{old-version}-to-{version}-changes.yaml

python3 ../../../.claude/skills/api-overlay-generator/scripts/analyze_comparison.py \
  base-{old-version}-to-{version}-changes.yaml
```

Create or edit the overlay files, then apply and validate them:

```bash
speakeasy overlay apply \
  -s seqera-api-latest-decorated.yml \
  -o all-changes-overlay-{version}.yaml \
  > seqera-api-latest-decorated-new.yml

mv seqera-api-latest-decorated-new.yml seqera-api-latest-decorated.yml

speakeasy validate openapi -s seqera-api-latest-decorated.yml
```

Regenerate docs and update the sidebar:

```bash
cd ../../..

node platform-api-docs/scripts/extract-api-tables.mjs

EXCLUDE_MULTIQC=true EXCLUDE_FUSION=true EXCLUDE_WAVE=true \
  npx docusaurus clean-api-docs platform

EXCLUDE_MULTIQC=true EXCLUDE_FUSION=true EXCLUDE_WAVE=true \
  npx docusaurus gen-api-docs platform

cd platform-api-docs/scripts/specs

python3 ../../../.claude/skills/api-overlay-generator/scripts/update_sidebar_v2.py \
  ../../docs/sidebar/sidebar.js \
  base-{old-version}-to-{version}-changes-analysis.json
```

Run a full local build before pushing:

```bash
cd ../../..

NO_UPDATE_NOTIFIER=1 \
EXCLUDE_MULTIQC=true \
EXCLUDE_FUSION=true \
EXCLUDE_WAVE=true \
npm run build
```

## File organization

`platform-api-docs/scripts/specs/` contains:

- `seqera-api-{version}.yaml`: versioned flattened base specs copied from
  Platform.
- `seqera-api-latest-decorated.yml`: the public decorated spec consumed by
  Docusaurus.
- `base-{old-version}-to-{version}-changes.yaml`: Speakeasy comparison output.
- `*-overlay-{version}.yaml`: reviewed version-specific overlays.
- `all-changes-overlay-{version}.yaml`: temporary consolidated overlay used by
  the apply workflow.
- `*-analysis.json`: analysis output from `analyze_comparison.py`.
- `claude-generated-overlays.md`: Claude's generated overlay suggestions.

`platform-api-docs/scripts/overlay_archives/` stores applied overlays,
comparison output, analysis JSON, and generated overlay Markdown after the
apply workflow completes.

`.claude/skills/api-overlay-generator/` contains the Claude skill, standards,
overlay patterns, and helper scripts used by the workflows.

## Required secrets

- `DOCS_BOT_APP_ID`: GitHub App ID used to read the private Platform repo.
- `DOCS_BOT_APP_PRIVATE_KEY`: private key for the same GitHub App.
- `ENG_ANTHROPIC_API_KEY`: Anthropic API key used by the generate workflow.

The apply workflow uses `GITHUB_TOKEN` for changes to the docs PR branch and PR
updates.

## Troubleshooting

If the generate workflow says a script is missing, check that the sparse
checkout and full checkout are isolated. The full workflow needs
`.claude/skills/api-overlay-generator/scripts/analyze_comparison.py`, while the
pre-flight duplicate-version check should only use the separate
`docs-version-check` path.

If the apply workflow cannot extract overlays, make sure each YAML block in
`claude-generated-overlays.md` has a versioned overlay filename immediately
above the block, for example `credentials-operations-overlay-1.181.0.yaml`.

If the Docusaurus build fails with missing sidebar document IDs, compare
`platform-api-docs/docs/sidebar/sidebar.js` with the generated
`platform-api-docs/docs/*.api.mdx` files. Sidebar entries should only reference
operation docs that exist in the generated public docs.

If a newly expected operation is missing from the docs, confirm whether it is
present in `seqera-api-latest-decorated.yml`. Operations that are only in the
flattened base spec may have been intentionally filtered out of the public
decorated spec.

## References

- [Speakeasy overlays](https://speakeasy.com/docs/overlay)
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0)
- [Google Developer Style Guide](https://developers.google.com/style)
- [GitHub Actions](https://docs.github.com/en/actions)
