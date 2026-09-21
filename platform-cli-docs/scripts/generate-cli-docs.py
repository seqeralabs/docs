#!/usr/bin/env python3
"""Generate deterministic CLI reference pages from resolved picocli metadata."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any, Iterable


PREFERRED_COMMAND_ORDER = [
    "info",
    "generate-completion",
    "credentials",
    "compute-envs",
    "datasets",
    "data-links",
    "labels",
    "secrets",
    "pipelines",
    "pipeline-schemas",
    "launch",
    "runs",
    "actions",
    "organizations",
    "workspaces",
    "teams",
    "members",
    "participants",
    "collaborators",
    "studios",
]


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        value = " ".join(str(item) for item in value)
    return re.sub(r"\s+", " ", str(value)).strip()


def prose_text(value: Any) -> str:
    return (
        clean_text(value)
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("{", "&#123;")
        .replace("}", "&#125;")
    )


def table_cell(value: Any) -> str:
    return prose_text(value).replace("\\", "\\\\").replace("|", "\\|")


def children(command: dict[str, Any]) -> list[dict[str, Any]]:
    values = command.get("children") or command.get("subcommands") or []
    return [value for value in values if isinstance(value, dict) and not value.get("hidden")]


def full_command(command: dict[str, Any], parent: str | None = None) -> str:
    explicit = command.get("full_command") or command.get("fullPath")
    if explicit:
        return clean_text(explicit)
    return f"{parent} {command['name']}" if parent else clean_text(command["name"])


def overlay_paths(command_path: str, overlays_dir: Path) -> Iterable[Path]:
    base = re.sub(r"\s+", "-", command_path.strip())
    yield overlays_dir / f"{base}.md"
    yield overlays_dir / f"{base}-examples.md"


def render_overlays(command_path: str, overlays_dir: Path) -> str:
    sections = []
    for overlay in overlay_paths(command_path, overlays_dir):
        if overlay.is_file():
            sections.append(overlay.read_text().strip())
    return "\n\n".join(section for section in sections if section)


def render_shared_links(overlays_dir: Path) -> str:
    shared_links = overlays_dir / "_links.md"
    return shared_links.read_text().strip() if shared_links.is_file() else ""


def syntax(command: dict[str, Any], command_path: str) -> str:
    parts = [command_path]
    if command.get("options"):
        parts.append("[OPTIONS]")
    for positional in command.get("positionals", []):
        label = clean_text(positional.get("param_label")) or "PARAM"
        label = label.strip("<>")
        parts.append(f"<{label}>" if positional.get("required") else f"[{label}]")
    return " ".join(parts)


def render_arguments(command: dict[str, Any], heading_level: int) -> str:
    positionals = [item for item in command.get("positionals", []) if not item.get("hidden")]
    if not positionals:
        return ""
    heading = "#" * min(heading_level, 6)
    lines = [
        f"{heading} Arguments",
        "",
        "| Argument | Description | Required |",
        "|----------|-------------|----------|",
    ]
    for positional in positionals:
        label = clean_text(positional.get("param_label")) or "PARAM"
        lines.append(
            f"| `{table_cell(label)}` | {table_cell(positional.get('description'))} | "
            f"{'Yes' if positional.get('required') else 'No'} |"
        )
    return "\n".join(lines)


def render_options(command: dict[str, Any], heading_level: int) -> str:
    options = [item for item in command.get("options", []) if not item.get("hidden")]
    if not options:
        return ""
    heading = "#" * min(heading_level, 6)
    lines = [
        f"{heading} Options",
        "",
        "| Option | Description | Required | Default |",
        "|--------|-------------|----------|---------|",
    ]
    for option in options:
        names = ", ".join(f"`{table_cell(name)}`" for name in option.get("names", []))
        default_value = option.get("default_value")
        default = f"`{table_cell(default_value)}`" if default_value not in (None, "", "null") else ""
        lines.append(
            f"| {names} | {table_cell(option.get('description'))} | "
            f"{'Yes' if option.get('required') else 'No'} | {default} |"
        )
    return "\n".join(lines)


def render_command_section(
    command: dict[str, Any],
    overlays_dir: Path,
    level: int,
    parent_path: str,
) -> str:
    command_path = full_command(command, parent_path)
    heading = "#" * min(level, 6)
    blocks = [f"{heading} `{command_path}`"]
    description = prose_text(command.get("description"))
    if description:
        blocks.append(description)
    blocks.append(f"```bash\n{syntax(command, command_path)}\n```")

    arguments = render_arguments(command, level + 1)
    if arguments:
        blocks.append(arguments)
    options = render_options(command, level + 1)
    if options:
        blocks.append(options)
    overlay = render_overlays(command_path, overlays_dir)
    if overlay:
        blocks.append(overlay)

    for child in children(command):
        blocks.append(render_command_section(child, overlays_dir, level + 1, command_path))
    return "\n\n".join(blocks)


def generate_command_page(command: dict[str, Any], overlays_dir: Path) -> str:
    command_path = full_command(command)
    raw_description = clean_text(command.get("description"))
    description = prose_text(raw_description)
    frontmatter_description = raw_description or f"Reference for {command_path}."
    blocks = [
        "---\n"
        f"title: {json.dumps(command_path)}\n"
        f"description: {json.dumps(frontmatter_description)}\n"
        "---",
        f"# `{command_path}`",
    ]
    if description:
        blocks.append(description)

    overlay = render_overlays(command_path, overlays_dir)
    if overlay:
        blocks.append(overlay)

    command_children = children(command)
    if command_children:
        for child in command_children:
            blocks.append(render_command_section(child, overlays_dir, 2, command_path))
    else:
        blocks.append(f"```bash\n{syntax(command, command_path)}\n```")
        arguments = render_arguments(command, 2)
        if arguments:
            blocks.append(arguments)
        options = render_options(command, 2)
        if options:
            blocks.append(options)
    shared_links = render_shared_links(overlays_dir)
    if shared_links:
        blocks.append(shared_links)
    return "\n\n".join(blocks).rstrip() + "\n"


def command_sort_key(command: dict[str, Any]) -> tuple[int, str]:
    name = command["name"]
    try:
        return (PREFERRED_COMMAND_ORDER.index(name), name)
    except ValueError:
        return (len(PREFERRED_COMMAND_ORDER), name)


def expected_overlay_names(command: dict[str, Any]) -> set[str]:
    command_path = full_command(command)
    base = re.sub(r"\s+", "-", command_path.strip())
    names = {f"{base}.md", f"{base}-examples.md"}
    for child in children(command):
        names.update(expected_overlay_names(child))
    return names


def validate_overlays(hierarchy: dict[str, Any], overlays_dir: Path) -> None:
    expected = expected_overlay_names(hierarchy) | {"README.md", "_links.md"}
    stale = sorted(path.name for path in overlays_dir.glob("*.md") if path.name not in expected)
    if stale:
        raise ValueError(
            "Overlay files do not match a visible command path; rename or remove them: " + ", ".join(stale)
        )


def render_sidebar(commands: list[dict[str, Any]]) -> str:
    items = "\n".join(
        f'        {{ type: "doc", id: "reference/{command["name"]}" }},'
        for command in sorted(commands, key=command_sort_key)
    )
    return f'''module.exports = {{
  clisidebar: [
    {{ type: "doc", id: "overview" }},
    {{ type: "doc", id: "installation" }},
    {{
      type: "category",
      label: "Command Reference",
      link: {{ type: "doc", id: "commands-reference" }},
      collapsed: false,
      items: [
{items}
      ],
    }},
  ],
}};
'''


def generate_all_docs(
    metadata_path: Path,
    overlays_dir: Path,
    output_dir: Path,
    sidebar_path: Path | None = None,
) -> list[Path]:
    data = json.loads(metadata_path.read_text())
    hierarchy = data.get("hierarchy") or data.get("tw")
    if not isinstance(hierarchy, dict):
        raise ValueError("Metadata has no command hierarchy")
    commands = children(hierarchy)
    if not commands:
        raise ValueError("Metadata command hierarchy has no visible children")
    validate_overlays(hierarchy, overlays_dir)

    names = [command.get("name") for command in commands]
    if any(not isinstance(name, str) or not name for name in names):
        raise ValueError("Every top-level command must have a non-empty name")
    if len(names) != len(set(names)):
        raise ValueError("Top-level command names must be unique")

    output_dir.mkdir(parents=True, exist_ok=True)
    generated = []
    expected_names = {f"{name}.md" for name in names}
    for stale_page in output_dir.glob("*.md"):
        if stale_page.name not in expected_names:
            stale_page.unlink()

    for command in commands:
        page_path = output_dir / f"{command['name']}.md"
        page_path.write_text(generate_command_page(command, overlays_dir))
        generated.append(page_path)
        print(f"Generated: {page_path}")

    if sidebar_path:
        sidebar_path.write_text(render_sidebar(commands))
        generated.append(sidebar_path)
        print(f"Generated: {sidebar_path}")
    print(f"Generated {len(commands)} command pages in {output_dir}")
    return generated


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--metadata", type=Path, required=True)
    parser.add_argument("--overlays", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--sidebar", type=Path)
    args = parser.parse_args()
    generate_all_docs(args.metadata, args.overlays, args.output, args.sidebar)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
