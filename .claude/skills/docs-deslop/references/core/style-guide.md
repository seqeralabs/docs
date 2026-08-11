# Technical writing style rules

These rules flavor this skill for technical writing specifically. Apply them in addition to the general anti-slop rules in `phrases.md` and `structures.md`.

The rules are pragmatic, drawn from common practice across well-edited technical documentation. Where they conflict with a project's local style guide (a `STYLE.md`, a `.vale.ini`, a CONTRIBUTING note), prefer the local guide and note the conflict in the change summary.

> **Overlap with `phrases.md` is deliberate.** A few word lists here — marketing adjectives, sales/marketing verbs, the *allow*/*enable* rule — also appear in `phrases.md`, where they live in fuller form. `phrases.md` is the **canonical** catalog for individual word and phrase swaps; this file restates the highest-frequency ones in the context of the style rules they support. If you add or change an entry, update `phrases.md` first.

## The voice

Technical writing should be **concise, direct, and precise**. The goal is content that is easy to scan, search, and act on. The tone is **conversational but brief, friendly but succinct**.

Documentation is a single source of truth for engineers and operators. Treat it like one: every sentence should pay rent.

## Active voice (default)

Active voice is easier to read and to translate. Use it unless the actor is genuinely unknown or awkward.

| Use                                            | Instead of                                 |
| ---------------------------------------------- | ------------------------------------------ |
| Seqera Platform submits the job to AWS Batch.  | The job is submitted to AWS Batch by Seqera Platform. |
| Run the migration before you upgrade.          | The migration should be run before upgrading. |
| Seqera Platform generates a new access token.  | A new access token is generated.           |

Exception: when the product itself as a subject feels awkward, passive voice is acceptable. "The report is exported" is fine when "The system exports the report" would be odd.

## Present tense

Write instructions and descriptions in the present tense. The product does the thing now, not in some future.

| Use                                          | Instead of                                       |
| -------------------------------------------- | ------------------------------------------------ |
| This command installs the package.          | This command will install the package.           |
| The pipeline runs on the selected compute environment. | The pipeline will run on the selected compute environment. |
| Selecting **Launch** starts the run.        | Selecting **Launch** will start the run.         |

Future-tense tells: "will", "is going to", "shall". Cut them unless you're warning about a consequence ("If you delete the workspace, you will lose all its runs.").

## Customer perspective

Focus on what the user can do, not what the product does for them. Address the reader as **you**.

| Use                                                              | Instead of                                                  |
| ---------------------------------------------------------------- | ----------------------------------------------------------- |
| Use the Launchpad to relaunch a pipeline.                        | The platform allows you to relaunch pipelines from the Launchpad. |
| You can set the work directory in the compute environment.       | The system gives you the ability to set the work directory. |
| Sign in to view your runs.                                       | The dashboard allows you to view your runs.                 |

Words to avoid because they put the product in the subject seat:

- **allow** ("X allows you to...") → speak directly to the user
- **enable** (when it means "let") → use "you can..." or "use X to..."
- **lets you** / **gives you the ability to** → "you can"

## No marketing language

Documentation is not sales. Drop the puffery.

Words to avoid:

- **easily** — if it really is easy, the steps will show it
- **simply** / **simple** — same
- **just** ("just run") — usually deletable
- **seamlessly** / **seamless** — almost always slop
- **powerful** — describe what it does instead
- **robust** — describe what survives what
- **comprehensive** — describe the scope
- **blazing fast** / **lightning fast** — give the number
- **world-class** / **best-in-class** — cut entirely

Replace marketing claims with measurable facts:

- "Saves you time" → "Reduces a typical nf-core/rnaseq run from 3 hours to 90 minutes on AWS Batch"
- "Improves security" → "Encrypts credentials at rest with AES-256"

## No self-referential writing

Cut anything that announces what the document is doing.

- "This page shows..." → state the content
- "This guide explains..." → state the content
- "In this document, we'll cover..." → state the content
- "Read on to learn..." → state the content

Instead of:

> This page explains the different compute environments you can use.

Write:

> Seqera Platform runs pipelines on AWS Batch, Azure Batch, Google Cloud Batch, Kubernetes, and HPC schedulers.

## Be specific, not vague

Documentation should give the reader information they can act on. Cut vague claims and replace with the specific thing.

- "Various options" → name them
- "Multiple flags" → list them or give the count
- "The reasons are structural" → state the reasons
- "Significantly faster" → give the number
- "A number of users" → give the number or say "many"

## Word choice cheatsheet

These are the highest-frequency rules that come up when editing technical prose:

| Use                | Instead of                       | Notes                                                |
| ------------------ | -------------------------------- | ---------------------------------------------------- |
| use                | utilize, leverage (verb)         | shorter and clearer for translation                  |
| because            | since (for causation), as        | "since" is for time only                             |
| select             | click                            | covers keyboard and accessibility                    |
| earlier / later    | above / below (for cross-refs)   | "above" is ambiguous after page reflow               |
| for example        | e.g.                             | no Latin abbreviations                               |
| that is            | i.e.                             | no Latin abbreviations                               |
| and                | & (ampersand)                    | except in UI element names that literally use `&`    |
| sign in            | log in, login (verb)             | "login" is a noun                                    |
| drop-down          | dropdown, drop down, drop-down menu | always hyphenated; "menu" is redundant            |
| text box           | field, box, input                |                                                      |
| checkbox           | check box                        |                                                      |
| do not             | don't (in error messages, warnings, reference docs) | contractions OK in tutorials/conversational |
| cannot             | can not                          |                                                      |
| denylist           | blacklist                        | inclusive language                                   |
| allowlist          | whitelist                        | inclusive language                                   |
| main               | master (branch)                  | inclusive language                                   |

Other specific guidance:

- **Do not use "and so on" or "etc."** — be specific or list the items
- **Do not use "currently"** — docs describe the product as it is today
- **Do not use possessives for proper nouns** — "the Docker CLI", not "Docker's CLI"
- **Do not use "above" or "below" for cross-references** within a page — use "earlier" / "later", or link directly
- **Spell out acronyms on first use per page** — but only once per page

## Headings

- **Sentence case**, not Title Case: "Configure the runner", not "Configure The Runner"
- **No bold in headings**
- **No code in headings unless it's actually code** — and put it in backticks
- **Skip H1** — the page title becomes the H1, so don't add another one
- **Don't skip heading levels** — H2 to H4 with no H3 in between is wrong
- **Avoid headings deeper than H5**; if you need more, split the page

## Lists and tables

The general rule: use lists for genuinely list-shaped content; use tables for two-dimensional comparison; use prose for everything else.

- **Use a list** when you have 3+ parallel items, each with the same grammatical shape
- **Use a table** when you're comparing items along multiple attributes
- **Use prose** for two items, or items with different shapes, or anything that reads naturally as a sentence

Each list item should be a complete thought or step. Don't pad lists with one- and two-word entries that would read better as a sentence.

## Lines and paragraphs

- **One sentence per line** in the Markdown source (semantic line breaks). This keeps diffs readable.
- **Lines wrap at roughly 100 characters** in the source.
- **One blank line between paragraphs, headings, and lists.**

## Localization-friendly writing

The product is read by non-native English speakers and run through translation. To make text easier to translate:

- **Avoid words that hide the subject:** "there is", "there are", "it is recommended that" (the dummy-subject form — "X is recommended" is fine, since it has a real subject)
- **Avoid ambiguous pronouns**, especially "it" — use the noun
- **Avoid words ending in -ing** when a simple verb form works ("the configuration that controls X" beats "controlling X")
- **Don't confuse "since" and "because"** — "since" implies time only
- **Skip Latin abbreviations** — e.g., i.e., etc.
- **Skip culture-specific idioms** — "kill two birds with one stone", "out of the gate", "the whole nine yards"
- **Break up noun strings** — "project integration custom settings" → "custom settings for project integrations"

## Building trust

Trust comes from specificity, not enthusiasm. Replace:

- "This feature will save you time and money" → "This feature reduces the manual setup for a new pipeline run from 30 minutes to 2 minutes"
- "Powerful integration" → "Integration that emits run events to your webhook in under 5 seconds"

## Contractions

Contractions are encouraged in conversational and tutorial content for a friendly tone. They are **not** appropriate for:

- Reference documentation
- Error messages (use "do not", not "don't", for clarity under stress)
- When emphasizing a negative ("**Do not** install X with Y" reads stronger than "Don't install X with Y")
- With a proper noun and a verb ("Terraform is..." not "Terraform's...")

When in doubt for technical reference docs, write the long form.

## Capitalization

- **Sentence case** for topic titles, navigation labels, button text in writing (unless the UI uses different casing)
- **Lowercase** for feature names by default
- **Match the UI text exactly** when referencing buttons, menus, page names — including its capitalization
- **Capitalize** third-party products (Kubernetes, Docker, Prometheus), methodologies (Continuous Integration, Continuous Deployment), and proper nouns

## Bold and backticks

One rule decides most cases: **bold** for things the reader sees in the UI; `backticks` for things the reader types or for literal identifiers.

- **Bold** for buttons, menu paths, field labels, tab names, and nav items: **Save**, **Settings** > **Credentials**, **Launchpad**.
- `Backticks` for commands, flags, file paths and names, environment variables, code references, and literal input values: `nextflow run`, `--profile`, `nextflow.config`, `NXF_HOME`.

Don't put UI text in backticks (`Save` button → **Save** button) or code in bold (**--profile** → `--profile`). For the product-specific decision tree and UI-name list, see `terminology.md`.

## Fake info

When showing example user data, URLs, or tokens:

- Use diverse but non-real names: Sidney Jones, Zhang Wei, Alex Garcia
- Use `example.com` for generic domains
- Use placeholder tokens like `<your_access_token>` rather than real-looking ones
- Do not use real user data or screenshots

## What to do when the original doc breaks a rule

This skill is for editing existing prose. The original draft will already contain rule violations. When you find one:

1. Apply the fix silently as part of the rewrite
2. Note the category of fix in the change summary (e.g., "Converted 6 instances of product-as-subject to direct second-person address")
3. If the fix changes the meaning in a way the user might want to review, flag it in the summary

## A note on local conventions

If you can see a project style guide in the same repo or directory (a `STYLE.md`, a `.vale.ini`, a CONTRIBUTING note), prefer those rules where they conflict with this skill. Mention any conflict you applied in the change summary.

---

### Attribution

The rules in this file draw heavily from the [GitLab Documentation Style Guide](https://docs.gitlab.com/development/documentation/styleguide/) and its [Recommended word list](https://docs.gitlab.com/development/documentation/styleguide/word_list/). Those are excellent references if you want to read the underlying source.
