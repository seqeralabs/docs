#!/usr/bin/env python3
"""Compare resolved CLI metadata and write a review-oriented Markdown report."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def hierarchy(data: dict[str, Any]) -> dict[str, Any]:
    value = data.get("hierarchy") or data.get("tw")
    return value if isinstance(value, dict) else {}


def children(command: dict[str, Any]) -> list[dict[str, Any]]:
    values = command.get("children") or command.get("subcommands") or []
    return [value for value in values if isinstance(value, dict) and not value.get("hidden")]


def command_path(command: dict[str, Any], fallback: str) -> str:
    return command.get("full_command") or command.get("fullPath") or fallback


def all_commands(command: dict[str, Any], fallback: str = "tw") -> dict[str, dict[str, Any]]:
    path = command_path(command, fallback)
    result = {path: command}
    for child in children(command):
        result.update(all_commands(child, f"{path} {child.get('name', '')}".strip()))
    return result


def option_key(option: dict[str, Any]) -> tuple[str, ...]:
    return tuple(sorted(option.get("names") or []))


def option_summary(option: dict[str, Any]) -> tuple[Any, ...]:
    return (
        option.get("description") or "",
        bool(option.get("required")),
        option.get("default_value"),
        option.get("arity"),
        option.get("param_label"),
        option.get("type"),
    )


def positional_summary(command: dict[str, Any]) -> list[tuple[Any, ...]]:
    return [
        (
            item.get("index"),
            item.get("param_label"),
            item.get("description") or "",
            bool(item.get("required")),
            item.get("arity"),
            item.get("type"),
        )
        for item in command.get("positionals", [])
        if not item.get("hidden")
    ]


def describe_option_change(old: dict[str, Any], new: dict[str, Any]) -> str:
    fields = []
    if (old.get("description") or "") != (new.get("description") or ""):
        fields.append("description")
    if bool(old.get("required")) != bool(new.get("required")):
        fields.append("required status")
    if old.get("default_value") != new.get("default_value"):
        fields.append("default")
    if old.get("arity") != new.get("arity") or old.get("param_label") != new.get("param_label"):
        fields.append("value shape")
    if old.get("type") != new.get("type"):
        fields.append("type")
    return ", ".join(fields) or "metadata"


def compare(old: dict[str, Any] | None, new: dict[str, Any]) -> str:
    tag = new.get("metadata", {}).get("cli_version", "unknown release")
    new_commands = all_commands(hierarchy(new))
    lines = [
        f"## CLI documentation update for `{tag}`",
        "",
        "This draft PR was generated from the verified `tw-jar.jar` release asset. "
        "Raw metadata is attached to the workflow run and is not committed to the repository.",
        "",
    ]

    if old is None:
        lines.extend(
            [
                "### Baseline",
                "",
                f"- Captured {len(new_commands)} visible commands as the first docs-owned metadata baseline.",
                "- Review all generated reference pages and preserved overlays before merging.",
                "",
            ]
        )
    else:
        old_commands = all_commands(hierarchy(old))
        added = sorted(set(new_commands) - set(old_commands))
        removed = sorted(set(old_commands) - set(new_commands))
        changed_descriptions = []
        changed_positionals = []
        option_changes: list[str] = []

        for path in sorted(set(old_commands) & set(new_commands)):
            old_command = old_commands[path]
            new_command = new_commands[path]
            if (old_command.get("description") or "") != (new_command.get("description") or ""):
                changed_descriptions.append(path)
            if positional_summary(old_command) != positional_summary(new_command):
                changed_positionals.append(path)

            old_options = {option_key(item): item for item in old_command.get("options", [])}
            new_options = {option_key(item): item for item in new_command.get("options", [])}
            for names in sorted(set(new_options) - set(old_options)):
                option_changes.append(f"- `{path}`: added `{', '.join(names)}`")
            for names in sorted(set(old_options) - set(new_options)):
                option_changes.append(f"- `{path}`: removed `{', '.join(names)}`")
            for names in sorted(set(old_options) & set(new_options)):
                if option_summary(old_options[names]) != option_summary(new_options[names]):
                    details = describe_option_change(old_options[names], new_options[names])
                    option_changes.append(f"- `{path}`: changed `{', '.join(names)}` ({details})")

        lines.extend(
            [
                "### Resolved CLI changes",
                "",
                f"- Visible commands: {len(old_commands)} → {len(new_commands)}",
                f"- Added commands: {len(added)}",
                f"- Removed commands: {len(removed)}",
                f"- Commands with changed descriptions: {len(changed_descriptions)}",
                f"- Commands with changed positional arguments: {len(changed_positionals)}",
                f"- Added, removed, or changed options: {len(option_changes)}",
                "",
            ]
        )
        if added:
            lines.extend(["#### Added commands", "", *[f"- `{path}`" for path in added], ""])
        if removed:
            lines.extend(["#### Removed commands", "", *[f"- `{path}`" for path in removed], ""])
        if changed_descriptions:
            lines.extend(
                ["#### Changed command descriptions", "", *[f"- `{path}`" for path in changed_descriptions], ""]
            )
        if changed_positionals:
            lines.extend(
                ["#### Changed positional arguments", "", *[f"- `{path}`" for path in changed_positionals], ""]
            )
        if option_changes:
            lines.extend(["#### Option changes", "", *option_changes, ""])
        if not any((added, removed, changed_descriptions, changed_positionals, option_changes)):
            lines.extend(["No user-visible command-model changes were detected.", ""])

    lines.extend(
        [
            "### Required review",
            "",
            "- [ ] Confirm generated command and option changes against release notes and `tw ... --help`.",
            "- [ ] Update or remove overlays affected by renamed or removed commands.",
            "- [ ] Add conceptual guidance or examples for new behavior; do not infer unsupported examples.",
            "- [ ] Check the command index and sidebar placement for new top-level commands.",
            "- [ ] Build the Platform CLI docset and inspect the preview.",
            "",
            "Use `.claude/skills/review-cli-docs-release/SKILL.md` for the evidence and inference workflow.",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("new_metadata", type=Path)
    parser.add_argument("old_metadata", type=Path, nargs="?")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    new = json.loads(args.new_metadata.read_text())
    old = json.loads(args.old_metadata.read_text()) if args.old_metadata else None
    report = compare(old, new)
    if args.output:
        args.output.write_text(report)
    else:
        print(report, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
