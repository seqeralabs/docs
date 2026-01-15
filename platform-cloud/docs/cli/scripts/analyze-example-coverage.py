#!/usr/bin/env python3
"""
Analyze CLI documentation example coverage.

Identifies which commands in reference docs have examples (overlay with bash code block)
and which commands don't have examples yet.
"""

import argparse
import json
import re
from pathlib import Path
from typing import Dict, List, Set


def has_bash_code_block(content: str) -> bool:
    """Check if markdown content has a bash code block."""
    return "```bash" in content


def command_to_overlay_filename(command: str) -> str:
    """
    Convert command to expected overlay filename.

    Examples:
        tw credentials add -> tw-credentials-add.md
        tw compute-envs add -> tw-compute-envs-add.md
        tw data-links -> tw-data-links.md
    """
    # Remove "tw " prefix and replace spaces with hyphens
    cmd_parts = command.split()
    if cmd_parts[0] == 'tw':
        cmd_parts = cmd_parts[1:]

    return f"tw-{'-'.join(cmd_parts)}.md"


def scan_overlays_for_examples(overlays_dir: Path, commands: List[str]) -> Dict[str, bool]:
    """
    For each command, check if there's an overlay with a bash code block.

    Returns dict mapping command -> has_example (True/False)
    """
    command_has_example = {}

    for command in commands:
        overlay_filename = command_to_overlay_filename(command)
        overlay_path = overlays_dir / overlay_filename

        has_example = False
        if overlay_path.exists():
            content = overlay_path.read_text()
            has_example = has_bash_code_block(content)

        command_has_example[command] = has_example

        status = "✓" if has_example else "✗"
        print(f"  {status} {command} -> {overlay_filename} -> {'HAS EXAMPLE' if has_example else 'no example'}")

    return command_has_example


def extract_commands_from_reference(reference_dir: Path) -> Dict[str, List[str]]:
    """
    Extract all commands and subcommands from reference documentation.

    Returns dict mapping main command to list of subcommands.
    """
    commands = {}

    for ref_file in reference_dir.glob('*.md'):
        content = ref_file.read_text()

        # Main command is the first H1 heading: # `tw credentials`
        main_cmd_match = re.search(r'^# `(tw \S+)`', content, re.MULTILINE)
        if not main_cmd_match:
            continue

        main_cmd = main_cmd_match.group(1)
        commands[main_cmd] = []

        # Subcommands are H2 headings: ## `tw credentials add`
        subcommand_matches = re.finditer(r'^## `(tw \S+ \S+.*?)`', content, re.MULTILINE)
        for match in subcommand_matches:
            subcommand = match.group(1)
            commands[main_cmd].append(subcommand)

    return commands


def analyze_coverage(overlays_dir: Path, reference_dir: Path) -> Dict:
    """
    Analyze which commands have examples and which don't.
    """
    print("\nExtracting commands from reference docs...")
    reference_commands = extract_commands_from_reference(reference_dir)

    # Flatten reference commands to a single list
    all_reference_commands = []
    for main_cmd, subcommands in reference_commands.items():
        all_reference_commands.append(main_cmd)
        all_reference_commands.extend(subcommands)

    print(f"\nFound {len(all_reference_commands)} commands in reference docs")
    print("\nChecking which commands have overlays with bash code blocks...")

    # Check each command for examples
    command_has_example = scan_overlays_for_examples(overlays_dir, all_reference_commands)

    # Separate commands with/without examples
    commands_with_examples = [cmd for cmd, has_ex in command_has_example.items() if has_ex]
    commands_without_examples = [cmd for cmd, has_ex in command_has_example.items() if not has_ex]

    # Generate report
    report = {
        "summary": {
            "total_reference_commands": len(all_reference_commands),
            "commands_with_examples": len(commands_with_examples),
            "commands_without_examples": len(commands_without_examples),
            "coverage_percentage": round(
                (len(commands_with_examples) / len(all_reference_commands)) * 100, 1
            ) if all_reference_commands else 0
        },
        "commands_with_examples": sorted(commands_with_examples),
        "commands_without_examples": sorted(commands_without_examples),
        "by_command_family": {}
    }

    # Group missing examples by command family
    for cmd in commands_without_examples:
        # Extract command family (e.g., "tw credentials add" -> "credentials")
        parts = cmd.split()
        if len(parts) >= 2:
            family = parts[1]
            if family not in report["by_command_family"]:
                report["by_command_family"][family] = []
            report["by_command_family"][family].append(cmd)

    return report


def main():
    parser = argparse.ArgumentParser(
        description="Analyze CLI documentation example coverage"
    )
    parser.add_argument(
        "--overlays",
        type=Path,
        default=Path("overlays"),
        help="Path to overlays directory (default: overlays)"
    )
    parser.add_argument(
        "--reference",
        type=Path,
        default=Path("reference"),
        help="Path to reference directory (default: reference)"
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("example-coverage-report.json"),
        help="Output JSON file (default: example-coverage-report.json)"
    )

    args = parser.parse_args()

    print(f"Analyzing example coverage...")
    print(f"  Overlays: {args.overlays}")
    print(f"  Reference: {args.reference}")

    report = analyze_coverage(args.overlays, args.reference)

    # Write report
    with open(args.output, 'w') as f:
        json.dump(report, f, indent=2)

    # Print summary
    print("\n" + "=" * 60)
    print("COVERAGE ANALYSIS REPORT")
    print("=" * 60)
    print(f"\nTotal commands in reference docs: {report['summary']['total_reference_commands']}")
    print(f"Commands with examples: {report['summary']['commands_with_examples']}")
    print(f"Commands without examples: {report['summary']['commands_without_examples']}")
    print(f"Coverage: {report['summary']['coverage_percentage']}%")

    if report['commands_without_examples']:
        print(f"\n{len(report['commands_without_examples'])} commands need examples:")
        for family, commands in sorted(report['by_command_family'].items()):
            print(f"\n  {family}:")
            for cmd in commands:
                print(f"    - {cmd}")

    print(f"\nFull report written to: {args.output}")


if __name__ == "__main__":
    main()
