#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "rich-click>=1.7",
#     "rich>=13.0",
#     "requests>=2.28",
# ]
# ///
"""
Generate changelog files for Seqera documentation from GitHub releases.

This script fetches release information from GitHub and generates properly
formatted changelog files for the Seqera docs site.

Usage:
    uv run .github/scripts/generate-changelog.py --help
    uv run .github/scripts/generate-changelog.py --repo seqeralabs/fusion --release v2.5.0
    uv run .github/scripts/generate-changelog.py --repo seqeralabs/wave --last 10

Environment variables (for CI integration):
    All options can be set via CHANGELOG_<OPTION> environment variables.
    For example: CHANGELOG_REPO, CHANGELOG_RELEASE, CHANGELOG_LAST, etc.
    GH_TOKEN/GITHUB_TOKEN - GitHub authentication token
"""

import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

import requests
import rich_click as click
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
from rich.table import Table

console = Console()

# Product configuration mapping repo names to their changelog settings
PRODUCT_CONFIG = {
    "seqeralabs/fusion": {
        "name": "Fusion",
        "dir": "changelog/fusion",
        "extension": ".md",
        "tag": "fusion",
        "title_prefix": "Fusion",
    },
    "seqeralabs/wave": {
        "name": "Wave",
        "dir": "changelog/wave",
        "extension": ".md",
        "tag": "wave",
        "title_prefix": "Wave",
    },
    "nextflow-io/nextflow": {
        "name": "Nextflow",
        "dir": "changelog/nextflow",
        "extension": ".md",
        "tag": "nextflow",
        "title_prefix": "Nextflow",
    },
    "MultiQC/MultiQC": {
        "name": "MultiQC",
        "dir": "changelog/multiqc",
        "extension": ".mdx",
        "tag": "multiqc",
        "title_prefix": "MultiQC",
    },
}


def get_github_token() -> Optional[str]:
    """Get GitHub token from environment variables."""
    return os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")


def fetch_releases(repo: str, token: Optional[str] = None, per_page: int = 30) -> list[dict]:
    """Fetch releases from GitHub API."""
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    url = f"https://api.github.com/repos/{repo}/releases"
    params = {"per_page": per_page}

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


def fetch_release_by_tag(repo: str, tag: str, token: Optional[str] = None) -> dict:
    """Fetch a specific release by tag from GitHub API."""
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    url = f"https://api.github.com/repos/{repo}/releases/tags/{tag}"

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()


def normalize_version(tag: str) -> str:
    """Normalize version tag for consistent file naming."""
    # Remove leading 'v' if present for version display, but keep for filename
    return tag if tag.startswith("v") else f"v{tag}"


def format_date(date_str: str) -> str:
    """Format ISO date string to YYYY-MM-DD."""
    dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    return dt.strftime("%Y-%m-%d")


def generate_fusion_changelog(release: dict, config: dict) -> str:
    """Generate Fusion-specific changelog content."""
    version = normalize_version(release["tag_name"])
    date = format_date(release["published_at"])
    body = release["body"] or ""

    # Extract version number without 'v' prefix for URLs
    version_num = version.lstrip("v")

    content = f"""---
title: {config['title_prefix']} {version}
date: {date}
tags: [{config['tag']}]
---

{body}

### How to pin this version

```groovy
fusion {{
  enabled = true
  containerConfigUrl = 'https://fusionfs.seqera.io/releases/v{version_num}-amd64.json'
}}
```

:::info
For ARM64 CPU architecture, use `containerConfigUrl = 'https://fusionfs.seqera.io/releases/v{version_num}-arm64.json'`.
:::
"""
    return content


def generate_wave_changelog(release: dict, config: dict, prev_version: Optional[str] = None) -> str:
    """Generate Wave-specific changelog content."""
    version = normalize_version(release["tag_name"])
    date = format_date(release["published_at"])
    body = release["body"] or ""

    content = f"""---
title: {config['title_prefix']} {version}
date: {date}
tags: [{config['tag']}]
---

{body}
"""

    # Add full changelog link if we have previous version
    if prev_version:
        content += f"""
**Full changelog**: https://github.com/seqeralabs/wave/compare/{prev_version}...{version}
"""

    return content


def generate_nextflow_changelog(release: dict, config: dict) -> str:
    """Generate Nextflow-specific changelog content."""
    version = normalize_version(release["tag_name"])
    # Nextflow titles don't include 'v' prefix
    title_version = release["tag_name"].lstrip("v")
    date = format_date(release["published_at"])
    body = release["body"] or ""

    content = f"""---
title: {config['title_prefix']} {title_version}
date: {date}
tags: [{config['tag']}]
---

{body}

https://github.com/nextflow-io/nextflow/releases/tag/{version}
"""
    return content


def generate_multiqc_changelog(release: dict, config: dict) -> str:
    """Generate MultiQC-specific changelog content (MDX format for manual truncation)."""
    version = normalize_version(release["tag_name"])
    date = format_date(release["published_at"])
    body = release["body"] or ""

    content = f"""---
title: {config['title_prefix']} {version}
date: {date}
tags: [{config['tag']}]
---

{body}
"""
    return content


def generate_changelog(release: dict, repo: str, prev_version: Optional[str] = None) -> str:
    """Generate changelog content for a release based on repository."""
    config = PRODUCT_CONFIG.get(repo)
    if not config:
        raise ValueError(f"Unknown repository: {repo}")

    if repo == "seqeralabs/fusion":
        return generate_fusion_changelog(release, config)
    elif repo == "seqeralabs/wave":
        return generate_wave_changelog(release, config, prev_version)
    elif repo == "nextflow-io/nextflow":
        return generate_nextflow_changelog(release, config)
    elif repo == "MultiQC/MultiQC":
        return generate_multiqc_changelog(release, config)
    else:
        raise ValueError(f"No generator for repository: {repo}")


def get_output_path(repo: str, version: str) -> Path:
    """Get the output file path for a changelog."""
    config = PRODUCT_CONFIG.get(repo)
    if not config:
        raise ValueError(f"Unknown repository: {repo}")

    version = normalize_version(version)
    return Path(config["dir"]) / f"{version}{config['extension']}"


def branch_exists_on_remote(branch_name: str) -> bool:
    """Check if a branch already exists on the remote."""
    result = subprocess.run(
        ["git", "ls-remote", "--exit-code", "origin", f"refs/heads/{branch_name}"],
        capture_output=True,
        text=True,
    )
    return result.returncode == 0


def create_pr_for_changelog(
    file_path: Path,
    version: str,
    product_name: str,
    source_repo: str,
    console: Console,
) -> bool:
    """Create a PR for a changelog file.

    Returns True if PR was created successfully, False otherwise.
    """
    # Normalize version for branch name (ensure v prefix)
    norm_version = version if version.startswith("v") else f"v{version}"
    branch_name = f"changelog/{product_name.lower()}-{norm_version}"

    # Check if branch already exists (PR in progress)
    if branch_exists_on_remote(branch_name):
        console.print(f"  [yellow]⏭️  Branch {branch_name} already exists (PR in progress) - skipping[/yellow]")
        return False

    # Check if file exists
    if not file_path.exists():
        console.print(f"  [yellow]⚠️  File {file_path} not found - skipping[/yellow]")
        return False

    try:
        # Get current branch to return to later
        result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            capture_output=True,
            text=True,
            check=True,
        )
        current_branch = result.stdout.strip()

        # Create branch and commit
        subprocess.run(["git", "checkout", "-b", branch_name], capture_output=True, check=True)
        subprocess.run(["git", "add", str(file_path)], capture_output=True, check=True)
        subprocess.run(
            ["git", "commit", "-m", f"Changelog: {product_name} {norm_version}"],
            capture_output=True,
            check=True,
        )

        # Push branch
        subprocess.run(["git", "push", "-u", "origin", branch_name], capture_output=True, check=True)

        # Create PR using gh CLI
        pr_body = f"""## Summary

This PR adds the changelog entry for **{product_name} {norm_version}**.

**Source release:** https://github.com/{source_repo}/releases/tag/{version}

---
*This PR was automatically generated by the changelog automation workflow.*"""

        subprocess.run(
            [
                "gh", "pr", "create",
                "--title", f"Changelog: {product_name} {norm_version}",
                "--body", pr_body,
                "--base", "master",
                "--head", branch_name,
            ],
            capture_output=True,
            check=True,
        )

        console.print(f"  [green]✅ Created PR for {product_name} {norm_version}[/green]")

        # Return to original branch and clean up
        subprocess.run(["git", "checkout", current_branch], capture_output=True, check=True)
        subprocess.run(["git", "branch", "-D", branch_name], capture_output=True)

        return True

    except subprocess.CalledProcessError as e:
        console.print(f"  [red]❌ Failed to create PR: {e.stderr or e.stdout or str(e)}[/red]")
        # Try to return to original branch
        try:
            subprocess.run(["git", "checkout", current_branch], capture_output=True)
            subprocess.run(["git", "branch", "-D", branch_name], capture_output=True)
        except Exception:
            pass
        return False


# Configure rich-click
click.rich_click.USE_RICH_MARKUP = True
click.rich_click.USE_MARKDOWN = True
click.rich_click.SHOW_ARGUMENTS = True
click.rich_click.GROUP_ARGUMENTS_OPTIONS = True
click.rich_click.STYLE_ERRORS_SUGGESTION = "yellow italic"


@click.command()
@click.option(
    "--repo",
    "-r",
    required=True,
    type=click.Choice(list(PRODUCT_CONFIG.keys())),
    help="Source repository to fetch releases from",
)
@click.option(
    "--release",
    "-R",
    help="Specific release tag to generate changelog for (e.g., v2.5.0)",
)
@click.option(
    "--from",
    "-f",
    "from_",
    type=click.DateTime(formats=["%Y-%m-%d"]),
    help="Start date for date range filter (YYYY-MM-DD)",
)
@click.option(
    "--to",
    "-t",
    type=click.DateTime(formats=["%Y-%m-%d"]),
    help="End date for date range filter (YYYY-MM-DD)",
)
@click.option(
    "--last",
    "-l",
    type=int,
    help="Generate changelogs for the last N releases",
)
@click.option(
    "--output",
    "-o",
    type=click.Path(),
    help="Output file path (defaults to stdout for single release, or auto-named files for multiple)",
)
@click.option(
    "--output-dir",
    "-d",
    type=click.Path(),
    help="Output directory for multiple changelogs (defaults to current directory)",
)
@click.option(
    "--dry-run",
    is_flag=True,
    help="Show what would be generated without writing files",
)
@click.option(
    "--overwrite",
    is_flag=True,
    help="Overwrite existing changelog files (by default, existing files are skipped)",
)
@click.option(
    "--json-output",
    type=click.Path(),
    help="Write JSON output of generated files to this path (for CI integration)",
)
@click.option(
    "--create-pr",
    is_flag=True,
    help="Create PRs for generated changelogs (requires gh CLI)",
)
def main(
    repo: str,
    release: Optional[str],
    from_: Optional[datetime],
    to: Optional[datetime],
    last: Optional[int],
    output: Optional[str],
    output_dir: Optional[str],
    dry_run: bool,
    overwrite: bool,
    json_output: Optional[str],
    create_pr: bool,
):
    """
    Generate changelog files from GitHub releases.

    Fetches release information from GitHub and generates properly formatted
    changelog files for the Seqera documentation site.

    **Examples:**

    Generate changelog for a specific release:

        uv run generate-changelog.py --repo seqeralabs/fusion --release v2.5.0

    Generate changelogs for releases in a date range:

        uv run generate-changelog.py --repo seqeralabs/wave --from 2024-01-01 --to 2024-12-31

    Generate changelogs for the last 10 releases:

        uv run generate-changelog.py --repo MultiQC/MultiQC --last 10
    """
    token = get_github_token()
    config = PRODUCT_CONFIG[repo]

    # Validate mutually exclusive options
    options_count = sum([release is not None, from_ is not None, last is not None])
    if options_count == 0:
        console.print(
            "[red]Error:[/red] Must specify one of --release, --from/--to, or --last",
            style="bold",
        )
        sys.exit(1)
    if options_count > 1 and not (from_ and to and options_count == 1):
        # Allow --from and --to together
        if not (from_ is not None and to is not None and release is None and last is None):
            console.print(
                "[red]Error:[/red] Options --release, --from/--to, and --last are mutually exclusive",
                style="bold",
            )
            sys.exit(1)

    if (from_ and not to) or (to and not from_):
        console.print(
            "[red]Error:[/red] Both --from and --to must be specified together",
            style="bold",
        )
        sys.exit(1)

    console.print(
        Panel(
            f"[bold blue]{config['name']}[/bold blue] Changelog Generator",
            subtitle=f"Repository: {repo}",
        )
    )

    try:
        releases_to_process = []

        if release:
            # Fetch specific release
            with console.status(f"[bold green]Fetching release {release}..."):
                release_data = fetch_release_by_tag(repo, release, token)
                releases_to_process = [release_data]
                console.print(f"[green]✓[/green] Found release: {release_data['tag_name']}")

        elif from_ and to:
            # Fetch releases in date range
            with console.status("[bold green]Fetching releases..."):
                all_releases = fetch_releases(repo, token, per_page=100)

            # Filter by date range
            for rel in all_releases:
                release_date = datetime.fromisoformat(
                    rel["published_at"].replace("Z", "+00:00")
                ).replace(tzinfo=None)
                if from_ <= release_date <= to:
                    releases_to_process.append(rel)

            console.print(
                f"[green]✓[/green] Found {len(releases_to_process)} releases between "
                f"{from_.strftime('%Y-%m-%d')} and {to.strftime('%Y-%m-%d')}"
            )

        elif last:
            # Fetch last N releases
            with console.status(f"[bold green]Fetching last {last} releases..."):
                releases_to_process = fetch_releases(repo, token, per_page=last)[:last]
                console.print(f"[green]✓[/green] Found {len(releases_to_process)} releases")

        if not releases_to_process:
            console.print("[yellow]No releases found matching criteria[/yellow]")
            if json_output:
                Path(json_output).write_text("[]")
            sys.exit(0)

        # Sort releases by date (newest first) for consistent processing
        releases_to_process.sort(
            key=lambda r: r["published_at"],
            reverse=True,
        )

        # Filter out existing files unless --overwrite is set
        if not overwrite:
            output_base = Path(output_dir) if output_dir else Path(".")
            filtered_releases = []
            for rel in releases_to_process:
                output_path = output_base / get_output_path(repo, rel["tag_name"])
                # Check for both .md and .mdx extensions regardless of configured extension
                md_path = output_path.with_suffix(".md")
                mdx_path = output_path.with_suffix(".mdx")
                if output_path.exists():
                    console.print(f"[dim]Skipping {rel['tag_name']} - file exists: {output_path}[/dim]")
                elif md_path.exists():
                    console.print(f"[dim]Skipping {rel['tag_name']} - file exists: {md_path}[/dim]")
                elif mdx_path.exists():
                    console.print(f"[dim]Skipping {rel['tag_name']} - file exists: {mdx_path}[/dim]")
                else:
                    filtered_releases.append(rel)
            releases_to_process = filtered_releases

            if not releases_to_process:
                console.print("[yellow]No new releases to process (all files exist)[/yellow]")
                if json_output:
                    Path(json_output).write_text("[]")
                sys.exit(0)

        # Display releases to process
        table = Table(title="Releases to Process")
        table.add_column("Version", style="cyan")
        table.add_column("Date", style="green")
        table.add_column("Pre-release", style="yellow")

        for rel in releases_to_process:
            table.add_row(
                rel["tag_name"],
                format_date(rel["published_at"]),
                "Yes" if rel.get("prerelease") else "No",
            )

        console.print(table)
        console.print()

        if dry_run:
            console.print("[yellow]Dry run - no files will be written[/yellow]")
            console.print()

        # Process releases
        output_base = Path(output_dir) if output_dir else Path(".")
        generated_files = []

        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=console,
        ) as progress:
            task = progress.add_task(
                "[green]Generating changelogs...",
                total=len(releases_to_process),
            )

            for i, rel in enumerate(releases_to_process):
                version = rel["tag_name"]
                progress.update(task, description=f"[green]Processing {version}...")

                # Get previous version for comparison links (if available)
                prev_version = None
                if i + 1 < len(releases_to_process):
                    prev_version = releases_to_process[i + 1]["tag_name"]

                # Generate changelog content
                content = generate_changelog(rel, repo, prev_version)

                # Determine output path
                if output and len(releases_to_process) == 1:
                    output_path = Path(output)
                else:
                    output_path = output_base / get_output_path(repo, version)

                if dry_run:
                    console.print(f"  [dim]Would write:[/dim] {output_path}")
                else:
                    # Create directory if needed
                    output_path.parent.mkdir(parents=True, exist_ok=True)
                    output_path.write_text(content)
                    generated_files.append(output_path)

                progress.advance(task)

        # Summary
        console.print()
        if dry_run:
            console.print(
                Panel(
                    f"[bold yellow]Dry run complete[/bold yellow]\n"
                    f"Would generate {len(releases_to_process)} changelog file(s)",
                    title="Summary",
                )
            )
        else:
            console.print(
                Panel(
                    f"[bold green]Success![/bold green]\n"
                    f"Generated {len(generated_files)} changelog file(s)",
                    title="Summary",
                )
            )
            for f in generated_files:
                console.print(f"  [green]✓[/green] {f}")

        # Create PRs if requested
        prs_created = 0
        if create_pr and not dry_run and generated_files:
            console.print()
            console.print("[bold]Creating PRs for generated changelogs...[/bold]")
            console.print()

            for i, file_path in enumerate(generated_files):
                version = releases_to_process[i]["tag_name"]
                if create_pr_for_changelog(
                    file_path=file_path,
                    version=version,
                    product_name=config["name"],
                    source_repo=repo,
                    console=console,
                ):
                    prs_created += 1

            console.print()
            console.print(
                Panel(
                    f"[bold green]PRs Created: {prs_created}[/bold green]",
                    title="PR Summary",
                )
            )

        # Write JSON output for CI integration
        if json_output:
            output_data = [
                {
                    "version": releases_to_process[i]["tag_name"],
                    "file": str(generated_files[i]) if not dry_run else str(Path(output_dir or ".") / get_output_path(repo, releases_to_process[i]["tag_name"])),
                    "product": config["name"],
                }
                for i in range(len(releases_to_process))
            ]
            Path(json_output).write_text(json.dumps(output_data))
            console.print(f"[dim]JSON output written to: {json_output}[/dim]")

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            console.print(
                f"[red]Error:[/red] Release or repository not found: {e.response.url}",
                style="bold",
            )
        elif e.response.status_code == 401:
            console.print(
                "[red]Error:[/red] Authentication failed. Set GITHUB_TOKEN environment variable.",
                style="bold",
            )
        elif e.response.status_code == 403:
            console.print(
                "[red]Error:[/red] Access forbidden. Check your GITHUB_TOKEN has access to this repository.",
                style="bold",
            )
        else:
            console.print(f"[red]Error:[/red] GitHub API error: {e}", style="bold")
        sys.exit(1)
    except Exception as e:
        console.print(f"[red]Error:[/red] {e}", style="bold")
        sys.exit(1)


if __name__ == "__main__":
    main(auto_envvar_prefix="CHANGELOG")
