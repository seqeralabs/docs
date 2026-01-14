#!/usr/bin/env python3
"""
Fix common issues in generated reference documentation:
1. Add periods to description sentences after command headings
2. Fix relative links to account for nested directory structure
"""

import re
from pathlib import Path
import argparse


def fix_description_periods(content):
    """Add periods to short description sentences after command headings."""

    lines = content.split('\n')
    fixed_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Match command heading (##, ###, etc. with backticks)
        if re.match(r'^#{2,}\s*`', line):
            fixed_lines.append(line)

            # Check next non-empty line
            if i + 1 < len(lines):
                next_line = lines[i + 1]

                # Skip empty lines
                j = i + 1
                while j < len(lines) and not lines[j].strip():
                    fixed_lines.append(lines[j])
                    j += 1

                # Check if next line is a short description (not starting with -, #, ```, etc.)
                if j < len(lines):
                    desc_line = lines[j].strip()
                    if desc_line and not desc_line.startswith(('#', '-', '```', ':', '|', ':::')) and not desc_line.startswith('['):
                        # Check if it's a short sentence without ending punctuation
                        if not desc_line.endswith(('.', '!', '?', ':', ';')):
                            # Add period
                            fixed_lines.append(lines[j].rstrip() + '.')
                            i = j + 1
                            continue

                i += 1
                continue

        fixed_lines.append(line)
        i += 1

    return '\n'.join(fixed_lines)


def fix_relative_links(content):
    """Fix relative links by adding one more level (../ becomes ../../)."""

    # Pattern to match markdown links like [text](../path/to/file)
    # Only match links that start with ../ and are not already ../../
    def replace_link(match):
        text = match.group(1)
        link = match.group(2)

        # Only fix relative links starting with ../
        if link.startswith('../') and not link.startswith('../../'):
            # Add one more level
            return f'[{text}](../{link})'
        return match.group(0)

    # Replace markdown links
    content = re.sub(r'\[([^\]]+)\]\((\.\./[^\)]+)\)', replace_link, content)

    # Also fix reference-style link definitions at bottom of file
    def replace_reference(match):
        name = match.group(1)
        link = match.group(2)

        # Only fix relative links starting with ../
        if link.startswith('../') and not link.startswith('../../'):
            return f'[{name}]: ../{link}'
        return match.group(0)

    content = re.sub(r'^\[([^\]]+)\]:\s*(\.\./[^\s]+)', replace_reference, content, flags=re.MULTILINE)

    return content


def fix_file(file_path):
    """Fix issues in a single reference file."""

    with open(file_path, 'r') as f:
        content = f.read()

    # Apply fixes
    content = fix_description_periods(content)
    content = fix_relative_links(content)

    # Write back
    with open(file_path, 'w') as f:
        f.write(content)

    print(f"Fixed: {file_path}")


def main():
    parser = argparse.ArgumentParser(description='Fix issues in reference docs')
    parser.add_argument('--input', required=True, help='Path to reference directory')

    args = parser.parse_args()

    reference_dir = Path(args.input)

    if not reference_dir.exists():
        print(f"Error: {reference_dir} does not exist")
        return

    # Process all .md files
    md_files = list(reference_dir.glob('*.md'))

    print(f"Processing {len(md_files)} files...")

    for file_path in md_files:
        fix_file(file_path)

    print(f"\n✓ Fixed {len(md_files)} reference files")


if __name__ == '__main__':
    main()
