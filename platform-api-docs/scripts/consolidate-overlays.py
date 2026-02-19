#!/usr/bin/env python3
"""
Consolidate multiple overlay files into a single comprehensive overlay.
"""

import yaml
import sys
from pathlib import Path

def consolidate_overlays(overlay_files, output_file):
    """Consolidate multiple overlay files into one."""

    # Define the order of overlay application (critical for correct behavior)
    overlay_order = [
        # First: Structural fixes that remove/replace large sections
        "remove-google-lifesciences-overlay-1.102.0.yaml",
        "fix-duplicate-enums-overlay-1.102.0.yaml",
        "fix-duplicate-required-fields-overlay-1.102.0.yaml",

        # Second: Add missing global tags
        "add-identities-tag-1.102.0.yaml",

        # Third: Feature overlays (operations, parameters, schemas)
        "compute-envs-operations-overlay-1.102.0.yaml",
        "compute-envs-parameters-overlay-1.102.0.yaml",
        "compute-envs-schemas-overlay-1.102.0.yaml",
        "data-links-operations-overlay-1.102.0.yaml",
        "data-links-parameters-overlay-1.102.0.yaml",
        "workflows-operations-overlay-1.102.0.yaml",
        "workflows-parameters-overlay-1.102.0.yaml",
        "global-schemas-overlay-1.102.0.yaml",

        # Last: Manual field descriptions
        "manual-field-descriptions-overlay-1.102.0.yaml",
    ]

    all_actions = []

    # Process overlays in the specified order
    for overlay_name in overlay_order:
        overlay_path = Path("specs") / overlay_name

        if not overlay_path.exists():
            print(f"Warning: {overlay_name} not found, skipping...")
            continue

        print(f"Processing: {overlay_name}")

        with open(overlay_path, 'r') as f:
            overlay_data = yaml.safe_load(f)

        if 'actions' in overlay_data and overlay_data['actions']:
            all_actions.extend(overlay_data['actions'])
            print(f"  Added {len(overlay_data['actions'])} actions")

    # Create consolidated overlay
    consolidated = {
        'overlay': '1.0.0',
        'info': {
            'title': 'Consolidated overlay for Seqera Platform API v1.102.0',
            'version': '1.102.0'
        },
        'actions': all_actions
    }

    # Write consolidated overlay
    output_path = Path("specs") / output_file
    with open(output_path, 'w') as f:
        yaml.dump(consolidated, f, default_flow_style=False, sort_keys=False, width=1000)

    print(f"\nConsolidated overlay written to: {output_path}")
    print(f"Total actions: {len(all_actions)}")

    return str(output_path)

if __name__ == "__main__":
    overlay_files = [
        "remove-google-lifesciences-overlay-1.102.0.yaml",
        "fix-duplicate-enums-overlay-1.102.0.yaml",
        "fix-duplicate-required-fields-overlay-1.102.0.yaml",
        "add-identities-tag-1.102.0.yaml",
        "compute-envs-operations-overlay-1.102.0.yaml",
        "compute-envs-parameters-overlay-1.102.0.yaml",
        "compute-envs-schemas-overlay-1.102.0.yaml",
        "data-links-operations-overlay-1.102.0.yaml",
        "data-links-parameters-overlay-1.102.0.yaml",
        "workflows-operations-overlay-1.102.0.yaml",
        "workflows-parameters-overlay-1.102.0.yaml",
        "global-schemas-overlay-1.102.0.yaml",
        "manual-field-descriptions-overlay-1.102.0.yaml",
    ]

    output_file = "consolidated-overlay-1.102.0.yaml"

    consolidate_overlays(overlay_files, output_file)
