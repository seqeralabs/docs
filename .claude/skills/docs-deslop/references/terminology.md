# Seqera Platform terminology and formatting

The house terminology and formatting rules for Seqera Platform documentation — the product-specific calls that the general rules in `style-guide.md` and automated linters (such as Vale) don't make for you.

This file is specific to Seqera Platform. Apply it whenever the docs are about Seqera Platform, the `tw` CLI, or the surrounding tools (Nextflow, Wave, Fusion, Studios, MultiQC). Don't invent UI text or product behavior — if you can't confirm a term, flag it rather than guess (see SKILL.md rule 8).

## Product and tool names

Spell and capitalize these exactly in prose:

| Name                                                 | Notes                                                                                  |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Seqera Platform                                      | The product. Use the full name on first or primary reference. Never "Tower" in current docs. |
| Seqera Platform Cloud / Seqera Platform Enterprise   | The two editions. Name the edition when behavior differs between them.                 |
| Nextflow                                             | The workflow language and engine. Not "NextFlow", "next-flow", or "nextflow" in prose. |
| Wave                                                 | The container provisioning service.                                                    |
| Fusion                                               | The Fusion file system.                                                                |
| Studios                                              | Interactive analysis environments (formerly Data Studios).                             |
| MultiQC                                              | Not "multi-qc" or "multiQC".                                                           |
| nf-core                                              | The community pipeline collection. Always lowercase and hyphenated.                    |
| Seqera Containers                                    | The container service.                                                                 |
| `tw`                                                 | The Seqera Platform CLI. Lowercase, in backticks. Introduce as "the Seqera Platform CLI (`tw`)". |
| TowerForge                                           | Legacy product name — keep as-is where it appears.                                     |

"Tower" is acceptable only in legacy docs (before v23.1), historical references ("formerly Tower"), or the `TowerForge` name. Everywhere else, use Seqera Platform.

Replacements to apply:

| Avoid                               | Use                 |
| ----------------------------------- | ------------------- |
| Tower (in current docs)             | Seqera Platform     |
| the platform (meaning the product)  | Seqera Platform     |
| NextFlow, nextFlow, next-flow       | Nextflow            |
| multi-qc, multiQC                   | MultiQC             |
| compute env, CE (in prose)          | compute environment |
| creds                               | credentials         |

## Feature and entity names: lowercase

Seqera Platform's own concepts are common nouns. Lowercase them in prose — capitalize only at the start of a sentence or when matching a literal UI label:

- organization, workspace, team, participant, collaborator
- pipeline, run, task, launch
- compute environment, credentials, secret, pipeline secret
- access token, personal access token (PAT)
- dataset, data link, label

- ✅ "Add the credentials to your workspace, then create a compute environment."
- ❌ "Add the Credentials to your Workspace, then create a Compute Environment."

The exception is a literal UI label — match the product exactly (see UI element names).

## Pipeline vs workflow

These are not synonyms in this product.

| Use      | When                                                          |
| -------- | ------------------------------------------------------------- |
| pipeline | A Seqera Platform feature — a runnable item on the Launchpad  |
| workflow | The Nextflow DSL `workflow { }` block, or Nextflow code       |

- ✅ "The pipeline failed to launch." (Platform)
- ✅ "The `workflow` block contains the main logic." (Nextflow code)
- ❌ "The workflow failed to launch." (when you mean a Platform pipeline)

## Run vs task vs process

| Use     | When                                                              |
| ------- | ----------------------------------------------------------------- |
| run     | A single Seqera Platform pipeline execution                       |
| task    | One unit of work within a run (matches the Nextflow concept)      |
| process | Only the Nextflow DSL `process { }` block                         |

Avoid "execution" or "job" for a run unless the UI uses that word.

## Bold vs backticks

One decision: **is it something the reader sees in the Seqera Platform UI, or something they type / a literal identifier?**

- **Bold** for UI elements the reader sees and acts on:
  - Buttons: **Launch**, **Save**, **Add**
  - Menu paths: **Settings** > **Credentials**
  - Field labels, tab names, nav items: **Launchpad**, **Runs**, **Compute Envs**
- `Backticks` for code and literal identifiers:
  - Commands: `tw launch`, `nextflow run`
  - Flags and parameters: `--profile`, `--compute-env`
  - File paths and names: `nextflow.config`
  - Environment variables: `TOWER_ACCESS_TOKEN`, `NXF_HOME`
  - Code references: `workflow`, `process`
  - Literal user-input values: `my-workspace-name`

Common errors to fix:

| Wrong                       | Right                          |
| --------------------------- | ------------------------------ |
| `Launch` button             | **Launch** button              |
| **--profile** flag          | `--profile` flag               |
| nextflow.config             | `nextflow.config`              |
| `Settings > Credentials`    | **Settings** > **Credentials** |
| **TOWER_ACCESS_TOKEN**      | `TOWER_ACCESS_TOKEN`           |

## UI element names

Match the product's exact text and capitalization. Common ones:

| Correct           | Not                                       |
| ----------------- | ----------------------------------------- |
| **Launchpad**     | Launch Pad, launchpad                     |
| **Data Explorer** | data explorer, Data explorer              |
| **Compute Envs**  | Compute Environments (as the tab label), compute envs |
| **Runs**          | Executions, runs                          |
| **Actions**       | Action                                    |

`compute environment` is the term to use in prose; `Compute Envs` is the literal nav-tab label — match the UI when you reference the tab, use the full term otherwise. If you can't confirm the exact UI text, flag it for review.

## Environment variables

The `tw` CLI and Nextflow read configuration from environment variables. Write them in backticks, uppercase as defined:

- `TOWER_ACCESS_TOKEN` — authenticates the `tw` CLI and API calls.
- `TOWER_API_ENDPOINT` — the Platform API URL (set this for Enterprise).
- `TOWER_WORKSPACE_ID` — the target workspace for CLI commands.
- `NXF_*` — Nextflow settings, for example `NXF_HOME`.

## Abbreviations

Spell out on first use per page, then use the abbreviation:

- high-performance computing (HPC), Google Cloud Platform (GCP), personal access token (PAT), compute environment (CE).
- Don't expand universally known ones: API, CLI, AWS.

---

### Attribution

These rules are adapted from the Seqera documentation review agents (`terminology` SME and `review-config.yaml`) in the [seqeralabs/docs](https://github.com/seqeralabs/docs/tree/master/.claude/agents) repository.
