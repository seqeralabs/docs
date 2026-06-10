#!/usr/bin/env python3
"""Validate documentation frontmatter `tags:` against an allowlist.

Used by the `check-doc-tags` pre-commit / prek hook. Reads the canonical
allowlist from `.github/doc-tags-allowed.txt` and fails if any changed
Markdown file declares a tag that is not on the list.

When a disallowed tag matches a known variant (see
`.github/scripts/doc-tags-aliases.json`) or differs only by case/spacing
from an allowed tag, the error suggests the canonical form.

Exit codes:
  0  all tags allowed
  1  one or more disallowed tags found
  2  configuration/usage error
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
ALLOWLIST = REPO_ROOT / ".github" / "doc-tags-allowed.txt"
ALIASES = REPO_ROOT / ".github" / "scripts" / "doc-tags-aliases.json"


def load_allowlist() -> set[str]:
    if not ALLOWLIST.exists():
        sys.stderr.write(f"error: allowlist not found: {ALLOWLIST}\n")
        sys.exit(2)
    tags = set()
    for line in ALLOWLIST.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            tags.add(line)
    return tags


def load_aliases() -> dict[str, str]:
    if ALIASES.exists():
        try:
            return json.loads(ALIASES.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}
    return {}


def parse_frontmatter(text: str) -> str | None:
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    return text[3:end] if end != -1 else None


def extract_tags(fm: str) -> list[str]:
    m = re.search(r"^tags:\s*(.*)$", fm, re.M)
    if not m:
        return []
    inline = m.group(1).strip()
    vals: list[str] = []
    if inline.startswith("["):
        flow = inline
        if not inline.endswith("]"):
            idx = fm.find("]", m.end())
            flow = fm[m.start(1):idx + 1] if idx != -1 else inline
        flow = flow.strip().lstrip("[").rstrip("]")
        vals = [v.strip().strip("\"'") for v in flow.split(",") if v.strip()]
    elif inline == "":
        for ln in fm[m.end():].split("\n"):
            sm = re.match(r"^\s*-\s+(.*)$", ln)
            if sm:
                vals.append(sm.group(1).strip().strip("\"'"))
            elif ln.strip() == "":
                continue
            else:
                break
    else:
        vals = [inline.strip("\"'")]
    return [v for v in vals if v]


def normkey(t: str) -> str:
    return re.sub(r"[-\s]+", " ", t.strip().lower())


def suggest(tag: str, allowed: set[str], aliases: dict[str, str]) -> str | None:
    if tag in aliases:
        return aliases[tag]
    key = normkey(tag)
    norm_map = {normkey(a): a for a in allowed}
    return norm_map.get(key)


def main(argv: list[str]) -> int:
    files = [Path(a) for a in argv]
    if not files:
        return 0

    allowed = load_allowlist()
    aliases = load_aliases()

    failed = False
    for path in files:
        if path.suffix not in (".md", ".mdx"):
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        fm = parse_frontmatter(text)
        if not fm:
            continue
        for tag in extract_tags(fm):
            if tag in allowed:
                continue
            hint = suggest(tag, allowed, aliases)
            failed = True
            msg = f"{path}: disallowed tag {tag!r}"
            if hint:
                msg += f" -> did you mean {hint!r}?"
            else:
                msg += " (not in .github/doc-tags-allowed.txt)"
            print(msg)

    if failed:
        print()
        print("Fix the tags above, or add a new canonical tag to "
              ".github/doc-tags-allowed.txt if it is genuinely new.")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
