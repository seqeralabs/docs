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

### Build modes

The site build is controlled by `DOCS_SITE_MODE`:

- `main` builds `docs.seqera.io`
- `enterprise-archive` builds `docs-archive.seqera.io`

The main site serves the current Platform Enterprise docs (`24.1+`) together with the active product docs. The archive site serves legacy Platform Enterprise versions (`23.4`, `23.3`, `23.2`, and `23.1`) only.

For local archive preview and builds:

- `DOCS_SITE_MODE=enterprise-archive npm run dev`
- `npm run dev:archive`
- `DOCS_SITE_MODE=enterprise-archive npm run build`
- `npm run build:archive`

In archive mode, the startup/build preparation step skips fetching the external OSS doc repos because they are not required for the legacy Enterprise-only site.

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

## Workaround for Netlify memory problems (May 2025)

In May 2025 we added new API docs. This increased the size of the Docusaurus build,
and led to Netlify deployment builds running out of memory and time.

To fix this, we added logic to `docusaurus.config.js` and `netlify.toml` to split the
site builds into multiple separate Netlify deployments, stitched back together with redirects.

This works using the following principles:

- Sections of the docs are defined in variables in `docusaurus.config.mjs`
- Based on the presence or absence of named environment variables, they are included in the Docuaurus config or not
- By defining these ENV vars in your build environment, you can selectively skip chunks in the build

Deployment works because we split large docsets into separate Netlify sites with different build-time configuration.

Today this includes:

- `seqera-docs` for the main docs site
- `seqera-docs-api` for the API docs split
- `docs-archive.seqera.io` for legacy Platform Enterprise docs

The main site's `netlify.toml` includes redirects for these split deployments:

- API docs use `200` proxy-style redirects so they continue to resolve under `docs.seqera.io`
- Legacy Platform Enterprise docs use cross-domain `301` redirects so old versioned URLs canonicalize to `docs-archive.seqera.io`

The archive deployment is intended to be mostly frozen. Normal `master` changes should not rebuild it. If a legacy Enterprise fix is required, apply that change to the dedicated archive branch/site rather than treating it like a normal main-site update.
