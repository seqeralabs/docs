# Troubleshooting placement

Troubleshooting content does not belong inline on concept, task, tutorial, or
reference pages. It belongs on the dedicated troubleshooting pages under each
product's `troubleshooting_and_faqs/` directory or on the `troubleshooting.md` page. This reference covers **where**
troubleshooting content goes and **how to decide** the destination — not how to
write the entries themselves.

## What counts as troubleshooting content

Move a section out of a feature page if it is organized around a **failure mode**
rather than a feature. Tells:

- A heading or paragraph that names an error, error message, or failure ("Session
  is stuck in starting", "Error: AccessDenied", "Build fails with…").
- Symptom → cause → fix structure.
- "If X doesn't work…", "If you see…", "Known issues", "Common problems".
- Workarounds and resolutions for a thing going wrong.

Leave content in place if it is part of the normal task or concept (expected
behavior, configuration steps, how the feature works). A note about a limitation
that the reader needs while doing the task can stay as a `:::note`; a recovery
procedure for when something breaks moves.

## Where it goes

Each product has a troubleshooting directory of feature-scoped pages:

| Product             | Directory                                                             |
| ------------------- | --------------------------------------------------------------------- |
| Platform Cloud      | `platform-cloud/docs/troubleshooting_and_faqs/`                       |
| Platform Enterprise | `platform-enterprise_docs/troubleshooting_and_faqs/`                  |
| Fusion              | `fusion_docs/troubleshooting/` (and `fusion_docs/troubleshooting.md`) |
| Wave                | `wave_docs/wave_repo/docs/troubleshoot.md`                            |

Within a directory, pages are scoped by product area or feature — for example, in
Platform Cloud: `studios_troubleshooting.md`, `aws_troubleshooting.md`,
`azure_troubleshooting.md`, `datasets_troubleshooting.md`,
`workspaces_troubleshooting.md`, `nextflow.md`, `api_and_cli.md`.

## Decide: existing page or new page

Pick the destination by the content's product/feature:

- **Add to an existing page** when a troubleshooting page already covers that
  feature or area. A Studios failure mode goes in `studios_troubleshooting.md`; an
  AWS Batch issue goes in `aws_troubleshooting.md`. This is the common case.
- **Create a new page** when the content covers a feature with no troubleshooting
  page yet, or when an existing page has accumulated enough unrelated entries that
  the feature deserves its own. Name it `<feature>_troubleshooting.md` to match the
  existing convention, place it in the product's `troubleshooting_and_faqs/`
  directory, and add it to the sidebar.

When unsure which existing page fits, or whether to split a new one out, ask the
user rather than guessing — placement affects navigation and inbound links.

## Format on the destination page

Each troubleshooting topic is a `##` section. Follow the page's existing pattern:

- **Heading**: name the failure mode or the error message. For an error message,
  prefix with the severity (`Error:`, `Warning:`) and wrap the message in
  backticks; truncate a long message with an ellipsis and give the full text in
  the body.
- **Body**: symptom (often the exact error) → cause ("This issue occurs
  when…") → the **workaround** (temporary) or **resolution** (permanent). Use those
  two words consistently; readers search for them.
- Keep entries brief — symptom, a one-line cause, one fix, one link out. Don't add
  background asides or variant examples.

## Process

1. **Identify** troubleshooting sections in the in-scope page using the tells above.
2. **Choose the destination** product directory and decide existing page vs new
   page (see above). Ask the user if the choice isn't clear.
3. **Move** each section to the destination as a `##` topic, reformatting the
   heading and body per the destination page's pattern. Preserve all links,
   anchors, code blocks, and images (update relative image/link paths for the new
   location).
4. **Remove** the section from the source page. If readers of the source page will
   still look for it there, leave a short pointer link to the troubleshooting page
   rather than a duplicate of the content.
5. **Update the sidebar** if you created a new page.
6. **Flag moved headings** in the change summary — moving a section changes its
   anchor and breaks any inbound links (`page.md#old-anchor`); list them so they
   can be repointed.

## Example

### Before (inline on `studios.md`, a feature page)

```markdown
## Resource allocation

Studios allocate resources from the compute environment...

### Session is stuck in starting

If your Studio session doesn't advance from starting to running within 30 minutes,
select the three dots next to the status message and select **Stop**, then check
the AWS Batch compute environment is in the `ENABLED` state with a `VALID` status.
```

### After

`studios.md` — the troubleshooting subsection is removed and replaced with a
pointer:

```markdown
## Resource allocation

Studios allocate resources from the compute environment...

For session and startup problems, see [Studios troubleshooting](../troubleshooting_and_faqs/studios_troubleshooting).
```

`troubleshooting_and_faqs/studios_troubleshooting.md` — the content is added as a
`##` topic:

```markdown
## Session is stuck in **starting**

If your Studio session doesn't advance from starting to running status within 30
minutes, select the three dots next to the status message and select **Stop**.

To resolve, confirm the AWS Batch compute environment is in the `ENABLED` state
with a `VALID` status.
```

Change summary should note: moved "Session is stuck in starting" from `studios.md`
to `studios_troubleshooting.md` (existing page); left a pointer link; flagged the
removed anchor `studios.md#session-is-stuck-in-starting` for inbound-link repointing.

## Important notes

- **Troubleshooting lives on troubleshooting pages**, not inline on feature pages.
- **Existing page first**: add to the feature's existing troubleshooting page when
  one exists; create `<feature>_troubleshooting.md` only when none fits.
- **Ask when placement is ambiguous** — it affects navigation and links.
- **Preserve content and links**; update relative paths when moving.
- **Flag moved anchors** so inbound links can be repointed.
- For the writing style of the entries themselves, use the `docs-troubleshooting`
  skill.
