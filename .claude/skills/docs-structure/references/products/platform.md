# Seqera Platform — troubleshooting placement

Where troubleshooting content goes for **Seqera Platform** docs (Cloud and
Enterprise). Apply on top of `../core/troubleshooting.md`, which covers what
counts as troubleshooting and how to format an entry.

## Where it goes

Platform keeps a directory of feature-scoped troubleshooting pages per edition:

| Edition             | Directory                                            |
| ------------------- | ---------------------------------------------------- |
| Platform Cloud      | `platform-cloud/docs/troubleshooting_and_faqs/`      |
| Platform Enterprise | `platform-enterprise_docs/troubleshooting_and_faqs/` |

Within a directory, pages are scoped by product area or feature — for example, in
Platform Cloud: `studios_troubleshooting.md`, `aws_troubleshooting.md`,
`azure_troubleshooting.md`, `datasets_troubleshooting.md`,
`workspaces_troubleshooting.md`, `nextflow.md`, `api_and_cli.md`.

## Existing page or new page

- **Add to an existing page** when a troubleshooting page already covers that
  feature or area. A Studios failure mode goes in `studios_troubleshooting.md`; an
  AWS Batch issue goes in `aws_troubleshooting.md`. This is the common case.
- **Create a new page** when the content covers a feature with no troubleshooting
  page yet, or when an existing page has accumulated enough unrelated entries that
  the feature deserves its own. Name it `<feature>_troubleshooting.md` to match the
  convention, place it in the edition's `troubleshooting_and_faqs/` directory, and
  add it to the sidebar.
