# Platform CLI documentation automation

This directory is the owner of the Seqera Platform CLI documentation pipeline. The `tower-cli` repository only announces stable releases; this repository downloads the published CLI, extracts its resolved command model, regenerates reference pages, and opens a draft documentation pull request.

The automation deliberately separates deterministic generation from editorial inference. A workflow can prove which commands and options exist. A reviewer must still decide whether a release needs new concepts, examples, migration guidance, or changes to the command index.

## End-to-end flow

1. `tower-cli/.github/workflows/notify-cli-docs.yml` runs when a GitHub release is published.
2. The notifier ignores releases whose GitHub `prerelease` flag is `true`.
3. The notifier uses the organization GitHub App to send a `cli-release-published` repository dispatch to `seqeralabs/docs`. Its payload contains only the source repository, release ID, tag, and publication time.
4. `.github/workflows/update-cli-docs.yml` re-fetches the release from the GitHub API and verifies that it is published and stable. Dispatch data is treated as a hint, not trusted release metadata.
5. `prepare-cli-release.py` downloads `tw-jar.jar` and `checksums_sha256.txt`, verifies the JAR's SHA-256 checksum, compiles the docs-owned Java extractor against the released fat JAR, and extracts picocli's resolved runtime command model.
6. If `release.json` identifies a previously documented release, the workflow downloads that release and extracts it with the same extractor source for a like-for-like comparison.
7. `generate-cli-docs.py` recursively regenerates reference pages, merges the hand-maintained overlays, removes stale generated pages, and updates the CLI sidebar.
8. `compare-metadata.py` writes the command-model change report used as the draft PR body.
9. `apply-cli-release.py` updates the idempotent version notices and records the processed release in `release.json`.
10. The workflow uploads both metadata snapshots and the comparison report as a 30-day Actions artifact. Raw metadata and release JARs are not committed.
11. For a stable release with repository changes, the GitHub App opens or updates a draft `cli-docs-vX.Y.Z` pull request.
12. A reviewer follows `.claude/skills/review-cli-docs-release/SKILL.md`, edits overlays or conceptual pages as needed, builds the docset, and only then marks the PR ready.

## Ownership boundary

### `tower-cli`

The CLI repository owns only the release notification. It does not contain an extractor, generate metadata, upload an extra metadata release asset, or run docs tooling.

The release contract consumed by docs is the existing pair of release assets:

- `tw-jar.jar`
- `checksums_sha256.txt`

If either asset is renamed or removed, the docs workflow fails closed and reports the missing asset.

### `docs`

The docs repository owns:

- release validation and asset download
- checksum verification
- the Java/picocli extractor
- metadata comparison
- Markdown generation and overlays
- the processed-release marker
- draft PR creation
- editorial review guidance

## Stable and prerelease behavior

GitHub's release fields are authoritative:

- `draft: true`: never processed
- `prerelease: true`: may be extracted by a manual dry run, but never creates an automated docs PR
- `prerelease: false`: eligible for an automated draft docs PR

The filter is enforced in both repositories. Tag naming is not used to infer stability.

Historically, tower-cli has used GitHub prereleases rarely, but the filter remains important because it is an explicit release contract rather than a convention inferred from past tags.

## Authentication and permissions

Both workflows expect these organization-level Actions secrets to be available to their repositories:

- `DOCS_BOT_APP_ID`
- `DOCS_BOT_APP_PRIVATE_KEY`

The GitHub App must be installed for `seqeralabs/docs`. Its docs-repository token needs enough permission to send a repository dispatch and to create the documentation branch, commit, and draft pull request. In practice that means repository contents and pull request write access. The workflows mint repository-scoped installation tokens rather than storing a long-lived personal token.

Release assets are public. The docs workflow uses its short-lived workflow token only to avoid anonymous API rate limits; the extractor process receives a cleaned environment without GitHub or Platform credentials.

## Recovery and manual operation

`.github/workflows/check-cli-updates.yml` runs daily as a recovery path. It compares GitHub's latest stable tower-cli release with `release.json` and sends the same dispatch only when the release is not documented and no matching draft PR is open. The tower-cli dispatch is the primary trigger; the schedule handles missed events or temporary failures.

The **Update CLI documentation** workflow can also be run manually:

- Leave `tag_name` blank to resolve GitHub's latest stable release.
- Supply a release tag to inspect a specific release.
- Set `create_pull_request` to `false` for a dry run. Prereleases are always dry-run-only, regardless of this input.

Re-running a stable release is idempotent. The PR action uses a release-specific branch and updates an existing PR instead of opening duplicates.

## Rollout order

Merge and verify the docs automation change first. GitHub only delivers `repository_dispatch` events to a workflow that exists on the target repository's default branch. Then merge the generated current-release parity PR so `release.json` records the latest stable baseline before the scheduled recovery check runs.

Then merge the small tower-cli notifier. Confirm that the organization secrets are available to both repositories and that the GitHub App installation includes `seqeralabs/docs`. The next stable release should exercise the full dispatch path; until then, run the docs update workflow manually with `create_pull_request: false` to smoke-test extraction without publishing a PR.

## Generated and maintained files

| Path | Purpose | Committed |
| --- | --- | --- |
| `docs/reference/*.md` | Generated command reference with overlays merged | Yes |
| `docs/sidebar/sidebar.js` | Generated list of top-level command pages | Yes |
| `overlays/*.md` | Human-maintained examples and conceptual additions | Yes |
| `release.json` | Small marker for the last merged stable release | Yes |
| Actions artifact `cli-metadata-*.json` | Raw current and previous command models used for review | No |
| Released `tw-jar.jar` | Verified extraction input | No |

Do not hand-edit generated option tables. Put durable additions in the matching overlay named from the full command path, with spaces replaced by hyphens. For example, content for `tw runs list` belongs in `overlays/tw-runs-list.md`. Shared Markdown link definitions belong in `overlays/_links.md` and are appended to every generated page.

## Local reproduction

Requirements:

- Java 25 or later (`java` and `javac` on `PATH`), matching the Java release the tower-cli JAR is compiled for
- Python 3.11 or later
- network access to public GitHub releases

From the docs repository root:

```bash
work_dir=$(mktemp -d)
python3 platform-cli-docs/scripts/prepare-cli-release.py \
  --tag-name v0.38.0 \
  --require-stable \
  --work-dir "$work_dir"

python3 platform-cli-docs/scripts/generate-cli-docs.py \
  --metadata "$work_dir/cli-metadata-current.json" \
  --overlays platform-cli-docs/overlays \
  --output platform-cli-docs/docs/reference \
  --sidebar platform-cli-docs/docs/sidebar/sidebar.js
```

On macOS, a Python installation that does not use the system trust store may also need `SSL_CERT_FILE=/etc/ssl/cert.pem` for the download step.

## Review and maintenance checklist

- Inspect the metadata comparison and release notes before editing prose.
- Verify changed commands directly with `tw ... --help` from the released JAR.
- Check every overlay whose command was removed or renamed.
- Add new top-level commands to the categorized list in `docs/commands-reference.md`; the sidebar itself is generated.
- Keep examples evidence-based and runnable. Never infer flags, defaults, output, or compatibility claims.
- Run the Python tests, generate from a real release, and build the Platform CLI docset after changing extraction or rendering behavior.
- Preserve exact release asset names or update this contract and both validation paths together.
- Keep all metadata and JAR output in temporary storage or Actions artifacts, not Git.

The older files under `scripts/` that describe a tower-cli Gradle extractor are historical planning records and are not the operational source of truth. This README and the two GitHub workflows define the maintained automation.
