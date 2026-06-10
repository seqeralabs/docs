---
name: editorial-review
description: Run editorial review on documentation files using specialized agents (voice-tone, terminology, punctuation, clarity). Use when you need to review documentation for style, consistency, tone, or formatting issues. Triggers include requests to review docs, check editorial quality, or run style checks on markdown files.
---

# Editorial review orchestrator

## Purpose

Coordinate specialized SME agents to produce inline GitHub suggestions on the `.md` and `.mdx` files in scope.

## Where this runs

- **CI:** `.github/workflows/docs-review.yml` invokes this skill on a `/editorial-review` PR comment or manual workflow dispatch.
- **Locally:** Run `/editorial-review <file-or-directory>` in Claude Code.

The output format is identical in both modes (see [Output contract](#output-contract)).

## Inputs

- A list of `.md`/`.mdx` files to review (from the workflow, or expanded from a directory locally).
- Optional review type: `all` (default), `voice-tone`, `terminology`, `clarity`. When CI passes a review type, run only that agent.

## Agents

| Agent | What it checks | Invoked by default? |
|---|---|---|
| [voice-tone](../../agents/voice-tone.md) | Second person, active voice, present tense, hedging | Yes |
| [terminology](../../agents/terminology.md) | Product names, feature names, UI formatting, context-dependent terms | Yes |
| [punctuation](../../agents/punctuation.md) | Oxford commas, list punctuation, quotation marks, dashes | No — opt in via review type |
| [clarity](../../agents/clarity.md) | Sentence length, jargon, prerequisites | No — opt in via review type |
| [docs-fix](../../agents/docs-fix.md) | Applies corrections | No — only on explicit `/fix-docs` |

Vale (`.github/workflows/vale.yml`) runs in parallel on every PR push and handles the simple terminology substitutions defined in `.github/styles/Seqera/*.yml`. The terminology agent focuses on context-dependent calls Vale can't make.

## Process

1. **Resolve scope.** Use the file list you were given; if a directory, expand to `*.md` and `*.mdx`. Skip files under `changelog/`, `node_modules/`, `.github/`, and `platform-enterprise_versioned_docs/` (frozen snapshots).
2. **Spawn the selected agents in parallel** using the `Task` tool — one agent per task call, each given the full file list. Wait for all to complete before proceeding.
3. **Collate findings.** Each agent returns findings keyed by file + line. Deduplicate where two agents flag the same line (prefer the more specific finding — usually terminology over voice-tone).
4. **Write findings to a single file** in the [Output contract](#output-contract) format. In CI, this path is `/tmp/editorial-review-suggestions.txt`. Locally, print to stdout.

## Output contract

Each finding is a 6-line block separated by `---`:

```
FILE: path/to/file.md
LINE: 42
ISSUE: Brief description of the problem
ORIGINAL: |
exact original text from the file
SUGGESTION: |
corrected text
---
```

Rules:

- `FILE:` is a path relative to the repo root.
- `LINE:` is the 1-based line number where the issue starts. Must exist in the file.
- `ORIGINAL:` must match the file's content verbatim (whitespace and case included). If the issue spans multiple lines, include all of them under the literal `|` block.
- `SUGGESTION:` is the corrected text, preserving the original's structure (line count, indentation, surrounding punctuation).
- One block per issue. Do not group multiple issues per block.
- No prose before the first `FILE:` or after the last `---`. The workflow's `post-inline-suggestions.sh` parses this format and posts each block as an inline GitHub suggestion.

## Coordination with Vale

- Don't re-flag the substitutions Vale already enforces (the LHS of each `swap:` entry in `.github/styles/Seqera/*.yml`). Vale runs in `.github/workflows/vale.yml` on every PR push.
- Do flag context-dependent terminology, capitalization, and formatting that Vale's simple substitutions miss.
- Some overlap is acceptable — duplicate findings are deduplicated downstream by the consolidated-review step in `docs-review.yml`.

## Limits

- Cap output at 60 findings per run. The workflow truncates beyond this and surfaces a "showing first 60" message with a link to the full artifact.
- If a file is over 1,000 lines, consider sampling rather than reviewing every line.
