#!/usr/bin/env python3
"""Bump frontmatter `last updated:` to today on changed Markdown files.

Used by the `bump-last-updated` pre-commit / prek hook. Pre-commit passes
each changed `.md` / `.mdx` file path as a positional argument. For each:

- If frontmatter has `last updated:`, set its value to today (YYYY-MM-DD).
- If frontmatter has `date created:` but no `last updated:`, insert
  `last updated:` immediately after `date created:` with today's date.
- Files without a `date created:` field are skipped — they don't follow
  the convention this hook enforces.

Standard pre-commit fixer convention: exits non-zero if any file was
modified so pre-commit re-stages and re-runs. Exits zero on a no-op.
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


def process(path: Path) -> bool:
    """Bump `last updated:` to today. Return True if file was modified."""
    try:
        content = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return False

    m = FRONTMATTER_RE.match(content)
    if not m:
        return False
    fm = m.group(1)
    rest = content[m.end():]

    # Skip files that don't declare `date created:` — they're outside the
    # convention this hook owns (changelog entries, partials, etc.).
    if not any(DATE_CREATED_LINE_RE.match(line) for line in fm.splitlines()):
        return False

    if LAST_UPDATED_RE.search(fm):
        new_fm = LAST_UPDATED_RE.sub(rf'\1"{TODAY}"', fm, count=1)
    else:
        # Insert `last updated:` right after the `date created:` line.
        out = []
        inserted = False
        for line in fm.splitlines():
            out.append(line)
            if not inserted and DATE_CREATED_LINE_RE.match(line):
                out.append(f'last updated: "{TODAY}"')
                inserted = True
        new_fm = "\n".join(out) + "\n"

    if new_fm == fm:
        return False

    path.write_text(f"---\n{new_fm}---\n{rest}", encoding="utf-8")
    return True


def main(argv: list[str]) -> int:
    modified: list[str] = []
    for arg in argv:
        p = Path(arg)
        if not p.is_file() or p.suffix not in (".md", ".mdx"):
            continue
        if process(p):
            modified.append(str(p))

    if modified:
        print(f"Bumped `last updated:` to {TODAY} in:")
        for f in modified:
            print(f"  {f}")
        # Non-zero exit signals pre-commit to re-stage and re-run.
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
