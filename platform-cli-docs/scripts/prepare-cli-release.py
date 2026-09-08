#!/usr/bin/env python3
"""Download a tower-cli release, verify it, and extract resolved picocli metadata."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


API_ROOT = "https://api.github.com/repos/seqeralabs/tower-cli"
JAR_ASSET = "tw-jar.jar"
CHECKSUM_ASSET = "checksums_sha256.txt"
EXTRACTOR_CLASS = "io.seqera.docs.cli.CliMetadataExtractor"


def request(url: str, *, accept: str = "application/vnd.github+json") -> bytes:
    headers = {
        "Accept": accept,
        "User-Agent": "seqeralabs-docs-cli-extractor",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=60) as response:
        return response.read()


def get_json(url: str) -> dict[str, Any]:
    return json.loads(request(url))


def resolve_release(tag_name: str | None, release_id: str | None, retries: int = 6) -> dict[str, Any]:
    if release_id:
        url = f"{API_ROOT}/releases/{urllib.parse.quote(str(release_id), safe='')}"
    elif tag_name:
        url = f"{API_ROOT}/releases/tags/{urllib.parse.quote(tag_name, safe='')}"
    else:
        url = f"{API_ROOT}/releases/latest"

    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            release = get_json(url)
            if tag_name and release.get("tag_name") != tag_name:
                raise ValueError(
                    f"Release payload mismatch: requested {tag_name!r}, API returned {release.get('tag_name')!r}"
                )
            if release.get("draft"):
                raise ValueError(f"Release {release.get('tag_name')} is still a draft")
            return release
        except (urllib.error.HTTPError, urllib.error.URLError, ValueError) as error:
            last_error = error
            if attempt + 1 == retries:
                break
            time.sleep(min(2**attempt, 15))
    raise RuntimeError(f"Unable to resolve tower-cli release: {last_error}")


def release_assets(release: dict[str, Any], retries: int = 6) -> dict[str, dict[str, Any]]:
    tag_name = release["tag_name"]
    for attempt in range(retries):
        assets = {asset["name"]: asset for asset in release.get("assets", [])}
        if JAR_ASSET in assets and CHECKSUM_ASSET in assets:
            return assets
        if attempt + 1 < retries:
            time.sleep(min(2**attempt, 15))
            release = resolve_release(tag_name, None, retries=1)
    missing = sorted({JAR_ASSET, CHECKSUM_ASSET} - set(assets))
    raise RuntimeError(f"Release {tag_name} is missing required assets: {', '.join(missing)}")


def download_asset(asset: dict[str, Any], destination: Path) -> None:
    destination.write_bytes(request(asset["browser_download_url"], accept="application/octet-stream"))


def expected_checksum(checksums_path: Path, asset_name: str) -> str:
    for line in checksums_path.read_text().splitlines():
        fields = line.strip().split()
        if len(fields) >= 2 and fields[-1].lstrip("*") == asset_name:
            checksum = fields[0].lower()
            if re.fullmatch(r"[0-9a-f]{64}", checksum):
                return checksum
    raise RuntimeError(f"No SHA-256 checksum found for {asset_name} in {checksums_path.name}")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def download_verified_release(release: dict[str, Any], destination: Path) -> tuple[Path, str]:
    destination.mkdir(parents=True, exist_ok=True)
    assets = release_assets(release)
    checksums_path = destination / CHECKSUM_ASSET
    jar_path = destination / JAR_ASSET
    download_asset(assets[CHECKSUM_ASSET], checksums_path)
    download_asset(assets[JAR_ASSET], jar_path)

    expected = expected_checksum(checksums_path, JAR_ASSET)
    actual = sha256(jar_path)
    if actual != expected:
        raise RuntimeError(f"SHA-256 mismatch for {release['tag_name']} {JAR_ASSET}: {actual} != {expected}")
    return jar_path, actual


def compile_extractor(jar_path: Path, classes_dir: Path) -> None:
    javac = shutil.which("javac")
    if not javac:
        raise RuntimeError("javac is required; configure Java 21 before running this script")

    source_root = Path(__file__).resolve().parent / "java"
    sources = sorted(source_root.rglob("*.java"))
    if not sources:
        raise RuntimeError(f"No Java extractor sources found under {source_root}")

    classes_dir.mkdir(parents=True, exist_ok=True)
    # The released fat JAR provides picocli, Jackson, and the Tower command classes.
    # Compile separately against each compared release to avoid coupling to its library versions.
    subprocess.run(
        [javac, "-encoding", "UTF-8", "-cp", str(jar_path), "-d", str(classes_dir), *map(str, sources)],
        check=True,
    )


def extraction_environment(work_dir: Path) -> dict[str, str]:
    safe_home = work_dir / "extractor-home"
    safe_home.mkdir(parents=True, exist_ok=True)
    allowed = ("JAVA_HOME", "LANG", "LC_ALL", "PATH", "TMPDIR")
    environment = {name: os.environ[name] for name in allowed if os.environ.get(name)}
    environment["HOME"] = str(safe_home)
    return environment


def extract_metadata(jar_path: Path, classes_dir: Path, tag_name: str, output_path: Path, work_dir: Path) -> None:
    java = shutil.which("java")
    if not java:
        raise RuntimeError("java is required; configure Java 21 before running this script")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    command = [
        java,
        f"-Duser.home={work_dir / 'extractor-home'}",
        "-cp",
        os.pathsep.join((str(classes_dir), str(jar_path))),
        EXTRACTOR_CLASS,
        tag_name,
    ]
    with output_path.open("wb") as output:
        subprocess.run(
            command,
            check=True,
            stdout=output,
            stderr=sys.stderr,
            env=extraction_environment(work_dir),
        )
    parsed = json.loads(output_path.read_text())
    if parsed.get("metadata", {}).get("cli_version") != tag_name:
        raise RuntimeError(f"Extractor produced invalid metadata for {tag_name}")
    if not parsed.get("hierarchy", {}).get("children"):
        raise RuntimeError(f"Extractor found no visible commands for {tag_name}")


def write_github_output(path: Path, values: dict[str, str]) -> None:
    with path.open("a") as output:
        for key, value in values.items():
            print(f"{key}={value}", file=output)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tag-name", help="Release tag to resolve; defaults to the latest stable release")
    parser.add_argument("--release-id", help="GitHub release ID supplied by the dispatch event")
    parser.add_argument("--previous-tag", help="Previously documented release tag to extract for comparison")
    parser.add_argument("--require-stable", action="store_true", help="Reject prereleases")
    parser.add_argument("--work-dir", type=Path, required=True)
    parser.add_argument("--github-output", type=Path, help="Write selected release fields as step outputs")
    args = parser.parse_args()

    work_dir = args.work_dir.resolve()
    work_dir.mkdir(parents=True, exist_ok=True)
    release = resolve_release(args.tag_name, args.release_id)
    tag_name = release["tag_name"]
    if args.require_stable and release.get("prerelease"):
        raise RuntimeError(f"Refusing prerelease {tag_name}; automatic documentation PRs are stable-only")

    current_dir = work_dir / "current"
    current_jar, current_sha = download_verified_release(release, current_dir)
    classes_dir = work_dir / "extractor-classes-current"
    compile_extractor(current_jar, classes_dir)
    current_metadata = work_dir / "cli-metadata-current.json"
    extract_metadata(current_jar, classes_dir, tag_name, current_metadata, work_dir)

    previous_metadata = ""
    if args.previous_tag and args.previous_tag != tag_name:
        previous_release = resolve_release(args.previous_tag, None)
        if previous_release.get("prerelease"):
            raise RuntimeError(f"Previously documented release {args.previous_tag} is a prerelease")
        previous_jar, _ = download_verified_release(previous_release, work_dir / "previous")
        previous_path = work_dir / "cli-metadata-previous.json"
        previous_classes_dir = work_dir / "extractor-classes-previous"
        compile_extractor(previous_jar, previous_classes_dir)
        extract_metadata(previous_jar, previous_classes_dir, args.previous_tag, previous_path, work_dir)
        previous_metadata = str(previous_path)

    release_record = {
        "tag_name": tag_name,
        "release_id": release["id"],
        "published_at": release.get("published_at"),
        "html_url": release.get("html_url"),
        "jar_sha256": current_sha,
        "metadata_schema_version": "1",
    }
    (work_dir / "release.json").write_text(json.dumps(release_record, indent=2) + "\n")

    values = {
        "tag_name": tag_name,
        "version": tag_name.removeprefix("v"),
        "release_id": str(release["id"]),
        "published_at": release.get("published_at") or "",
        "prerelease": str(bool(release.get("prerelease"))).lower(),
        "branch_ref": re.sub(r"[^0-9A-Za-z._-]+", "-", tag_name).strip("-") or "release",
        "metadata_path": str(current_metadata),
        "previous_metadata_path": previous_metadata,
        "release_record_path": str(work_dir / "release.json"),
        "jar_sha256": current_sha,
    }
    if args.github_output:
        write_github_output(args.github_output, values)
    print(json.dumps(values, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
