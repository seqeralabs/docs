#!/usr/bin/env python3
"""
Update audit event documentation tables from Platform repo docs/audit_events.md.

This script:
1. Parses the active audit events table from Platform docs/audit_events.md
2. Parses the deprecated audit events table from the same file
3. Updates the generated config tables used by the Enterprise audit logs page
"""

import argparse
import sys
from pathlib import Path
from typing import Dict, List


class AuditEventsUpdateError(Exception):
    """Raised when audit event table updates fail."""


class AuditEventsTableUpdater:
    """Handles updating audit event tables in documentation."""

    ACTIVE_COLUMNS = ["Event", "Target", "Description"]
    DEPRECATED_COLUMNS = ["Event", "Replacement"]

    def __init__(self, platform_repo_path: Path, docs_repo_path: Path):
        self.platform_repo = platform_repo_path
        self.docs_repo = docs_repo_path

    def parse_markdown_tables(self, content: str) -> Dict[str, List[Dict[str, str]]]:
        """Parse the active and deprecated audit events tables."""
        tables: Dict[str, List[Dict[str, str]]] = {}
        current_section = "active"
        lines = content.splitlines()
        index = 0

        while index < len(lines):
            line = lines[index].strip()

            if line == "## Deprecated":
                current_section = "deprecated"
                index += 1
                continue

            if line.startswith("|") and index + 1 < len(lines) and self.is_separator(lines[index + 1]):
                headers = self.parse_table_row(line)
                rows: List[Dict[str, str]] = []
                index += 2

                while index < len(lines) and lines[index].strip().startswith("|"):
                    values = self.parse_table_row(lines[index])
                    if len(values) != len(headers):
                        raise AuditEventsUpdateError(
                            f"Malformed table row in {current_section} table: {lines[index]}"
                        )
                    rows.append(dict(zip(headers, values)))
                    index += 1

                tables[current_section] = rows
                continue

            index += 1

        self.validate_table("active", tables.get("active"), self.ACTIVE_COLUMNS)
        self.validate_table("deprecated", tables.get("deprecated"), self.DEPRECATED_COLUMNS)

        return tables

    def parse_table_row(self, row: str) -> List[str]:
        """Parse a simple Markdown table row."""
        return [cell.strip() for cell in row.strip().strip("|").split("|")]

    def is_separator(self, row: str) -> bool:
        """Return true if a Markdown table row is a separator."""
        cells = self.parse_table_row(row)
        return bool(cells) and all(cell.replace("-", "").replace(":", "").strip() == "" for cell in cells)

    def validate_table(self, table_name: str, rows: List[Dict[str, str]] | None, columns: List[str]) -> None:
        """Validate that a parsed table exists and has the expected columns."""
        if not rows:
            raise AuditEventsUpdateError(f"Could not parse {table_name} audit events table")

        actual_columns = list(rows[0].keys())
        if actual_columns != columns:
            raise AuditEventsUpdateError(
                f"Unexpected {table_name} table columns: {actual_columns}. Expected: {columns}"
            )

    def yaml_quote(self, value: str) -> str:
        """Quote a value for the simple config table YAML format used by the docs site."""
        return "'" + value.replace("'", "''") + "'"

    def write_config_table(self, file_path: Path, rows: List[Dict[str, str]], columns: List[str]) -> None:
        """Write rows to the docs config table YAML format."""
        lines = ["---"]

        for row in rows:
            lines.append("-")
            for column in columns:
                lines.append(f"  {column}: {self.yaml_quote(row[column])}")

        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text("\n".join(lines) + "\n")

    def target_configtable_dirs(self) -> List[Path]:
        """Return audit event table targets for unversioned Enterprise docs."""
        return [
            self.docs_repo / "platform-enterprise_docs" / "monitoring" / "configtables",
        ]

    def run(self, changed_files: List[str]) -> int:
        """Update audit events config tables if docs/audit_events.md changed."""
        print("Starting audit events documentation update...")
        print(f"Changed files: {', '.join(changed_files)}")

        if "docs/audit_events.md" not in changed_files:
            print("No audit events source changes detected. Nothing to update.")
            return 0

        source_file = self.platform_repo / "docs" / "audit_events.md"
        if not source_file.exists():
            raise AuditEventsUpdateError(f"Platform audit events file not found: {source_file}")

        tables = self.parse_markdown_tables(source_file.read_text())

        for configtables_dir in self.target_configtable_dirs():
            self.write_config_table(
                configtables_dir / "audit_events_v2.yml",
                tables["active"],
                self.ACTIVE_COLUMNS,
            )
            self.write_config_table(
                configtables_dir / "audit_events_deprecated.yml",
                tables["deprecated"],
                self.DEPRECATED_COLUMNS,
            )
            print(f"Updated {configtables_dir.relative_to(self.docs_repo)}")

        print(f"Updated active audit events: {len(tables['active'])} rows")
        print(f"Updated deprecated audit events: {len(tables['deprecated'])} rows")
        return 0


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Update audit events documentation tables from Platform repo"
    )
    parser.add_argument(
        "--platform-repo",
        type=Path,
        required=True,
        help="Path to Platform repository",
    )
    parser.add_argument(
        "--changed-files",
        type=str,
        required=True,
        help="Comma-separated list of changed files",
    )

    args = parser.parse_args()
    changed_files = [file.strip() for file in args.changed_files.split(",") if file.strip()]

    updater = AuditEventsTableUpdater(args.platform_repo, Path.cwd())
    sys.exit(updater.run(changed_files))


if __name__ == "__main__":
    main()
