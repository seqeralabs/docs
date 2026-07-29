# Nextflow (exclusive rules)

Exclusive terminology and formatting rules for **Nextflow** docs, and for
Nextflow code and concepts referenced inside other products' docs. These layer
*on top of* the core references, including `../core/terminology.md`.

Core `../core/terminology.md` already covers the Nextflow **name** (not "NextFlow",
"next-flow", or lowercase "nextflow" in prose), nf-core (lowercase, hyphenated),
the pipeline-vs-workflow distinction, run vs task vs process, and the `NXF_*`
environment variables. Don't duplicate those here. The rules below are exclusive
to Nextflow. Don't invent DSL behavior or directive names — flag anything you
can't confirm (SKILL.md rule 8).

## DSL terms

Nextflow DSL keywords and concepts are code — write them in backticks, and use
the term precisely:

| Term       | Meaning                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| `workflow` | The `workflow { }` block that composes processes                        |
| `process`  | The `process { }` block that defines a task                             |
| channel    | The async data structure connecting processes (`Channel` factory in code) |
| operator   | A channel transformation (`map`, `collect`, `mix`, …)                   |
| executor   | The backend that runs tasks (local, SLURM, AWS Batch, …)                |
| directive  | A process setting (`cpus`, `memory`, `container`, …)                    |

- ✅ "The `workflow` block wires processes together with channels."
- ❌ "The pipeline block wires the pipeline steps together." (imprecise; "pipeline" is a Seqera Platform term — see `../core/terminology.md`)

## Config and command-line conventions

- `nextflow.config` — the pipeline configuration file (in backticks).
- Config scopes are code: `process`, `params`, `docker`, `aws`, `tower`, and so on.
- **Single vs double dash:** Nextflow core options take a single dash (`-resume`,
  `-profile`, `-c`); pipeline parameters take two (`--input`, `--outdir`). Preserve
  the exact dash count — it is a common and consequential error.
- `params.<name>` in code corresponds to `--<name>` on the command line.
