#!/usr/bin/env python3
"""
Generate CLI reference documentation from metadata JSON.

Similar to OpenAPI overlay pattern:
1. Parse cli-metadata.json
2. Generate base markdown from metadata
3. Merge with manual overlays
4. Output final documentation
"""

import json
from pathlib import Path
import argparse


def generate_subcommand_section(command_data, overlays_dir, level=2):
    """Generate markdown section for a subcommand."""

    full_path = command_data.get('fullPath', command_data['name'])
    description = command_data.get('description', '')

    # Section heading (## for subcommands)
    heading = '#' * level
    md = f"\n{heading} `{full_path}`\n\n"
    md += f"{description}\n\n"

    # Synopsis
    md += f"### Synopsis\n\n"
    md += f"```bash\n{full_path} [OPTIONS]\n```\n"

    # Add options table
    if command_data.get('options'):
        md += "\n### Options\n\n"
        md += "| Option | Description | Required | Default |\n"
        md += "|--------|-------------|----------|----------|\n"

        for opt in command_data['options']:
            names = ', '.join([f"`{n}`" for n in opt['names']])
            desc = opt.get('description', '').replace('|', '\\|')
            required = '✓' if opt.get('required') else ''
            default = f"`{opt['defaultValue']}`" if opt.get('defaultValue') else ''
            md += f"| {names} | {desc} | {required} | {default} |\n"

    # Check for subcommand-specific overlay
    overlay_file = overlays_dir / f"{full_path.replace(' ', '-')}-examples.md"
    if overlay_file.exists():
        md += "\n" + overlay_file.read_text() + "\n"

    return md


def generate_command_page(command_data, overlays_dir):
    """Generate markdown page for a main command with all its subcommands."""

    name = command_data['name']
    full_path = command_data.get('fullPath', name)
    description = command_data.get('description', '')

    # Base template with frontmatter
    md = f"""---
title: {full_path}
description: {description}
---

# `{full_path}`

{description}
"""

    # Check for command-level overlay (goes after description, before subcommands)
    main_overlay_file = overlays_dir / f"{full_path.replace(' ', '-')}.md"
    if main_overlay_file.exists():
        md += "\n" + main_overlay_file.read_text() + "\n"

    # Process subcommands
    if command_data.get('subcommands'):
        for subcmd in command_data['subcommands']:
            # Set fullPath for subcommand
            subcmd['fullPath'] = f"{full_path} {subcmd['name']}"
            md += generate_subcommand_section(subcmd, overlays_dir, level=2)

            # Process nested subcommands if any
            if subcmd.get('subcommands'):
                for nested_subcmd in subcmd['subcommands']:
                    nested_subcmd['fullPath'] = f"{subcmd['fullPath']} {nested_subcmd['name']}"
                    md += generate_subcommand_section(nested_subcmd, overlays_dir, level=3)
    else:
        # Main command has no subcommands, treat it as standalone
        md += "\n## Synopsis\n\n"
        md += f"```bash\n{full_path} [OPTIONS]\n```\n"

        if command_data.get('options'):
            md += "\n## Options\n\n"
            md += "| Option | Description | Required | Default |\n"
            md += "|--------|-------------|----------|----------|\n"

            for opt in command_data['options']:
                names = ', '.join([f"`{n}`" for n in opt['names']])
                desc = opt.get('description', '').replace('|', '\\|')
                required = '✓' if opt.get('required') else ''
                default = f"`{opt['defaultValue']}`" if opt.get('defaultValue') else ''
                md += f"| {names} | {desc} | {required} | {default} |\n"

    return md


def generate_all_docs(metadata_path, overlays_dir, output_dir):
    """Generate documentation for all commands - one file per main command."""

    with open(metadata_path) as f:
        metadata = json.load(f)

    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Process only top-level commands (one file per main command)
    root = metadata.get('tw', {})
    for main_cmd in root.get('subcommands', []):
        # Set full path for main command
        main_cmd['fullPath'] = f"tw {main_cmd['name']}"

        # Generate single page with all subcommands
        page_name = main_cmd['name']
        page_path = output_dir / f"{page_name}.md"

        content = generate_command_page(main_cmd, overlays_dir)
        page_path.write_text(content)

        print(f"Generated: {page_path}")

    print(f"\n✓ Generated documentation in {output_dir}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate CLI docs from metadata')
    parser.add_argument('--metadata', required=True, help='Path to cli-metadata.json')
    parser.add_argument('--overlays', required=True, help='Directory with manual overlays')
    parser.add_argument('--output', required=True, help='Output directory')

    args = parser.parse_args()

    generate_all_docs(
        Path(args.metadata),
        Path(args.overlays),
        Path(args.output)
    )
