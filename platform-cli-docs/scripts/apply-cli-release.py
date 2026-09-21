#!/usr/bin/env python3
"""Record the documented CLI release and update idempotent version notices."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


START = "<!-- cli-release-version:start -->"
END = "<!-- cli-release-version:end -->"


def notice(tag_name: str) -> str:
    version = tag_name.removeprefix("v")
    return (
        f"{START}\n"
        ":::info CLI version\n"
        f"This reference documents Seqera Platform CLI **{version}**, the latest stable release processed by the docs automation.\n"
        "::: \n"
        f"{END}"
    ).replace("::: \n", ":::\n")


def update_notice(path: Path, tag_name: str) -> None:
    content = path.read_text()
    replacement = notice(tag_name)
    marker_pattern = re.compile(re.escape(START) + r".*?" + re.escape(END), re.DOTALL)
    if marker_pattern.search(content):
        updated = marker_pattern.sub(replacement, content, count=1)
    else:
        frontmatter = re.match(r"\A---\n.*?\n---\n", content, re.DOTALL)
        if not frontmatter:
            raise ValueError(f"Expected YAML frontmatter in {path}")
        index = frontmatter.end()
        updated = content[:index] + "\n" + replacement + "\n" + content[index:]
    path.write_text(updated)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--release-record", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--notice-file", type=Path, action="append", default=[])
    args = parser.parse_args()

    release = json.loads(args.release_record.read_text())
    tag_name = release.get("tag_name")
    if not tag_name:
        raise ValueError("Release record has no tag_name")
    args.manifest.write_text(json.dumps(release, indent=2) + "\n")
    for path in args.notice_file:
        update_notice(path, tag_name)
        print(f"Updated release notice: {path}")
    print(f"Recorded documented release: {tag_name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
