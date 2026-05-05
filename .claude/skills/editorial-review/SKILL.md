---
name: editorial-review
description: Run editorial review on documentation files. Use when reviewing markdown docs for voice, terminology, punctuation, or clarity. Triggers include "/review", "/editorial-review", "review docs", "editorial pass", "doc style check", or a PR comment of /editorial-review.
---

# Editorial review orchestrator

Coordinate specialized review agents to produce parser-ready findings on documentation files.

## How this skill is invoked

- **Local CLI:** `/review <path>` or `/editorial-review <path>`
- **GitHub PR comment:** `/editorial-review` on any PR (handled by `.github/workflows/docs-review.yml`)
- **Manual workflow dispatch:** Actions → Documentation Review → Run workflow

## What you do

For every invocation:

1. Identify scope — the files to review.
2. Pick agents — based on what changed.
3. Launch agents in parallel via the Task tool — each as a `subagent_type`.
4. Collate — concatenate, deduplicate, sort.
5. Emit — parser-format blocks only.

### Step 1: Scope

- **CI invocation:** review the file list passed in the prompt (these are the changed `*.md` / `*.mdx` files in the PR).
- **Local invocation:** review the path the user gave you. If a directory, glob for `**/*.md` and `**/*.mdx`. Exclude `changelog/**`, `node_modules/**`, `.github/**`.

### Step 2: Agent selection

| Scope                              | Agents to launch                                          |
|------------------------------------|-----------------------------------------------------------|
| Default (any scope)                | voice-tone, terminology                                   |
| `--profile=quick`                   | voice-tone, terminology                                   |
| `--profile=comprehensive`           | voice-tone, terminology, punctuation, clarity             |
| User named specific agents          | only the named agents (e.g., `--agents=punctuation`)      |
| User asked to "fix" issues          | run review agents first, then docs-fix on the findings    |

`punctuation`, `clarity`, and `docs-fix` are opt-in only. See `.claude/README.md` for canonical agent status. To change the default-run set, edit this table (and update `.claude/README.md` to match).

### Step 3: Parallel execution

In a single message, send one Task call per selected agent. Each agent receives:

- The file list (absolute paths).
- The shared anti-hallucination rules (below).
- The output contract (below).

### Step 4: Collation

- Concatenate all agent outputs.
- Deduplicate by `(FILE, LINE, SUGGESTION)` — exact string match.
- When two agents disagree on the same line, keep the suggestion from the higher-priority agent: **terminology > voice-tone > punctuation > clarity**.
- Sort by `FILE`, then `LINE` ascending.
- Drop any block missing `FILE`, `LINE`, or `SUGGESTION` — the parser silently ignores those, and emitting them wastes tokens.

### Step 5: Output contract

This is the **only** format `post-inline-suggestions.sh` accepts. Emit zero or more blocks, exactly:

```
FILE: path/relative/to/repo/root.md
LINE: 42
ISSUE: One-sentence problem statement
ORIGINAL: |
exact text from the file at this line
SUGGESTION: |
replacement text — must be a valid full-line replacement
---
```

Rules:

- One block per finding. A multi-line issue picks the most salient single line.
- `LINE` is the line number from the Read tool output, not a guess.
- `ORIGINAL` must be character-for-character what's in the file. The parser ignores it but it's how a human reviewer (and you, on second read) verify the finding is real.
- `SUGGESTION` is the full replacement line, not a fragment.
- Anything else you write — preamble, summary, agent labels — is discarded by the parser. Don't emit it.

### Step 6: Where to write

- **CI invocation:** write all blocks to `/tmp/editorial-review-suggestions.txt` using the Write tool. The workflow uploads this as an artifact and feeds it to `post-inline-suggestions.sh`.
- **Local invocation:** print all blocks to stdout in the chat reply.

## Shared anti-hallucination rules

The orchestrator and every agent must follow these. They're embedded into each agent's prompt at launch:

1. **Read first, then analyze.** Use the Read tool to view each file in full before flagging anything.
2. **Quote everything.** For every finding, copy the exact text from the file into `ORIGINAL`. If you can't quote it, the issue doesn't exist.
3. **Verify line numbers.** The `LINE` value must match the line number in the Read output.
4. **No training data.** Do not flag "common" or "typical" issues you'd expect to see — flag only what's in the file you read.
5. **High confidence only.** If you're not certain the finding is real and the suggestion is correct, drop it.

## CI gating (informational, not enforced by this skill)

The workflow applies a smart-gate before invoking this skill, but only for PRs classified as `content`:

- Skip if a review ran on the same PR less than 60 minutes ago.
- Skip if the diff is fewer than 10 lines.
- Skip if more than 5 markdownlint issues remain (the workflow asks the user to run `markdownlint-cli2` first).
- Cap inline suggestions at 60 per PR.

Vale runs as a separate sibling job before this skill — the terminology agent should defer Vale-handled rules to it.

Local invocations bypass all of this, by design.
