#!/usr/bin/env python3
"""
Extract overlay content from existing commands.md documentation.

This script parses the current commands.md file and extracts:
- Examples with output
- Contextual explanations
- Admonitions (notes, tips)
- Cross-references
- "This command will:" sections

Outputs overlay files in the format expected by the generator.
"""

import re
from pathlib import Path
import argparse


def extract_command_sections(commands_md_path):
    """Parse commands.md and extract content by command."""

    with open(commands_md_path, 'r') as f:
        content = f.read()

    # Split by level 2 headings (## Command Groups)
    sections = {}
    current_section = None
    current_content = []

    lines = content.split('\n')
    i = 0

    while i < len(lines):
        line = lines[i]

        # Match ## heading (command group)
        if line.startswith('## ') and not line.startswith('###'):
            # Save previous section
            if current_section:
                sections[current_section] = '\n'.join(current_content)

            # Start new section
            current_section = line[3:].strip()
            current_content = [line]
        else:
            if current_section:
                current_content.append(line)

        i += 1

    # Save last section
    if current_section:
        sections[current_section] = '\n'.join(current_content)

    return sections


def normalize_command_name(section_name):
    """Convert section name to command name format."""
    # "Compute environments" -> "compute-envs"
    # "Launch pipelines" -> "launch"
    # "Labels and resource labels" -> "labels"

    name = section_name.lower()

    # Special cases
    mappings = {
        'compute environments': 'compute-envs',
        'launch pipelines': 'launch',
        'labels and resource labels': 'labels',
        'data-links': 'data-links',
    }

    for key, value in mappings.items():
        if name == key:
            return value

    # Default: replace spaces with hyphens
    return name.replace(' ', '-')


def extract_subsections(section_content):
    """Extract subsections (### operations) from a command section."""
    subsections = {}
    current_subsection = None
    current_content = []

    lines = section_content.split('\n')

    for line in lines:
        # Match ### heading (operation)
        if line.startswith('### '):
            # Save previous subsection
            if current_subsection:
                subsections[current_subsection] = '\n'.join(current_content)

            # Start new subsection
            current_subsection = line[4:].strip()
            current_content = []
        else:
            if current_subsection:
                current_content.append(line)

    # Save last subsection
    if current_subsection:
        subsections[current_subsection] = '\n'.join(current_content)

    return subsections


def extract_intro_content(section_content):
    """Extract introductory content before first ### heading."""
    lines = section_content.split('\n')
    intro = []

    for line in lines:
        if line.startswith('###'):
            break
        intro.append(line)

    return '\n'.join(intro).strip()


def clean_for_overlay(content):
    """Clean content for overlay format (remove heading, keep examples and context)."""
    lines = content.split('\n')
    cleaned = []

    skip_first_heading = True

    for line in lines:
        # Skip the first ### heading (operation name) since it's in the generated docs
        if skip_first_heading and line.startswith('### '):
            skip_first_heading = False
            continue

        cleaned.append(line)

    return '\n'.join(cleaned).strip()


def normalize_subsection_name(subsection_name):
    """Convert subsection name to command format."""
    # "Add credentials" -> "add"
    # "List Studio sessions" -> "list"
    # "Import and export a compute environment" -> "import-export"

    name = subsection_name.lower()

    # Remove common prefixes
    prefixes = ['add a ', 'add ', 'list ', 'view ', 'delete ', 'update ',
                'start ', 'stop ', 'download ', 'upload ']

    for prefix in prefixes:
        if name.startswith(prefix):
            # Extract the operation
            operation = prefix.strip()
            # Get what comes after
            remainder = name[len(prefix):].strip()

            # For "add a dataset" -> "add"
            # For "list studio sessions" -> "list"
            return operation.replace(' ', '-')

    # Special cases
    if 'import and export' in name or 'export and import' in name:
        return 'import-export'

    # Default: use first word
    first_word = name.split()[0] if name.split() else name
    return first_word.replace(' ', '-')


def create_overlay_files(sections, output_dir):
    """Create overlay files from extracted sections."""

    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    for section_name, section_content in sections.items():
        command_name = normalize_command_name(section_name)

        # Extract intro content for main command overlay
        intro = extract_intro_content(section_content)
        if intro and len(intro) > 50:  # Only create if substantial content
            intro_overlay_path = output_dir / f"tw-{command_name}.md"
            with open(intro_overlay_path, 'w') as f:
                # Remove the ## heading line
                intro_lines = intro.split('\n')[1:]  # Skip first line (## heading)
                f.write('\n'.join(intro_lines).strip() + '\n')
            print(f"Created main overlay: {intro_overlay_path}")

        # Extract subsections
        subsections = extract_subsections(section_content)

        for subsection_name, subsection_content in subsections.items():
            operation = normalize_subsection_name(subsection_name)

            # Clean content
            cleaned = clean_for_overlay(subsection_content)

            if cleaned and len(cleaned) > 50:  # Only create if substantial
                subsection_overlay_path = output_dir / f"tw-{command_name}-{operation}.md"
                with open(subsection_overlay_path, 'w') as f:
                    # Convert to overlay format (use ### for main sections in subcommand overlays)
                    # Replace #### with ### for consistency
                    overlay_content = cleaned.replace('\n#### ', '\n### ')
                    f.write(overlay_content + '\n')
                print(f"Created subsection overlay: {subsection_overlay_path}")


def main():
    parser = argparse.ArgumentParser(description='Extract overlays from commands.md')
    parser.add_argument('--input', required=True, help='Path to commands.md')
    parser.add_argument('--output', required=True, help='Output directory for overlays')

    args = parser.parse_args()

    print(f"Extracting overlays from {args.input}")

    # Extract sections
    sections = extract_command_sections(args.input)
    print(f"Found {len(sections)} command sections")

    # Create overlay files
    create_overlay_files(sections, args.output)

    print(f"\n✓ Overlays extracted to {args.output}")


if __name__ == '__main__':
    main()
