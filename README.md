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
  - [Check with Vale style guide](#check-with-vale-style-guide)
  - [Creating internal links](#creating-internal-links)

## Architecture

Contentful/relevant files include:

```
├── README.md
├── docusaurus.config.js // website config
├── platform_versioned_docs // versioned Platform docs
│   ├── version-22.4.0
│   ├── version-23.1.0
│   ├── version-23.2.0
│   └── version-23.3.0
├── platform_versioned_sidebars // versioned Platform sidebars
│   ├── version-22.4.0-sidebars.json
│   ├── version-23.1.0-sidebars.json
│   ├── version-23.2.0-sidebars.json
│   └── version-23.3.0-sidebars.json
├── platform_versions.json
└── wave_docs // Git submodule
```

### Seqera Platform

The Platform documentation is versioned and lives in the `platform_versioned_docs` directory. Each version in this directory also requires a sidebar config, which lives in the `platform_versioned_sidebars` directory. Versions also need to be specified in `platform_versions.json`. When adding a new latest version, the `docusaurus.config.js` needs to be updated as well.

We have a script which can select a commit (or ideally release tag) to be used for publishing a new version on the docs website.

### Wave

Wave documentation is available as a Git submodule. Wave documentation is not versioned, and lives in the `wave_docs` directory. Changes to the Wave documentation must be made in the [Wave repo](https://github.com/seqeralabs/wave/tree/master/docs). To enable access to the Wave docs in the submodule, after cloning this repository you must run `git submodule update --init --recursive`.

To incorporate documentation changes from the Wave repository, run the following command: `git submodule update --recursive --remote`. This is mandatory, or published documentation cannot reflect any changes made to the Wave documentation since this command was last run. If you accidentally run the aforementioned command and want to revert, run the following command to revert to the previous commit ID for the Wave repository: `git submodule update --init`.

## Writing new content

All new content originates in the docs repo. This is the source of truth.

To publish new content:

1. Create a new branch in the docs repo, such as `gh-issue-number`.
2. Complete the necessary work.
4. Raise a PR to merge your updates to master
5. Add relevant labels to your PR and request reviews from:
   - Language review from a docs-codeowners member
   - Technical review from the backend engineer or other SME closest to the feature
6. Check and review the changes using the Netlify preview.
7. Merge the PR once approved, if you created a new branch in the first step.

Once merged to the master branch, the changes will be live immediately.

## Fixing legacy content

Version-specific changes to legacy documentation sets currently occur directly in this repository. Each product has a `product_versioned_docs` folder in this repository. That folder contains a subfolder for each version — edit the files in these versioned folders directly to update versioned content on docs.seqera.io:

1. Create a new branch in this repository, such as `product-gh-issue-number`.
2. Create the change in the related files in the correct version (e.g., `23.1.0`) directory, and any other versions affected.
3. Raise a PR based for review, requesting the same 2 reviews as for new content.
4. After approval, merge the PR to the master branch.

## Check with Vale style guide

This repository includes a set of Vale style guide rules reflecting style and grammar conventions that apply to this documentation set. To use Vale, complete the following steps:

1. [Install](https://vale.sh/docs/vale-cli/installation/) it for your platform.
1. Install the rules package by running `vale sync`.

To run Vale, enter the following command:

```
vale --glob='**/*.md' .
```

You can also specify a limited subset of files, such as `platform_versioned_docs/version-23.4.0` instead of `.`.

## Creating internal links

You can link between Markdown files with relative links within the same documentation set. If you need to link to a different documentation set, such as Wave or Fusion, you **must** use an absolute path. For example:

```
For more information, see [Fusion](/fusion_docs/guide.mdx).
```
