#!/usr/bin/env python3
"""
Update permissions documentation tables from Platform repo grants files.

This script:
1. Parses tables from Platform's grants_roles.md and grants_operations.md
2. Updates corresponding tables in the docs repo
3. Tracks successes and failures
4. Generates error report if any updates fail
"""

import argparse
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Optional


class TableUpdateError(Exception):
    """Custom exception for table update failures."""
    pass


class PermissionsTableUpdater:
    """Handles updating permissions tables in documentation."""

    def __init__(self, platform_repo_path: Path, docs_repo_path: Path):
        self.platform_repo = platform_repo_path
        self.docs_repo = docs_repo_path
        self.errors: List[Dict[str, str]] = []
        self.successes: List[str] = []

    def parse_roles_table(self, content: str) -> Optional[str]:
        """
        Extract the entire roles permissions table from grants_roles.md.

        Returns the complete table including header and all rows.
        """
        lines = content.strip().split('\n')

        # Find the start of the table (header row)
        table_start = None
        for i, line in enumerate(lines):
            if line.strip().startswith('| Permission |'):
                table_start = i
                break

        if table_start is None:
            return None

        # Find the end of the table
        table_end = table_start
        for i in range(table_start, len(lines)):
            if lines[i].strip().startswith('|'):
                table_end = i
            else:
                break

        # Extract the table
        table_lines = lines[table_start:table_end + 1]
        return '\n'.join(table_lines)

    def parse_operations_tables(self, content: str) -> Dict[str, str]:
        """
        Extract operation tables from grants_operations.md, organized by section heading.

        Returns dict mapping section name (e.g., "Compute") to table content.
        """
        tables = {}
        lines = content.split('\n')
        current_section = None
        table_lines = []
        in_table = False

        for line in lines:
            # Check for section heading (### Compute, ### Data, etc.)
            if line.strip().startswith('###'):
                # Save previous section's table if exists
                if current_section and table_lines:
                    tables[current_section] = '\n'.join(table_lines).strip()
                    table_lines = []
                    in_table = False

                # Extract new section name
                current_section = line.strip().replace('###', '').strip()

            # Check if we're at a table row
            elif line.strip().startswith('|'):
                in_table = True
                table_lines.append(line)

            # If we were in a table but hit a non-table line
            elif in_table and not line.strip().startswith('|'):
                in_table = False

        # Save the last section's table
        if current_section and table_lines:
            tables[current_section] = '\n'.join(table_lines).strip()

        return tables

    def update_roles_table(self, file_path: Path, new_table: str) -> None:
        """
        Update the Role permissions table in a roles.md file.

        Finds the table under ### Role permissions heading and replaces it.
        """
        if not file_path.exists():
            raise TableUpdateError(f"File not found: {file_path}")

        content = file_path.read_text()

        # Find the "### Role permissions" section
        # Pattern allows for any content (including descriptive text) between heading and table
        pattern = r'(### Role permissions\s*\n(?:.*?\n)*?)((?:\|[^\n]*\n)+)'

        match = re.search(pattern, content, re.MULTILINE | re.DOTALL)
        if not match:
            raise TableUpdateError(f"Could not find '### Role permissions' table in {file_path}")

        # Replace the table while keeping the heading
        new_content = content[:match.start(2)] + new_table + '\n' + content[match.end(2):]

        file_path.write_text(new_content)

    def update_operations_table(self, file_path: Path, section_name: str, new_table: str) -> None:
        """
        Update an operations table in custom-roles.md under a specific section heading.

        Finds the table under #### {section_name} heading and replaces it.
        """
        if not file_path.exists():
            raise TableUpdateError(f"File not found: {file_path}")

        content = file_path.read_text()

        # Find the section heading (#### Compute, #### Data, etc.)
        # Pattern allows for any content (including descriptive text) between heading and table
        pattern = rf'(####\s+{re.escape(section_name)}\s*\n(?:.*?\n)*?)((?:\|[^\n]*\n)+)'

        match = re.search(pattern, content, re.MULTILINE | re.DOTALL)
        if not match:
            raise TableUpdateError(
                f"Could not find '#### {section_name}' table in {file_path}"
            )

        # Replace the table while keeping the heading
        new_content = content[:match.start(2)] + new_table + '\n' + content[match.end(2):]

        file_path.write_text(new_content)

    def process_roles_grants(self) -> None:
        """Process grants_roles.md and update corresponding docs files."""
        print("📋 Processing grants_roles.md...")

        # Read Platform grants file
        grants_file = self.platform_repo / 'docs' / 'grants_roles.md'
        if not grants_file.exists():
            error_msg = f"Platform grants file not found: {grants_file}"
            print(f"❌ {error_msg}")
            self.errors.append({
                'file': str(grants_file),
                'error': error_msg,
                'type': 'source_missing'
            })
            return

        grants_content = grants_file.read_text()
        roles_table = self.parse_roles_table(grants_content)

        if not roles_table:
            error_msg = "Could not parse roles table from grants_roles.md"
            print(f"❌ {error_msg}")
            self.errors.append({
                'file': str(grants_file),
                'error': error_msg,
                'type': 'parse_error'
            })
            return

        print(f"✅ Parsed roles table ({len(roles_table.split(chr(10)))} lines)")

        # Update both roles.md files
        target_files = [
            self.docs_repo / 'platform-cloud' / 'docs' / 'orgs-and-teams' / 'roles.md',
            self.docs_repo / 'platform-enterprise_docs' / 'orgs-and-teams' / 'roles.md',
        ]

        for target_file in target_files:
            try:
                print(f"  Updating {target_file.relative_to(self.docs_repo)}...")
                self.update_roles_table(target_file, roles_table)
                self.successes.append(str(target_file.relative_to(self.docs_repo)))
                print(f"  ✅ Updated successfully")
            except TableUpdateError as e:
                error_msg = str(e)
                print(f"  ❌ {error_msg}")
                self.errors.append({
                    'file': str(target_file.relative_to(self.docs_repo)),
                    'error': error_msg,
                    'type': 'update_error'
                })
            except Exception as e:
                error_msg = f"Unexpected error: {str(e)}"
                print(f"  ❌ {error_msg}")
                self.errors.append({
                    'file': str(target_file.relative_to(self.docs_repo)),
                    'error': error_msg,
                    'type': 'unexpected_error'
                })

    def process_operations_grants(self) -> None:
        """Process grants_operations.md and update custom-roles.md."""
        print("\n📋 Processing grants_operations.md...")

        # Read Platform grants file
        grants_file = self.platform_repo / 'docs' / 'grants_operations.md'
        if not grants_file.exists():
            error_msg = f"Platform grants file not found: {grants_file}"
            print(f"❌ {error_msg}")
            self.errors.append({
                'file': str(grants_file),
                'error': error_msg,
                'type': 'source_missing'
            })
            return

        grants_content = grants_file.read_text()
        operations_tables = self.parse_operations_tables(grants_content)

        if not operations_tables:
            error_msg = "Could not parse any operation tables from grants_operations.md"
            print(f"❌ {error_msg}")
            self.errors.append({
                'file': str(grants_file),
                'error': error_msg,
                'type': 'parse_error'
            })
            return

        print(f"✅ Parsed {len(operations_tables)} operation tables: {', '.join(operations_tables.keys())}")

        # Update custom-roles.md
        target_file = self.docs_repo / 'platform-enterprise_docs' / 'orgs-and-teams' / 'custom-roles.md'

        for section_name, table_content in operations_tables.items():
            try:
                print(f"  Updating {section_name} section...")
                self.update_operations_table(target_file, section_name, table_content)
                self.successes.append(f"{target_file.relative_to(self.docs_repo)} ({section_name})")
                print(f"  ✅ Updated successfully")
            except TableUpdateError as e:
                error_msg = str(e)
                print(f"  ❌ {error_msg}")
                self.errors.append({
                    'file': f"{target_file.relative_to(self.docs_repo)} ({section_name})",
                    'error': error_msg,
                    'type': 'update_error'
                })
            except Exception as e:
                error_msg = f"Unexpected error: {str(e)}"
                print(f"  ❌ {error_msg}")
                self.errors.append({
                    'file': f"{target_file.relative_to(self.docs_repo)} ({section_name})",
                    'error': error_msg,
                    'type': 'unexpected_error'
                })

    def generate_error_report(self) -> None:
        """Generate UPDATE_ERRORS.md if there were any errors."""
        if not self.errors:
            return

        report_path = self.docs_repo / 'UPDATE_ERRORS.md'

        report_lines = [
            "# Permissions Documentation Update Errors",
            "",
            "Some table updates encountered errors. Please review and fix manually.",
            "",
            "## Summary",
            "",
            f"- ✅ Successful updates: {len(self.successes)}",
            f"- ❌ Failed updates: {len(self.errors)}",
            "",
        ]

        if self.successes:
            report_lines.extend([
                "## Successful Updates",
                "",
            ])
            for success in self.successes:
                report_lines.append(f"- ✅ {success}")
            report_lines.append("")

        report_lines.extend([
            "## Failed Updates",
            "",
        ])

        for error in self.errors:
            report_lines.extend([
                f"### {error['file']}",
                "",
                f"**Error Type**: `{error['type']}`",
                "",
                f"**Error Message**:",
                f"```",
                error['error'],
                f"```",
                "",
            ])

        report_lines.extend([
            "## Next Steps",
            "",
            "1. Review each failed update above",
            "2. Manually update the affected files if needed",
            "3. Verify table formatting matches Platform source",
            "4. Delete this file once all issues are resolved",
        ])

        report_path.write_text('\n'.join(report_lines))
        print(f"\n⚠️  Error report generated: UPDATE_ERRORS.md")

    def run(self, changed_files: List[str]) -> int:
        """
        Main execution method.

        Args:
            changed_files: List of changed files from Platform repo

        Returns:
            Exit code (0 for success, 1 if there were errors)
        """
        print("🚀 Starting permissions documentation update...")
        print(f"Changed files: {', '.join(changed_files)}")
        print()

        # Process each changed file
        if 'docs/grants_roles.md' in changed_files:
            self.process_roles_grants()

        if 'docs/grants_operations.md' in changed_files:
            self.process_operations_grants()

        # Generate error report if needed
        if self.errors:
            self.generate_error_report()

        # Print summary
        print("\n" + "=" * 60)
        print("📊 Update Summary")
        print("=" * 60)
        print(f"✅ Successful updates: {len(self.successes)}")
        print(f"❌ Failed updates: {len(self.errors)}")

        if self.errors:
            print("\n⚠️  Some updates failed. See UPDATE_ERRORS.md for details.")
            return 1
        else:
            print("\n🎉 All updates completed successfully!")
            return 0


def main():
    parser = argparse.ArgumentParser(
        description='Update permissions documentation tables from Platform repo'
    )
    parser.add_argument(
        '--platform-repo',
        type=Path,
        required=True,
        help='Path to Platform repository'
    )
    parser.add_argument(
        '--changed-files',
        type=str,
        required=True,
        help='Comma-separated list of changed files'
    )

    args = parser.parse_args()

    # Parse changed files
    changed_files = [f.strip() for f in args.changed_files.split(',')]

    # Get docs repo path (current directory)
    docs_repo = Path.cwd()

    # Create updater and run
    updater = PermissionsTableUpdater(args.platform_repo, docs_repo)
    exit_code = updater.run(changed_files)

    sys.exit(exit_code)


if __name__ == '__main__':
    main()
