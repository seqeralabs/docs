# Seqera documentation

This repository contains the documentation published to [docs.seqera.io](https://docs.seqera.io). We're using [Docusaurus v3](https://docusaurus.io/docs/docs-introduction), along with whichever [Remark plugins](https://docusaurus.io/docs/markdown-features/plugins) are required for our purposes.

Changes merged to [master](https://github.com/seqeralabs/docs) are deployed to production automatically via Netlify. Pull requests have their own deployment preview.

The source of truth for all products' documentation lives in their respective product repositories, such as [wave](https://github.com/seqeralabs/wave). These repositories contain a `docs` folder which house the _latest_ version of that product's documentation.

For more information, see:

- [Seqera documentation](#seqera-documentation)
  - [Architecture](#architecture)
    - [Seqera Platform](#seqera-platform)
    - [Wave](#wave)
  - [Writing new content](#writing-new-content)
  - [Fixing legacy content](#fixing-legacy-content)
  - [Creating internal links](#creating-internal-links)
  - [Changelog automation](#changelog-automation)
  - [Platform table update workflows](#platform-table-update-workflows)
  - [Workflows and actions audit](#workflows-and-actions-audit)

## Architecture

Contentful/relevant files include:

```
├── README.md
├── docusaurus.config.js // website config
├── platform-enterprise_versioned_docs // versioned Platform docs
│   ├── version-22.4.0
│   ├── version-23.1.0
│   ├── version-23.2.0
│   └── version-23.3.0
├── platform-enterprise_versioned_sidebars // versioned Platform sidebars
│   ├── version-22.4.0-sidebars.json
│   ├── version-23.1.0-sidebars.json
│   ├── version-23.2.0-sidebars.json
│   └── version-23.3.0-sidebars.json
├── platform-enterprise_versions.json
└── wave_docs // Git submodule
```

### Seqera Platform

The Platform documentation is versioned and lives in the `platform-enterprise_versioned_docs` directory. Each version in this directory also requires a sidebar config, which lives in the `platform-enterprise_versioned_sidebars` directory. Versions also need to be specified in `platform-enterprise_versions.json`. When adding a new latest version, the `docusaurus.config.js` needs to be updated as well.

We have a script which can select a commit (or ideally release tag) to be used for publishing a new version on the docs website.

## Write and edit content

### Install pre-commit

We use [pre-commit](https://pre-commit.com/) in our repo, which is invoked when a commit is made. When you (or Claude) are working locally and commit your changes in VS Code (or run `git commit`) the pre-commit hooks defined in the [precommit config file](./.pre-commit-config.yaml) are executed and may tweak the files you're staging.
We currently use basic standard hooks to remove trailing whitespaces, make sure the file ends with a newline, we check yaml documents and we prevent very large files from getting committed. More hooks may get installed in the future.

1. Open up a Terminal window and navigate to the `docs` repository.
2. Run the following commands to set up [pre-commit](https://github.com/pre-commit/pre-commit) hooks:

   ```console
   $ pip install pre-commit
   $ pre-commit install
   $ pre-commit install-hooks
   ```
You shouldn't experience any issues but if you do, share them in the #team-documentation channel so we can try help.

:::note
  You only have to install pre-commit once.
:::

### Make changes and create a PR

1. In GitHub, or VS Code, create a new branch (e.g., `gh-issue-number`).
3. Complete the necessary work, save your changes, and commit.
4. In GitHub, create a PR to merge your updates to master.
5. Add relevant labels to your PR and request reviews from:
   - Language review from a `docs-codeowners` member.
   - Technical review from the backend engineer or other SME closest to the feature.
6. Check and review the changes using the Netlify preview.
7. If you created the PR, the onus is on you to merge the PR once approved. This is the Edu team's policy, to ensure that PRs are never merged inadvertently. If you'd like one of us to merge it for you, please let us know.

Once merged to the master branch, the changes will be live immediately.

## Fixing legacy content

Version-specific changes to legacy documentation sets currently occur directly in this repository. Each product has a `product_versioned_docs` folder in this repository. That folder contains a subfolder for each version — edit the files in these versioned folders directly to update versioned content on docs.seqera.io:

1. Create a new branch in this repository, such as `product-gh-issue-number`.
2. Create the change in the related files in the correct version (e.g., `23.1.0`) directory, and any other versions affected.
3. Raise a PR based for review, requesting the same 2 reviews as for new content.
4. After approval, merge the PR to the master branch.

## Creating internal links

You can link between Markdown files with relative links within the same documentation set. If you need to link to a different documentation set, such as Wave or Fusion, you **must** use the HTTPS path. For example:

```
For more information, see [Fusion](https://docs.seqera.io/fusion).
```

## Changelog automation

Release notes for Fusion, Wave, Nextflow, and MultiQC are automatically generated from GitHub releases. A scheduled workflow runs twice daily to check for new releases and creates PRs with changelog entries.

### How it works

1. The workflow ([.github/workflows/changelog-from-releases.yml](.github/workflows/changelog-from-releases.yml)) polls GitHub for releases from:
   - `seqeralabs/fusion`
   - `seqeralabs/wave`
   - `nextflow-io/nextflow`
   - `MultiQC/MultiQC`

2. For each new release, it generates a formatted changelog file and creates a PR
3. PRs are ready for review (not drafts) and require manual merge

### Manual usage

You can also run the changelog generator locally to backfill missing releases:

```bash
# Show help
uv run .github/scripts/generate-changelog.py --help

# Generate changelog for a specific release
uv run .github/scripts/generate-changelog.py --repo seqeralabs/wave --release v1.32.0

# Generate changelogs for the last 10 releases
uv run .github/scripts/generate-changelog.py --repo seqeralabs/wave --last 10

# Generate changelogs for the last 10 releases, overwrite existing markdown
uv run .github/scripts/generate-changelog.py --repo seqeralabs/wave --last 10 --overwrite

# Generate changelogs for a date range
uv run .github/scripts/generate-changelog.py --repo MultiQC/MultiQC --from 2024-01-01 --to 2024-12-31

# Dry run to preview what would be generated
uv run .github/scripts/generate-changelog.py --repo seqeralabs/fusion --last 5 --dry-run

# Generate changelog and create a PR for it
uv run .github/scripts/generate-changelog.py --repo seqeralabs/wave --release v1.32.0 --create-pr
```

The script uses [uv](https://docs.astral.sh/uv/) for dependency management - dependencies are installed automatically on first run.

For private repositories (`seqeralabs/fusion`), you need a GitHub token with repository access:

```bash
export GH_TOKEN=$(gh auth token)
```

### Changelog file locations

| Product  | Directory            | Extension |
|----------|----------------------|-----------|
| Fusion   | `changelog/fusion/`  | `.md`     |
| Wave     | `changelog/wave/`    | `.md`     |
| Nextflow | `changelog/nextflow/`| `.md`     |
| MultiQC  | `changelog/multiqc/` | `.mdx`    |

## Platform table update workflows

Some Platform reference tables are generated from source files in the `seqeralabs/platform` repository. Platform release workflows send a `repository_dispatch` event to this repository, and the docs workflow opens a draft PR with the generated table updates.

### Permissions tables
**Applies to Enterprise and Cloud documentation**
Permissions documentation is updated by [.github/workflows/update-permissions-docs.yml](.github/workflows/update-permissions-docs.yml), using [.github/scripts/update-permissions-tables.py](.github/scripts/update-permissions-tables.py).

The workflow listens for the `permissions-docs-updated` dispatch event from Platform. It expects `changed_files` to include one or both of:

- `docs/grants_roles.md`
- `docs/grants_operations.md`

When changes are detected, the workflow checks out Platform with a Platform-scoped docs bot app token, regenerates the permissions tables, and opens a draft PR against this repository with a Docs-scoped docs bot app token. The generated PR branch is named `permissions-docs-update-{platform_ref}`.

The Platform trigger runs for Cloud release tags such as `v26.1.0-cycle41` and Enterprise release candidate tags such as `v26.2.0-RC1-enterprise`. Cloud tags compare against the previous Cloud release tag. Enterprise RC tags compare against the previous stable Enterprise release tag, such as `v26.1.0-enterprise`.

### Audit event tables
**Applies to Enterprise documentation only**
Audit event documentation is updated by [.github/workflows/update-audit-events-docs.yml](.github/workflows/update-audit-events-docs.yml), using [.github/scripts/update-audit-events-tables.py](.github/scripts/update-audit-events-tables.py).

The workflow listens for the `audit-events-docs-updated` dispatch event from Platform. It expects `changed_files` to include:

- `docs/audit_events.md`

The Platform trigger is intended for Enterprise release candidate tags, such as `v26.1.0-RC5-enterprise`. The docs workflow checks out the Platform ref from the dispatch payload, regenerates the unversioned Enterprise audit event tables from `docs/audit_events.md`, and opens a draft PR. Versioned docs are not updated by this workflow; make versioned updates manually when required.

### Manual workflow runs

You can run either workflow manually from the GitHub Actions tab in this repository.

For permissions, run **Update Permissions Documentation** and provide:

- `changed_files`: `docs/grants_roles.md`, `docs/grants_operations.md`, or both as a comma-separated list.
- `platform_ref`: optional Platform tag, branch, or commit SHA to read grants files from. Use the release tag when reproducing an automated release update.
- `previous_tag`: optional context for the generated PR body.

For audit events, run **Update Audit Events Documentation** and provide:

- `changed_files`: `docs/audit_events.md`
- `platform_ref`: the Platform tag, branch, or commit SHA to read `docs/audit_events.md` from, such as `v26.1.0-RC5-enterprise`
- `previous_tag`: optional context for the generated PR body

You can also trigger the Platform-side workflows manually from the Platform repository. Use the exact source file paths above in `changed_files` if you want to bypass tag-diff detection.

### Troubleshooting

If the docs workflow does not start:

- Confirm the Platform-side workflow ran on a matching tag pattern. Permissions use Cloud release tags such as `v*-cycle*` and Enterprise RC tags such as `v*-RC*-enterprise`; audit events use Enterprise RC tags such as `v*-RC*-enterprise`.
- Confirm the Platform-side workflow detected one of the expected source files. If the tag diff does not include the source file, no dispatch event is sent.
- Check that the Platform workflow dispatched the expected event type: `permissions-docs-updated` or `audit-events-docs-updated`.
- Confirm the Platform repository has the docs bot secrets required to dispatch to this repository.
- Confirm this repository has the docs bot secrets required to read Platform and create draft PRs: `DOCS_BOT_APP_ID` and `DOCS_BOT_APP_PRIVATE_KEY`.

If the docs workflow starts but fails:

- Check the **Validate payload** step. The workflows reject unexpected file paths.
- Check the Platform app token and checkout steps. The docs bot GitHub App must be installed on Platform with contents read access.
- Check the docs app token step. Draft PR creation requires the docs bot GitHub App to be installed on this repository with contents and pull request write access.
- Check the update script output. Parse failures usually mean the source table headings or columns changed.
- Check the **Check for changes** step. If the generated tables already match, the workflow exits without opening a PR.

## Workflows and actions audit

This repository ships 18 GitHub Actions workflows under [.github/workflows/](.github/workflows/). It does not define any custom composite actions (no `.github/actions/` directory) — all workflows compose third-party actions or invoke scripts under [.github/scripts/](.github/scripts/). [Dependabot](.github/dependabot.yml) opens PRs daily to keep third-party action versions current.

### Summary

| Workflow | File | Trigger | Type | Status |
|---|---|---|---|---|
| No unresolved conflicts | [no-conflict-markers.yml](.github/workflows/no-conflict-markers.yml) | `pull_request` to `master` | Automatic | Active |
| Pre-commit check | [pre-commit-check.yaml](.github/workflows/pre-commit-check.yaml) | `pull_request` | Automatic | Active |
| Pre-commit fix | [pre-commit-fix.yaml](.github/workflows/pre-commit-fix.yaml) | PR comment `fix formatting` | Manual (comment) | Active |
| Internal link checking | [check-internal-links.yml](.github/workflows/check-internal-links.yml) | `pull_request` | Automatic | Active |
| External link check (Links) | [links.yml](.github/workflows/links.yml) | Weekly cron (Sun 18:00 UTC), `repository_dispatch`, manual | Automatic + manual | Active |
| markdownlint-cli2 | [markdown-lint.yml](.github/workflows/markdown-lint.yml) | `workflow_dispatch` only | Manual | Disabled (manual-only) |
| Trigger Netlify Build | [build-nightly.yml](.github/workflows/build-nightly.yml) | Daily cron (02:00 UTC), manual | Automatic + manual | Active |
| Index docs in Typesense | [typesense-scraper.yml](.github/workflows/typesense-scraper.yml) | Daily cron (01:00 UTC), manual | Automatic + manual | Active |
| Changelogs | [changelog-from-releases.yml](.github/workflows/changelog-from-releases.yml) | Twice-daily cron (03:17, 15:17 UTC), manual | Automatic + manual | Active |
| Check for CLI updates | [check-cli-updates.yml](.github/workflows/check-cli-updates.yml) | Daily cron (10:00 UTC), manual | Automatic + manual | **Broken** — see below |
| Update CLI Documentation | [update-cli-docs.yml](.github/workflows/update-cli-docs.yml) | `repository_dispatch: cli-release`, manual | Automatic + manual | Active (downstream of broken trigger) |
| Update Permissions Documentation | [update-permissions-docs.yml](.github/workflows/update-permissions-docs.yml) | `repository_dispatch: permissions-docs-updated`, manual | Automatic + manual | Active |
| Update Audit Events Documentation | [update-audit-events-docs.yml](.github/workflows/update-audit-events-docs.yml) | `repository_dispatch: audit-events-docs-updated`, manual | Automatic + manual | Active |
| Generate API Documentation Overlays | [generate-openapi-overlays.yml](.github/workflows/generate-openapi-overlays.yml) | `repository_dispatch: api-version-updated`, manual | Automatic + manual | Active |
| Apply Overlays and Regenerate Docs | [apply-overlays-and-regenerate.yml](.github/workflows/apply-overlays-and-regenerate.yml) | PR label `overlays-approved`, manual | Manual (label or dispatch) | Active |
| Documentation Review | [docs-review.yml](.github/workflows/docs-review.yml) | PR comment `/editorial-review`, manual | Manual (comment or dispatch) | Active |
| Claude PR Assistant | [claude.yml](.github/workflows/claude.yml) | `@claude` mention in PR/issue comments, reviews | Manual (comment) | Active |
| Claude Editorial Review | [claude-pr-review.yml](.github/workflows/claude-pr-review.yml) | `workflow_dispatch` only | Manual | **Superseded** by `docs-review.yml` |

### Quality gates that block PR merges

These checks gate merges; `pre-commit-fix.yaml` is an on-demand helper for fixing formatting failures.

- **[no-conflict-markers.yml](.github/workflows/no-conflict-markers.yml)** — fails if any tracked file outside `.github/` contains `<<<<<<<`.
- **[pre-commit-check.yaml](.github/workflows/pre-commit-check.yaml)** — runs the hooks defined in [.pre-commit-config.yaml](./.pre-commit-config.yaml) (whitespace, EOF newline, YAML validity, large-file guard, and the `check-doc-tags` hook backed by [.github/scripts/check-doc-tags.py](.github/scripts/check-doc-tags.py)). Paired with `pre-commit-fix.yaml` for one-click fixes.
- **[pre-commit-fix.yaml](.github/workflows/pre-commit-fix.yaml)** — on-demand helper triggered by a PR comment starting with `fix formatting`; re-runs pre-commit, commits any changes, and pushes to the PR branch (not a required merge gate).
- **[check-internal-links.yml](.github/workflows/check-internal-links.yml)** — runs `npm run build` with `FAIL_ON_BROKEN_LINKS=true`. The slowest required check; caches `.docusaurus` and `**/.cache` between runs.

### Scheduled/background jobs

- **[build-nightly.yml](.github/workflows/build-nightly.yml)** — daily POST to `NETLIFY_BUILD_HOOK_URL` so docs.seqera.io rebuilds even on days with no merges (useful for picking up upstream submodule changes).
- **[typesense-scraper.yml](.github/workflows/typesense-scraper.yml)** — re-indexes the live site into Typesense once a day so search results stay current.
- **[links.yml](.github/workflows/links.yml)** — weekly lychee crawl of external `https`/`http` links across all `.mdx` files. On failure, opens a labelled GitHub issue with the report instead of breaking a PR.
- **[changelog-from-releases.yml](.github/workflows/changelog-from-releases.yml)** — polls `seqeralabs/wave`, `nextflow-io/nextflow`, and `MultiQC/MultiQC` releases via [.github/scripts/generate-changelog.py](.github/scripts/generate-changelog.py) and opens PRs with new entries. `seqeralabs/fusion` is intentionally excluded from CI (run locally with a PAT). See [Changelog automation](#changelog-automation) above for manual invocation.

### Cross-repo content pipelines (Platform → docs)

Three workflows are driven by `repository_dispatch` events emitted from the [seqeralabs/platform](https://github.com/seqeralabs/platform) repository when a release tag is cut. Each one checks out Platform at the dispatched ref using a docs-bot GitHub App token, regenerates the relevant tables/specs, and opens a draft PR using a separate docs-scoped token.

| Workflow | Dispatch event | Platform source | Generated by | Output |
|---|---|---|---|---|
| [update-permissions-docs.yml](.github/workflows/update-permissions-docs.yml) | `permissions-docs-updated` | `docs/grants_roles.md`, `docs/grants_operations.md` | [.github/scripts/update-permissions-tables.py](.github/scripts/update-permissions-tables.py) | Draft PR updating Cloud + Enterprise roles and custom-roles pages |
| [update-audit-events-docs.yml](.github/workflows/update-audit-events-docs.yml) | `audit-events-docs-updated` | `docs/audit_events.md` | [.github/scripts/update-audit-events-tables.py](.github/scripts/update-audit-events-tables.py) | Draft PR updating `platform-enterprise_docs/monitoring/configtables/audit_events_*.yml` |
| [generate-openapi-overlays.yml](.github/workflows/generate-openapi-overlays.yml) | `api-version-updated` | `tower-backend/.../seqera-api-latest-flattened.yml` | Speakeasy CLI + Claude API call against the `openapi-overlay-generator` skill | Draft PR with comparison overlay, analysis JSON, and Claude-drafted overlays |

For full payload contracts and troubleshooting, see [Platform table update workflows](#platform-table-update-workflows) above.

### API documentation pipeline (multi-phase)

The OpenAPI documentation flow is a three-phase pipeline. The first phase runs in the Platform repo; the second and third run here.

1. **Phase 1 (Platform repo)** — Platform release dispatches `api-version-updated` to this repo with the new API version and ref.
2. **Phase 2: [generate-openapi-overlays.yml](.github/workflows/generate-openapi-overlays.yml)** — copies the flattened base spec, generates a Speakeasy comparison overlay, runs the `analyze_comparison.py` script from the `openapi-overlay-generator` skill, calls the Claude API to draft overlay YAML, and opens a draft PR.
3. **Phase 3: [apply-overlays-and-regenerate.yml](.github/workflows/apply-overlays-and-regenerate.yml)** — fires when a maintainer adds the `overlays-approved` label to the Phase 2 PR (or on manual dispatch with a PR number). Extracts overlays from the Claude-generated markdown, consolidates them, applies them with Speakeasy, regenerates parameter tables, runs `docusaurus gen-api-docs`, updates the sidebar, archives the used overlays, and marks the PR ready for review.

The `overlays-approved` label is the only handoff between the two automated phases — without it, Phase 3 never runs.

### CLI documentation pipeline

Two workflows form a producer/consumer pair for tower-cli releases.

1. **[check-cli-updates.yml](.github/workflows/check-cli-updates.yml)** — polls `seqeralabs/tower-cli` for the latest release tag and, when a new version is detected, fires a `cli-release` dispatch.
2. **[update-cli-docs.yml](.github/workflows/update-cli-docs.yml)** — consumes the `cli-release` dispatch (or a manual `workflow_dispatch`), checks out tower-cli at the release tag, runs `./gradlew extractCliMetadata`, then invokes `platform-cli-docs/scripts/generate-cli-docs.py` to produce reference pages and opens a PR.

> **Note:** `check-cli-updates.yml` is currently **broken** — see [Stale or broken workflows](#stale-or-broken-workflows). `update-cli-docs.yml` itself still works when triggered manually with a valid `cli_version`.

### Editorial review workflows

- **[docs-review.yml](.github/workflows/docs-review.yml)** — the current editorial-review entry point. Fires on a `/editorial-review` PR comment (or manual dispatch with a PR number). Runs a bash-syntax check, classifies the PR as `content` or `rename`, runs Vale on changed markdown for fast terminology checks, then a smart-gate blocks LLM runs when (a) the last review was <60 minutes ago, (b) <10 lines changed, or (c) markdownlint found >5 issues. If the gate passes it invokes the `/editorial-review` skill, posts up to 60 inline suggestions via [.github/scripts/post-inline-suggestions.sh](.github/scripts/post-inline-suggestions.sh), and uploads the full report as an artifact. An `auto-fix` job exists but is hard-disabled (`if: false`).
- **[claude.yml](.github/workflows/claude.yml)** — the generic `@claude` assistant. Triggers on `@claude` mentions in PR comments, PR review comments, PR reviews, and new issues. Uses `anthropics/claude-code-action` with a 60-minute timeout.
- **[claude-pr-review.yml](.github/workflows/claude-pr-review.yml)** — early prototype of the editorial review. Its `pull_request` and `issue_comment` triggers are commented out and only `workflow_dispatch` remains, with an inline note that `docs-review.yml` replaces it. The `apply-fixes` job is also hard-disabled.

### Cross-workflow dependencies

```
Platform repo (release tag cut)
   │
   ├── dispatch: permissions-docs-updated  ──►  update-permissions-docs.yml      ──► draft PR
   ├── dispatch: audit-events-docs-updated ──►  update-audit-events-docs.yml     ──► draft PR
   └── dispatch: api-version-updated       ──►  generate-openapi-overlays.yml    ──► draft PR
                                                          │
                                                          │  (maintainer adds `overlays-approved` label)
                                                          ▼
                                                apply-overlays-and-regenerate.yml ──► PR ready

tower-cli release
   └── check-cli-updates.yml ──► dispatch: cli-release ──► update-cli-docs.yml ──► PR

PR comment `/editorial-review`  ──► docs-review.yml (gates + Vale + /editorial-review skill)
PR comment `fix formatting`     ──► pre-commit-fix.yaml
PR label `overlays-approved`    ──► apply-overlays-and-regenerate.yml
@claude in comment/issue/review ──► claude.yml
```

The two `repository_dispatch` content pipelines (permissions, audit events) and the API overlay pipeline are independent of each other — they share the `DOCS_BOT_APP_ID` / `DOCS_BOT_APP_PRIVATE_KEY` GitHub App credentials but otherwise don't interact.

### Dependencies on `.claude/` skills and agents

Three workflows reach into [.claude/](.claude/) and depend on its scripts or skills staying in place:

- **[generate-openapi-overlays.yml](.github/workflows/generate-openapi-overlays.yml)** runs `.claude/skills/openapi-overlay-generator/scripts/analyze_comparison.py` and inlines `references/standards.md` + `references/overlay-patterns.md` into the prompt sent to the Claude API. Moving or renaming any of these will break Phase 2.
- **[apply-overlays-and-regenerate.yml](.github/workflows/apply-overlays-and-regenerate.yml)** runs `.claude/skills/openapi-overlay-generator/scripts/update_sidebar_v2.py` to update the API sidebar from the analysis JSON.
- **[docs-review.yml](.github/workflows/docs-review.yml)** invokes the `/editorial-review` skill via `anthropics/claude-code-action` with `--allowedTools "Skill(editorial-review),Task"`. The skill in turn orchestrates the `voice-tone` and `terminology` agents in [.claude/agents/](.claude/agents/) according to [.claude/agents/review-config.yaml](.claude/agents/review-config.yaml). The `clarity`, `punctuation`, and `docs-fix` agents exist on disk but are not currently wired into CI.

The disabled `apply-fixes` job in `claude-pr-review.yml` and the disabled `auto-fix` job in `docs-review.yml` both reference the `docs-fix` agent; if either is ever re-enabled, that agent becomes a hard dependency.

### Stale or broken workflows

- **[check-cli-updates.yml](.github/workflows/check-cli-updates.yml) — broken path check.** The existence check on line 26 looks for `platform-cloud/docs/cli/metadata/cli-metadata-v<version>.json`, but CLI metadata actually lives at `platform-cli-docs/metadata/`. The wrong path never matches, so the workflow always evaluates `exists=false` and dispatches `cli-release` every day. Downstream [update-cli-docs.yml](.github/workflows/update-cli-docs.yml) re-runs against the same `cli-docs-v<version>` branch each time, which `peter-evans/create-pull-request` deduplicates into a single PR — but the workflow burns CI minutes every day until the path is corrected (or the daily cron is removed).
- **[claude-pr-review.yml](.github/workflows/claude-pr-review.yml) — superseded.** Header comment explicitly states it is replaced by `docs-review.yml`. Only `workflow_dispatch` is wired up; both jobs in the file (`editorial-review`, `apply-fixes`) are unreachable in practice (one has commented-out triggers, the other has `if: false`). Safe to delete in a follow-up.
- **[markdown-lint.yml](.github/workflows/markdown-lint.yml) — manual-only by design.** Header says "Disable automatic runs" and only `workflow_dispatch` is wired up. Markdownlint is still consulted by the `docs-review.yml` smart-gate via `npx markdownlint-cli2`, so this workflow exists for opt-in manual sweeps rather than as a required check.
- **`auto-fix` job in [docs-review.yml](.github/workflows/docs-review.yml) — disabled with `if: false`.** Commented out in favour of inline suggestions. Kept in-file as a re-enable path; references the `docs-fix` agent.
- **`apply-fixes` job in [claude-pr-review.yml](.github/workflows/claude-pr-review.yml) — disabled with `if: false`.** Same reasoning as above.

The scripts [.github/scripts/verify-agent-findings.py](.github/scripts/verify-agent-findings.py), [verify-agent-findings.sh](.github/scripts/verify-agent-findings.sh), [example-review.txt](.github/scripts/example-review.txt), and [check-netlify-excludes.sh](.github/scripts/check-netlify-excludes.sh) are not referenced by any current workflow; they appear to be local utilities or relics of older review pipelines.

## Workaround for Netlify memory problems (May 2025)

In May 2025 we added new API docs. This increased the size of the Docusaurus build,
and led to Netlify deployment builds running out of memory and time.

To fix this, we added logic to `docusaurus.config.js` and `netlify.toml` to split the
site builds into multiple separate Netlify deployments, stitched back together with redirects.

This works using the following principles:

- Sections of the docs are defined in variables in `docusaurus.config.mjs`
- Based on the presence or absence of named environment variables, they are included in the Docuaurus config or not
- By defining these ENV vars in your build environment, you can selectively skip chunks in the build

Deployment works because we have two Netlify sites: `seqera-docs` and `seqera-docs-api`.
They're the same except that they have different environment variable set in their configuration.
This means that whenever you push to `master`, both deploy and both sites update.

The site's `netlify.toml` includes some redirects with `200` statuses that take links to missing content on the primary deployment to fetch data from the secondary deployment, without affecting the browser bar URL.
