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
5. **Verify** — drop any block whose `ORIGINAL` doesn't match the file at `LINE`.
6. Emit — parser-format blocks only.
7. Output — write to artifact (CI) or print and offer to apply (local).

### Step 1: Scope

- **CI invocation:** review the file list passed in the prompt (these are the changed `*.md` / `*.mdx` files in the PR).
- **Local invocation:** review the path the user gave you. If a directory, glob for `**/*.md` and `**/*.mdx`. Exclude `changelog/**`, `node_modules/**`, `.github/**`.

### Step 2: Agent selection

| Scope                              | Agents to launch                                          |
|------------------------------------|-----------------------------------------------------------|
| Default (any scope)                | voice-tone, terminology                                   |
| `--profile=quick`                  | voice-tone, terminology                                   |
| `--profile=comprehensive`          | voice-tone, terminology, clarity                          |
| User named specific agents         | only the named agents (e.g., `--agents=clarity`)          |
| User asked to "fix" issues         | run review agents first, then docs-fix on the findings    |

`clarity` and `docs-fix` are opt-in only. See `.claude/README.md` for canonical agent status. To change the default-run set, edit this table (and update `.claude/README.md` to match).

Punctuation is now handled by Vale rules in `.github/styles/Seqera/` (Dashes, OxfordComma, Quotes, HeadingColons). The `punctuation` agent has been retired.

### Step 3: Parallel execution

> **Runtime workaround.** Named subagents (`voice-tone`, `terminology`, `clarity`, `docs-fix`) currently do not get tool access at runtime in Claude Code, even when their frontmatter declares `tools: Read, Grep, Glob`. They confabulate findings without ever reading the file. Until the upstream bug is fixed, the orchestrator **must not** spawn them directly. Instead, route through `general-purpose`, which has working tool access.

In a single message, send one Task call per selected agent. For each:

1. Read the agent's `.md` file from `.claude/agents/<agent-name>.md` (skip the YAML frontmatter; load the body).
2. Spawn `subagent_type: "general-purpose"` with a Task prompt that contains, in order:
   - The agent's system prompt (the body of its `.md` file).
   - The file list (absolute paths).
   - The shared anti-hallucination rules (below).
   - The output contract (below).
   - An explicit reminder to emit a `READ-PROOF` block (3 verbatim line excerpts from the Read output) before any findings — Step 5 drops every finding from agents that omit this.

Do **not** call `subagent_type: "voice-tone"` (or terminology / clarity / docs-fix) until the named-subagent tool wiring is fixed in Claude Code. Verify by checking the agent's `tool_uses` count — if it returns 0 from a Read-only diagnostic prompt, the runtime is still broken.

### Step 4: Collation

- Concatenate all agent outputs.
- **Exact dedup.** Drop blocks where `(FILE, LINE, SUGGESTION)` is identical to another block.
- **Same-line, different SUGGESTIONs — try to merge first.** When two agents emit different SUGGESTIONs for the same `FILE:LINE`:
  1. Compare each agent's `SUGGESTION` against `ORIGINAL` to identify what each changed. If the two agents touched **non-overlapping spans** of the line — for example, voice-tone changed `"Users can"` mid-sentence and terminology changed `"Platform"` earlier in the same sentence — produce **one merged block** that applies both edits. Use the higher-priority agent's `ISSUE` (or combine: `"<terminology issue> + <voice-tone issue>"`).
  2. If the agents touched **overlapping spans** — both want to rewrite the same words differently — fall back to priority and keep only the higher-priority agent's block: **terminology > voice-tone > clarity**. Drop the lower-priority block.
- Sort by `FILE`, then `LINE` ascending.
- Drop any block missing `FILE`, `LINE`, or `SUGGESTION` — the parser silently ignores those, and emitting them wastes tokens.

> **Why merge instead of always picking the higher-priority agent?** GitHub inline suggestions are full-line replacements — the user can only apply one per line. If terminology rewrites a line to fix "Platform" → "Seqera Platform" but leaves "Users can" untouched, applying that suggestion silently discards voice-tone's third-person fix. Merging is the only way to deliver both fixes when they don't conflict.

### Step 5: Verification (mandatory)

Agents sometimes hallucinate file contents — they emit findings with `LINE` and `ORIGINAL` values that don't exist in the file. This step catches that.

For each candidate block, run two checks:

1. **READ-PROOF check.** Each agent's reply must contain a `READ-PROOF` block. Verify the three quoted lines against the file (use the Read tool). If any of the three doesn't match verbatim, **drop every block that agent emitted** — the agent didn't read the file.
2. **ORIGINAL check.** For each surviving block, verify that the file at `LINE` contains the `ORIGINAL` text verbatim. Use the Read tool on a small range (e.g., `Read offset=LINE-1 limit=3`) and compare. If the text doesn't match, drop the block.

Both checks are non-negotiable. A block that fails either check is a hallucination, regardless of how plausible it sounds.

After verification, log a one-line summary: `Verified N of M candidate blocks (dropped X agent-failures, Y line-mismatches)`. Include this above the emit output for local invocations; in CI mode, write it to the workflow log via stdout.

### Step 6: Output contract

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

### Step 7: Output

#### CI invocation

Write all verified blocks to `/tmp/editorial-review-suggestions.txt` using the Write tool. The workflow uploads this as an artifact and feeds it to `post-inline-suggestions.sh`, which posts each block as a GitHub inline review suggestion on the affected line. The user gets one-click "Commit suggestion" buttons in the PR review.

#### Local invocation

Chat doesn't render inline suggestions on top of files, so reproduce that experience using the Edit tool. After printing the verified blocks to stdout, ask the user:

> Apply these N fixes via Edit? (yes / no / pick)

- **yes** — Walk through the blocks one at a time, gating each at the chat level (see below).
- **no** — Stop. The user applies manually.
- **pick** — Prompt for block numbers (1-based, e.g. `1,3-5`). Apply only the selected blocks via the same per-fix gate.

##### Per-fix gate (mandatory)

Do **not** call Edit in a batch. Claude Code may be running in `acceptEdits` permission mode, in which case Edit calls auto-apply with no user prompt — silently bypassing the approve/reject gate. Drive the gate from chat instead, one block at a time:

1. Print a compact diff for block N: file path with line link, ISSUE, then a before/after of just the changed words (not the full line — keep it scannable).
2. Ask: `Apply this fix? (y / n / q)`
3. On `y`, call Edit with `old_string=<ORIGINAL>` and `new_string=<SUGGESTION>`.
4. On `n`, skip and move to block N+1.
5. On `q`, stop the apply pass — leave the remaining blocks unapplied.

After all blocks, report: `Applied N of M (X declined, Y stopped early, Z non-unique match)`.

Edge cases:

- If `ORIGINAL` appears more than once in the file, Edit fails with a non-unique-match error. Catch it, report `skipped (non-unique match): <line N>`, and continue. The block will need manual handling.
- If `ORIGINAL` no longer matches (file changed since review), report `skipped (no longer present): <line N>`. Don't try to recover — re-run the review.
- Don't use `replace_all`. The contract is one-line one-fix; replacing all occurrences risks editing unrelated lines.

## Shared anti-hallucination rules

The orchestrator and every agent must follow these. They're embedded into each agent's prompt at launch:

1. **Read first, then analyze.** Use the Read tool to view each file in full before flagging anything.
2. **Prove you read.** Emit a `READ-PROOF` block (3 verbatim line excerpts from your Read output) at the top of your reply, before any findings. The orchestrator drops every finding from agents that omit it.
3. **Quote everything.** For every finding, copy the exact text from the file into `ORIGINAL`. If you can't quote it, the issue doesn't exist.
4. **Verify line numbers.** The `LINE` value must match the line number in the Read output.
5. **No training data.** Do not flag "common" or "typical" issues you'd expect to see — flag only what's in the file you read.
6. **High confidence only.** If you're not certain the finding is real and the suggestion is correct, drop it.

## CI gating (informational, not enforced by this skill)

The workflow applies a smart-gate before invoking this skill, but only for PRs classified as `content`:

- Skip if a review ran on the same PR less than 60 minutes ago.
- Skip if the diff is fewer than 10 lines.
- Skip if more than 5 markdownlint issues remain (the workflow asks the user to run `markdownlint-cli2` first).
- Cap inline suggestions at 60 per PR.

Vale runs as a separate sibling job before this skill — the terminology agent should defer Vale-handled rules to it.

Local invocations bypass all of this, by design.
