#!/usr/bin/env python3
"""
Verify that agent findings actually exist in the source files.

This script validates agent output by checking that quoted text
actually exists at the claimed line numbers, filtering out hallucinations.
"""

import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass


@dataclass
class Finding:
    """Represents a single agent finding."""
    file_path: str
    line_number: int
    exact_quote: str
    issue: str
    suggested: str
    rule: str
    confidence: str
    agent: str

    def __str__(self):
        return f"{self.file_path}:{self.line_number} - {self.issue}"


@dataclass
class VerificationResult:
    """Result of verifying a finding against source file."""
    finding: Finding
    verified: bool
    reason: str
    actual_content: Optional[str] = None


def read_file_lines(file_path: Path) -> List[str]:
    """Read file and return list of lines (1-indexed for human readability)."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            # Add empty string at index 0 so line numbers are 1-indexed
            return [''] + f.readlines()
    except FileNotFoundError:
        return []
    except Exception as e:
        print(f"⚠️  Error reading {file_path}: {e}", file=sys.stderr)
        return []


def normalize_whitespace(text: str) -> str:
    """Normalize whitespace for comparison (preserve single spaces)."""
    # Strip leading/trailing whitespace
    text = text.strip()
    # Collapse multiple spaces to single space
    text = re.sub(r'\s+', ' ', text)
    return text


def verify_finding(finding: Finding, repo_root: Path) -> VerificationResult:
    """
    Verify that a finding's quoted text exists at the claimed line number.

    Returns VerificationResult with verified=True if:
    1. File exists
    2. Line number is valid
    3. Quoted text matches actual content (with fuzzy matching)
    """
    file_path = repo_root / finding.file_path

    # Check if file exists
    if not file_path.exists():
        return VerificationResult(
            finding=finding,
            verified=False,
            reason=f"File does not exist: {finding.file_path}"
        )

    # Read file lines
    lines = read_file_lines(file_path)

    # Check if line number is valid
    if finding.line_number >= len(lines) or finding.line_number < 1:
        return VerificationResult(
            finding=finding,
            verified=False,
            reason=f"Line number {finding.line_number} out of range (file has {len(lines)-1} lines)"
        )

    # Get actual line content
    actual_line = lines[finding.line_number].rstrip('\n')

    # Normalize both texts for comparison
    quoted_normalized = normalize_whitespace(finding.exact_quote)
    actual_normalized = normalize_whitespace(actual_line)

    # Check for exact match (normalized)
    if quoted_normalized in actual_normalized:
        return VerificationResult(
            finding=finding,
            verified=True,
            reason="Exact match found",
            actual_content=actual_line
        )

    # Check if quote is a substring of actual content (fuzzy match)
    if quoted_normalized.lower() in actual_normalized.lower():
        return VerificationResult(
            finding=finding,
            verified=True,
            reason="Fuzzy match found (case-insensitive)",
            actual_content=actual_line
        )

    # Check nearby lines (±2 lines) in case line number is slightly off
    for offset in [-2, -1, 1, 2]:
        nearby_line_num = finding.line_number + offset
        if 1 <= nearby_line_num < len(lines):
            nearby_line = lines[nearby_line_num].rstrip('\n')
            nearby_normalized = normalize_whitespace(nearby_line)
            if quoted_normalized in nearby_normalized:
                return VerificationResult(
                    finding=finding,
                    verified=True,
                    reason=f"Found at nearby line {nearby_line_num} (off by {offset})",
                    actual_content=nearby_line
                )

    # No match found - this is a hallucination
    return VerificationResult(
        finding=finding,
        verified=False,
        reason=f"Quote not found. Actual line {finding.line_number}: '{actual_line[:100]}'",
        actual_content=actual_line
    )


def parse_json_findings(findings_data: dict) -> List[Finding]:
    """Parse findings from JSON format."""
    findings = []
    agent_name = findings_data.get('agent', 'unknown')

    for file_data in findings_data.get('files', []):
        file_path = file_data['path']
        for finding_data in file_data.get('findings', []):
            findings.append(Finding(
                file_path=file_path,
                line_number=finding_data['line_number'],
                exact_quote=finding_data['exact_quote'],
                issue=finding_data['issue_description'],
                suggested=finding_data['suggested_fix'],
                rule=finding_data['rule'],
                confidence=finding_data.get('confidence', 'UNKNOWN'),
                agent=agent_name
            ))

    return findings


def parse_markdown_findings(markdown_text: str, agent_name: str = 'unknown') -> List[Finding]:
    """
    Parse findings from markdown format output by agents.

    Expected format:
    **Line 42:**
    ```
    EXACT QUOTE: "The user can configure..."
    ```
    - **Issue**: Third-person reference
    - **Suggested**: "You can configure..."
    - **Rule**: Use second person
    - **Confidence**: HIGH
    """
    findings = []

    # Extract file path from markdown heading
    file_match = re.search(r'### File: (.+)', markdown_text)
    file_path = file_match.group(1) if file_match else 'unknown'

    # Find all finding blocks
    finding_pattern = re.compile(
        r'\*\*Line (\d+):\*\*\s*```\s*EXACT QUOTE: "([^"]+)".*?```.*?'
        r'- \*\*Issue\*\*: (.+?)(?:\n|$).*?'
        r'- \*\*Suggested\*\*: "?([^"\n]+)"?(?:\n|$).*?'
        r'- \*\*Rule\*\*: (.+?)(?:\n|$).*?'
        r'- \*\*Confidence\*\*: (\w+)',
        re.DOTALL
    )

    for match in finding_pattern.finditer(markdown_text):
        line_num, quote, issue, suggested, rule, confidence = match.groups()
        findings.append(Finding(
            file_path=file_path,
            line_number=int(line_num),
            exact_quote=quote.strip(),
            issue=issue.strip(),
            suggested=suggested.strip(),
            rule=rule.strip(),
            confidence=confidence.strip(),
            agent=agent_name
        ))

    return findings


def load_findings(findings_file: Path, agent_name: str = 'unknown') -> List[Finding]:
    """Load findings from JSON or markdown file."""
    with open(findings_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Try JSON first
    try:
        data = json.loads(content)
        return parse_json_findings(data)
    except json.JSONDecodeError:
        # Fall back to markdown parsing
        return parse_markdown_findings(content, agent_name)


def output_verified_findings(results: List[VerificationResult], output_file: Optional[Path] = None):
    """Output only verified findings in a clean format."""
    verified = [r for r in results if r.verified]

    if not verified:
        print("\n✅ No verified findings (all were hallucinations or no findings provided)")
        return

    output = []
    output.append("\n## Verified Findings\n")
    output.append(f"**Total verified:** {len(verified)}\n")

    # Group by file
    by_file: Dict[str, List[VerificationResult]] = {}
    for result in verified:
        file_path = result.finding.file_path
        if file_path not in by_file:
            by_file[file_path] = []
        by_file[file_path].append(result)

    # Output grouped by file
    for file_path, file_results in sorted(by_file.items()):
        output.append(f"\n### {file_path}\n")
        for result in sorted(file_results, key=lambda r: r.finding.line_number):
            f = result.finding
            output.append(f"**Line {f.line_number}:** ({f.agent})")
            output.append(f"```")
            output.append(f'{f.exact_quote}')
            output.append(f"```")
            output.append(f"- **Issue**: {f.issue}")
            output.append(f"- **Suggested**: {f.suggested}")
            output.append(f"- **Confidence**: {f.confidence}")
            if result.reason != "Exact match found":
                output.append(f"- **Note**: {result.reason}")
            output.append("")

    output_text = '\n'.join(output)

    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(output_text)
        print(f"✅ Verified findings written to: {output_file}")
    else:
        print(output_text)


def main():
    if len(sys.argv) < 2:
        print("Usage: verify-agent-findings.py <findings-file> [repo-root] [agent-name] [output-file]")
        print("\nExample:")
        print("  verify-agent-findings.py findings.json /path/to/repo voice-tone verified.md")
        sys.exit(1)

    findings_file = Path(sys.argv[1])
    repo_root = Path(sys.argv[2]) if len(sys.argv) > 2 else Path.cwd()
    agent_name = sys.argv[3] if len(sys.argv) > 3 else 'unknown'
    output_file = Path(sys.argv[4]) if len(sys.argv) > 4 else None

    if not findings_file.exists():
        print(f"❌ Findings file not found: {findings_file}", file=sys.stderr)
        sys.exit(1)

    print(f"🔍 Verifying agent findings from: {findings_file}")
    print(f"📁 Repository root: {repo_root}")
    print(f"🤖 Agent: {agent_name}\n")

    # Load findings
    try:
        findings = load_findings(findings_file, agent_name)
        print(f"📋 Loaded {len(findings)} findings\n")
    except Exception as e:
        print(f"❌ Error loading findings: {e}", file=sys.stderr)
        sys.exit(1)

    # Verify each finding
    results = []
    verified_count = 0
    hallucination_count = 0

    for finding in findings:
        result = verify_finding(finding, repo_root)
        results.append(result)

        if result.verified:
            verified_count += 1
            print(f"✅ {finding.file_path}:{finding.line_number} - {result.reason}")
        else:
            hallucination_count += 1
            print(f"❌ {finding.file_path}:{finding.line_number} - {result.reason}")

    # Summary
    print(f"\n{'='*70}")
    print(f"📊 Verification Summary")
    print(f"{'='*70}")
    print(f"Total findings: {len(findings)}")
    print(f"✅ Verified: {verified_count} ({verified_count/len(findings)*100:.1f}%)")
    print(f"❌ Hallucinations: {hallucination_count} ({hallucination_count/len(findings)*100:.1f}%)")
    print(f"{'='*70}\n")

    # Output verified findings
    output_verified_findings(results, output_file)

    # Exit with error if hallucinations detected
    if hallucination_count > 0:
        print(f"\n⚠️  Warning: {hallucination_count} hallucinated findings were filtered out")
        # Don't exit with error - we still want the verified findings
        # sys.exit(1)

    sys.exit(0)


if __name__ == '__main__':
    main()
