from __future__ import annotations

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


SCRIPTS = Path(__file__).resolve().parents[1]


def load_script(module_name: str, filename: str):
    spec = importlib.util.spec_from_file_location(module_name, SCRIPTS / filename)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


generator = load_script("cli_docs_generator", "generate-cli-docs.py")
comparison = load_script("cli_docs_comparison", "compare-metadata.py")
release_apply = load_script("cli_docs_release_apply", "apply-cli-release.py")
release_prepare = load_script("cli_docs_release_prepare", "prepare-cli-release.py")


def metadata(tag: str = "v1.2.3", include_child: bool = True) -> dict:
    children = []
    if include_child:
        children.append(
            {
                "name": "list",
                "full_command": "tw widgets list",
                "description": "List widgets.",
                "options": [
                    {
                        "names": ["-w", "--workspace"],
                        "description": "Workspace identifier.",
                        "required": False,
                        "default_value": None,
                    }
                ],
                "positionals": [],
                "children": [
                    {
                        "name": "json",
                        "full_command": "tw widgets list json",
                        "description": "List widgets as JSON.",
                        "options": [],
                        "positionals": [],
                        "children": [],
                    }
                ],
            }
        )
    return {
        "metadata": {"schema_version": "1", "cli_version": tag},
        "hierarchy": {
            "name": "tw",
            "full_command": "tw",
            "description": "CLI.",
            "options": [],
            "positionals": [],
            "children": [
                {
                    "name": "widgets",
                    "full_command": "tw widgets",
                    "description": "Manage widgets.",
                    "options": [],
                    "positionals": [],
                    "children": children,
                }
            ],
        },
    }


class GeneratorTests(unittest.TestCase):
    def test_generation_is_recursive_preserves_overlay_and_removes_stale_pages(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            metadata_path = root / "metadata.json"
            metadata_path.write_text(json.dumps(metadata()))
            overlays = root / "overlays"
            overlays.mkdir()
            (overlays / "tw-widgets-list.md").write_text("#### Example\n\nVerified example.")
            output = root / "reference"
            output.mkdir()
            (output / "stale.md").write_text("stale")
            sidebar = root / "sidebar.js"

            generator.generate_all_docs(metadata_path, overlays, output, sidebar)

            page = (output / "widgets.md").read_text()
            self.assertIn("## `tw widgets list`", page)
            self.assertIn("### `tw widgets list json`", page)
            self.assertIn("Verified example.", page)
            self.assertIn("`-w`, `--workspace`", page)
            self.assertFalse((output / "stale.md").exists())
            self.assertIn('id: "reference/widgets"', sidebar.read_text())

    def test_stale_overlay_fails_generation(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            metadata_path = root / "metadata.json"
            metadata_path.write_text(json.dumps(metadata()))
            overlays = root / "overlays"
            overlays.mkdir()
            (overlays / "tw-removed-command.md").write_text("Stale")
            with self.assertRaisesRegex(ValueError, "do not match a visible command path"):
                generator.generate_all_docs(metadata_path, overlays, root / "reference")

    def test_mdx_sensitive_angle_brackets_are_escaped_outside_code(self):
        self.assertEqual(
            generator.prose_text("Use <hash>, {PROJECT}, or source <(tw cmd)"),
            "Use &lt;hash&gt;, &#123;PROJECT&#125;, or source &lt;(tw cmd)",
        )
        self.assertIn("<VALUE>", generator.syntax({"positionals": [{"param_label": "VALUE", "required": True}]}, "tw cmd"))


class ComparisonTests(unittest.TestCase):
    def test_reports_command_and_option_changes(self):
        old = metadata("v1.2.2", include_child=False)
        new = metadata("v1.2.3", include_child=True)
        report = comparison.compare(old, new)
        self.assertIn("Added commands: 2", report)
        self.assertIn("`tw widgets list`", report)
        self.assertIn("Required review", report)


class ReleaseMarkerTests(unittest.TestCase):
    def test_notice_update_is_idempotent(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "page.md"
            path.write_text("---\ntitle: Test\n---\n\nBody.\n")
            release_apply.update_notice(path, "v1.2.3")
            release_apply.update_notice(path, "v1.2.4")
            content = path.read_text()
            self.assertEqual(content.count(release_apply.START), 1)
            self.assertIn("**1.2.4**", content)
            self.assertNotIn("**1.2.3**", content)


class ReleaseVerificationTests(unittest.TestCase):
    def test_checksum_parser_selects_exact_asset(self):
        with tempfile.TemporaryDirectory() as directory:
            checksums = Path(directory) / "checksums_sha256.txt"
            checksums.write_text(
                "a" * 64 + "  tw-linux-x86_64\n" + "b" * 64 + "  tw-jar.jar\n"
            )
            self.assertEqual(release_prepare.expected_checksum(checksums, "tw-jar.jar"), "b" * 64)


if __name__ == "__main__":
    unittest.main()
