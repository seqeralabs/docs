#!/usr/bin/env python3
"""
Compare two CLI metadata versions to identify changes.
Outputs markdown report for PR description.

Supports both metadata formats:
- Old: { "tw": {...} }
- New: { "metadata": {...}, "hierarchy": {...} }
"""

import json
import sys
from pathlib import Path


def get_hierarchy(data):
    """
    Extract hierarchy from metadata, supporting both old and new formats.

    Old format: { "tw": {...} }
    New format: { "metadata": {...}, "hierarchy": {...} }
    """
    if 'hierarchy' in data:
        return data['hierarchy']
    elif 'tw' in data:
        return data['tw']
    else:
        return {}


def count_commands(data, path='tw'):
    """
    Count total number of commands recursively.
    Supports both 'subcommands' (old) and 'children' (new) fields.
    """
    count = 1
    # Support both 'children' (new format) and 'subcommands' (old format)
    subcommands = data.get('children', []) or data.get('subcommands', [])
    # Filter out string entries (class names) if any
    subcommands = [s for s in subcommands if isinstance(s, dict)]

    for subcmd in subcommands:
        count += count_commands(subcmd, f"{path} {subcmd['name']}")
    return count


def get_all_commands(data, path='tw'):
    """
    Extract all commands with their full paths.
    Supports both 'subcommands' (old) and 'children' (new) fields.
    """
    commands = {path: data}
    # Support both 'children' (new format) and 'subcommands' (old format)
    subcommands = data.get('children', []) or data.get('subcommands', [])
    # Filter out string entries (class names) if any
    subcommands = [s for s in subcommands if isinstance(s, dict)]

    for subcmd in subcommands:
        commands.update(get_all_commands(subcmd, f"{path} {subcmd['name']}"))
    return commands


def compare_metadata(old_path, new_path):
    """Compare two metadata files and generate report."""

    with open(old_path) as f:
        old = json.load(f)
    with open(new_path) as f:
        new = json.load(f)

    report = []
    report.append("## CLI Documentation Changes\n\n")

    # Extract hierarchy from both formats
    old_hierarchy = get_hierarchy(old)
    new_hierarchy = get_hierarchy(new)

    # Add metadata version info if present
    if 'metadata' in new:
        metadata = new['metadata']
        if metadata.get('extractor_version'):
            report.append(f"**Metadata Version:** {metadata['extractor_version']}\n")
        if metadata.get('extracted_at'):
            report.append(f"**Extracted:** {metadata['extracted_at']}\n")
        report.append("\n")

    # Count changes
    old_count = count_commands(old_hierarchy)
    new_count = count_commands(new_hierarchy)

    report.append(f"**Commands:** {old_count} → {new_count} ({new_count - old_count:+d})\n\n")

    # Find new/removed commands
    old_cmds = get_all_commands(old_hierarchy)
    new_cmds = get_all_commands(new_hierarchy)

    new_command_paths = set(new_cmds.keys()) - set(old_cmds.keys())
    removed_command_paths = set(old_cmds.keys()) - set(new_cmds.keys())

    if new_command_paths:
        report.append("### New Commands\n\n")
        for cmd_path in sorted(new_command_paths):
            report.append(f"- `{cmd_path}`\n")
        report.append("\n")

    if removed_command_paths:
        report.append("### Removed Commands\n\n")
        for cmd_path in sorted(removed_command_paths):
            report.append(f"- `{cmd_path}`\n")
        report.append("\n")

    # Find changed options
    has_changes = False
    changes_section = ["### Changed Options\n\n"]

    for cmd_path in sorted(set(old_cmds.keys()) & set(new_cmds.keys())):
        old_cmd = old_cmds[cmd_path]
        new_cmd = new_cmds[cmd_path]

        old_opts = {tuple(opt['names']): opt for opt in old_cmd.get('options', [])}
        new_opts = {tuple(opt['names']): opt for opt in new_cmd.get('options', [])}

        added_opts = set(new_opts.keys()) - set(old_opts.keys())
        removed_opts = set(old_opts.keys()) - set(new_opts.keys())
        changed_opts = []

        for opt_names in set(old_opts.keys()) & set(new_opts.keys()):
            if old_opts[opt_names] != new_opts[opt_names]:
                changed_opts.append(opt_names)

        if added_opts or removed_opts or changed_opts:
            has_changes = True
            changes_section.append(f"**`{cmd_path}`**:\n")
            if added_opts:
                for names in sorted(added_opts):
                    changes_section.append(f"  - ➕ Added: `{', '.join(names)}`\n")
            if removed_opts:
                for names in sorted(removed_opts):
                    changes_section.append(f"  - ➖ Removed: `{', '.join(names)}`\n")
            if changed_opts:
                for names in sorted(changed_opts):
                    old_desc = old_opts[names].get('description', '')[:50]
                    new_desc = new_opts[names].get('description', '')[:50]
                    changes_section.append(f"  - 📝 Updated: `{', '.join(names)}` (description changed)\n")
            changes_section.append("\n")

    if has_changes:
        report.extend(changes_section)

    return ''.join(report)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: compare-metadata.py <old-metadata.json> <new-metadata.json>")
        sys.exit(1)

    report = compare_metadata(sys.argv[1], sys.argv[2])
    print(report)
