#!/usr/bin/env python3
"""Check (or bump) frontmatter `last updated:` on changed Markdown files.

Two modes:

- **Check mode** (`--check`): used by the `bump-last-updated` pre-commit hook.
  Reads each file path passed in, reports any whose `last updated:` is not
  today (or that lack the field entirely), prints the exact command to fix,
  and exits 1. No files modified.
- **Fix mode** (default): rewrites the file in place. For each file:
    - If frontmatter has `last updated:`, set its value to today (YYYY-MM-DD).
    - If frontmatter has `date created:` but no `last updated:`, insert
      `last updated:` immediately after `date created:` with today's date.
  Files without `date created:` are skipped (changelog entries, partials).
  Exits non-zero if any file was modified, zero otherwise — per the standard
  pre-commit fixer convention.

Why two modes: hook runs in check mode so the contributor sees an explicit
failure with an invocable command (matches the `check-doc-tags` pattern in
this repo). The CI workflow runs the script directly in fix mode and commits
the bump back, so fork contributors and skipped local hooks still get a
correct `last updated:` on merge.
"""
from __future__ import annotations

import re
import sys
from datetime import date
from pathlib import Path

TODAY = date.today().strftime("%Y-%m-%d")

FRONTMATTER_RE = re.compile(r"^---[ \t]*\n(.*?\n)---[ \t]*\n", re.DOTALL)
LAST_UPDATED_RE = re.compile(r"^(last updated:\s*).*$", re.MULTILINE)
DATE_CREATED_LINE_RE = re.compile(r"^date created:\s*")


def compute_new_frontmatter(fm: str) -> str | None:
    """Return the new frontmatter body if a bump is needed, else None.

    Returns the same string the fixer would write so check mode and fix mode
    stay in lockstep — no chance of one saying "stale" while the other says
    "no-op".
    """
    if not any(DATE_CREATED_LINE_RE.match(line) for line in fm.splitlines()):
        return None  # file doesn't follow the convention; skip

    if LAST_UPDATED_RE.search(fm):
        new_fm = LAST_UPDATED_RE.sub(rf'\1"{TODAY}"', fm, count=1)
    else:
        # Insert `last updated:` right after the `date created:` line.
        out: list[str] = []
        inserted = False
        for line in fm.splitlines():
            out.append(line)
            if not inserted and DATE_CREATED_LINE_RE.match(line):
                out.append(f'last updated: "{TODAY}"')
                inserted = True
        new_fm = "\n".join(out) + "\n"

    return new_fm if new_fm != fm else None


def needs_bump(path: Path) -> bool:
    """True if `last updated:` is stale or missing on a file that has `date created:`."""
    try:
        content = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return False
    m = FRONTMATTER_RE.match(content)
    if not m:
        return False
    return compute_new_frontmatter(m.group(1)) is not None


def apply_bump(path: Path) -> bool:
    """Write the bump. Return True if file was modified."""
    try:
        content = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return False
    m = FRONTMATTER_RE.match(content)
    if not m:
        return False
    new_fm = compute_new_frontmatter(m.group(1))
    if new_fm is None:
        return False
    rest = content[m.end():]
    path.write_text(f"---\n{new_fm}---\n{rest}", encoding="utf-8")
    return True


def main(argv: list[str]) -> int:
    check_only = "--check" in argv
    paths = [
        Path(a) for a in argv
        if a != "--check" and Path(a).is_file() and Path(a).suffix in (".md", ".mdx")
    ]

    if check_only:
        stale = [p for p in paths if needs_bump(p)]
        if not stale:
            return 0
        print(f"ERROR: {len(stale)} file(s) have stale `last updated:` (expected {TODAY}):")
        for p in stale:
            print(f"  {p}")
        print()
        print("Fix locally by running:")
        print(f"  python3 .github/scripts/bump-last-updated.py {' '.join(str(p) for p in stale)}")
        print()
        print("Or comment `fix formatting` on your PR to let CI bump these for you.")
        return 1

    modified = [p for p in paths if apply_bump(p)]
    if not modified:
        return 0
    print(f"Bumped `last updated:` to {TODAY} in:")
    for p in modified:
        print(f"  {p}")
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
