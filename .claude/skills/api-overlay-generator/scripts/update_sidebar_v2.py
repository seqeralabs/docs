#!/usr/bin/env python3
"""
Updates the custom sidebar.js file with new operation entries based on analysis.
Enhanced with rename detection to catch when doc IDs change.
"""

import sys
import json
import re
import argparse
from pathlib import Path
from typing import Dict, List, Tuple
from difflib import SequenceMatcher

def parse_sidebar_js(sidebar_path: Path) -> tuple[str, Dict, List[str]]:
    """Parse the sidebar.js file and extract category structure + all doc IDs."""
    with open(sidebar_path, 'r') as f:
        content = f.read()

    # Extract all doc IDs from the sidebar
    all_doc_ids = []
    doc_id_pattern = r'type:\s*"doc",\s*id:\s*"([^"]+)"'
    for match in re.finditer(doc_id_pattern, content):
        all_doc_ids.append(match.group(1))

    # Extract the items array structure
    categories = {}

    # Find all category blocks
    category_pattern = r'{\s*type:\s*"category",\s*label:\s*"([^"]+)",\s*link:\s*{[^}]+},\s*items:\s*\[(.*?)\]'

    for match in re.finditer(category_pattern, content, re.DOTALL):
        category_name = match.group(1)
        items_str = match.group(2)

        # Parse items within category
        item_pattern = r'{\s*type:\s*"doc",\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*className:\s*"([^"]+)"\s*}'
        items = []

        for item_match in re.finditer(item_pattern, items_str):
            items.append({
                'id': item_match.group(1),
                'label': item_match.group(2),
                'className': item_match.group(3)
            })

        categories[category_name] = {
            'items': items,
            'full_match': match.group(0),
            'items_content': items_str
        }

    return content, categories, all_doc_ids

def get_available_docs(docs_dir: Path) -> List[str]:
    """Get list of all available .api.mdx doc files."""
    docs = []
    for mdx_file in docs_dir.glob("*.api.mdx"):
        # Remove .api.mdx suffix to get doc ID
        doc_id = mdx_file.stem.replace('.api', '')
        docs.append(doc_id)
    return sorted(docs)

def find_similarity(str1: str, str2: str) -> float:
    """Calculate similarity between two strings (0.0 to 1.0)."""
    return SequenceMatcher(None, str1, str2).ratio()

def detect_rename_patterns(missing_id: str, available_docs: List[str]) -> List[Tuple[str, float, str]]:
    """
    Find potential renames for a missing doc ID.
    Returns: [(suggested_id, similarity_score, reason), ...]
    """
    suggestions = []

    for doc_id in available_docs:
        similarity = find_similarity(missing_id, doc_id)

        # Check for common rename patterns
        reason = None
        bonus = 0.0

        # Pattern: "-1" suffix → "-with-path" suffix
        if missing_id.endswith('-1') and doc_id == missing_id[:-2] + '-with-path':
            reason = "Pattern: '-1' → '-with-path'"
            bonus = 0.2

        # Pattern: "-2" suffix → "-with-path" suffix
        elif missing_id.endswith('-2') and doc_id == missing_id[:-2] + '-with-path':
            reason = "Pattern: '-2' → '-with-path'"
            bonus = 0.2

        # Pattern: same prefix, different suffix
        elif similarity > 0.7:
            # Find common prefix
            common_prefix = ''
            for i, (c1, c2) in enumerate(zip(missing_id, doc_id)):
                if c1 == c2:
                    common_prefix += c1
                else:
                    break

            if len(common_prefix) > len(missing_id) * 0.7:  # 70% common prefix
                reason = f"Common prefix: '{common_prefix}'"

        # Add to suggestions if similarity is high enough
        adjusted_similarity = similarity + bonus
        if adjusted_similarity > 0.6:  # Threshold
            suggestions.append((doc_id, adjusted_similarity, reason or "High similarity"))

    # Sort by similarity score (descending)
    suggestions.sort(key=lambda x: x[1], reverse=True)

    return suggestions[:3]  # Top 3 suggestions

def validate_sidebar_docs(all_doc_ids: List[str], available_docs: List[str]) -> Dict:
    """
    Validate that all sidebar doc IDs exist as generated docs.
    Returns: {
        'valid': [...],
        'missing': [...],
        'suggestions': {missing_id: [(suggested_id, score, reason), ...]}
    }
    """
    available_set = set(available_docs)
    valid = []
    missing = []
    suggestions = {}

    for doc_id in all_doc_ids:
        # Skip info/* pages as they're manually maintained
        if doc_id.startswith('info/'):
            continue

        if doc_id in available_set:
            valid.append(doc_id)
        else:
            missing.append(doc_id)
            # Find suggestions for missing docs
            doc_suggestions = detect_rename_patterns(doc_id, available_docs)
            if doc_suggestions:
                suggestions[doc_id] = doc_suggestions

    return {
        'valid': valid,
        'missing': missing,
        'suggestions': suggestions
    }

def apply_renames(content: str, renames: Dict[str, str]) -> str:
    """Apply doc ID renames to sidebar content."""
    modified_content = content

    for old_id, new_id in renames.items():
        # Replace within doc entries: id: "old-id" → id: "new-id"
        pattern = rf'(id:\s*")({re.escape(old_id)})(")'
        replacement = rf'\1{new_id}\3'
        modified_content = re.sub(pattern, replacement, modified_content)

    return modified_content

def generate_sidebar_entry(endpoint_info: Dict) -> str:
    """Generate a sidebar entry for a new endpoint."""
    # Convert operation ID to kebab-case for doc ID
    operation_id = endpoint_info['operation_id']
    doc_id = re.sub(r'(?<!^)(?=[A-Z])', '-', operation_id).lower()

    # Get label from summary or operation ID
    label = endpoint_info.get('summary') or operation_id

    # Determine className based on HTTP method
    method = endpoint_info['method'].lower()

    entry = f'        {{ type: "doc", id: "{doc_id}", label: "{label}", className: "api-method {method}" }}'

    return entry

def insert_entries_into_categories(content: str, categories: Dict, new_entries: Dict[str, List[Dict]]) -> str:
    """Insert new entries into their respective categories."""
    modified_content = content

    for category_name, entries in new_entries.items():
        if category_name not in categories:
            print(f"⚠️  Category '{category_name}' not found in sidebar - manual addition required")
            continue

        category_info = categories[category_name]
        old_items_content = category_info['items_content']

        # Generate new item entries
        new_item_entries = [generate_sidebar_entry(entry) for entry in entries]

        # Combine with existing items
        new_items_content = old_items_content.rstrip()
        if new_items_content and not new_items_content.endswith(','):
            new_items_content += ','

        for entry_str in new_item_entries:
            new_items_content += '\n' + entry_str + ','

        # Replace in content
        modified_content = modified_content.replace(
            category_info['full_match'],
            category_info['full_match'].replace(old_items_content, new_items_content)
        )

    return modified_content

def map_tag_to_category(tag: str) -> str:
    """Map API tag to sidebar category name."""
    tag_to_category = {
        'actions': 'Actions',
        'compute-envs': 'Compute',
        'credentials': 'Credentials',
        'datasets': 'Datasets',
        'data-links': 'Data Explorer',
        'pipelines': 'Pipelines',
        'workflows': 'Pipeline runs (workflows)',
        'orgs': 'Organizations',
        'workspaces': 'Workspaces',
        'teams': 'Teams',
        'users': 'Users',
        'trace': 'Workflow trace',
        'studios': 'Studios',
        'tokens': 'Tokens',
        'labels': 'Labels',
        'avatars': 'Avatars',
        'ga4gh': 'GA4GH-WES',
        'launch': 'Launch',
        'platforms': 'Platforms',
        'service-info': 'Service info',
        'pipeline-secrets': 'Secrets',
    }

    return tag_to_category.get(tag, tag.title())

def main():
    parser = argparse.ArgumentParser(
        description='Update sidebar.js with new API operations and detect renamed docs'
    )
    parser.add_argument('sidebar', help='Path to sidebar.js file')
    parser.add_argument('analysis', help='Path to analysis.json file')
    parser.add_argument('--validate', action='store_true',
                        help='Validate existing sidebar entries against generated docs')
    parser.add_argument('--auto-fix-renames', action='store_true',
                        help='Automatically fix detected renames (uses best match)')
    parser.add_argument('--docs-dir', help='Path to docs directory (default: ../docs)',
                        default=None)

    args = parser.parse_args()

    sidebar_path = Path(args.sidebar)
    analysis_path = Path(args.analysis)

    # Determine docs directory
    if args.docs_dir:
        docs_dir = Path(args.docs_dir)
    else:
        # Default: sidebar is in docs/sidebar/sidebar.js, docs are in docs/
        docs_dir = sidebar_path.parent.parent

    if not sidebar_path.exists():
        print(f"❌ Sidebar file not found: {sidebar_path}")
        sys.exit(1)

    if not analysis_path.exists():
        print(f"❌ Analysis file not found: {analysis_path}")
        sys.exit(1)

    # Load analysis
    with open(analysis_path, 'r') as f:
        analysis = json.load(f)

    # Parse sidebar
    content, categories, all_doc_ids = parse_sidebar_js(sidebar_path)

    # Validate existing entries if requested
    if args.validate or args.auto_fix_renames:
        print("\n🔍 Validating existing sidebar entries...\n")

        available_docs = get_available_docs(docs_dir)
        validation = validate_sidebar_docs(all_doc_ids, available_docs)

        print(f"✅ Found {len(validation['valid'])} valid doc IDs")

        if validation['missing']:
            print(f"\n⚠️  MISSING DOC IDs ({len(validation['missing'])}):\n")

            renames_to_apply = {}

            for missing_id in validation['missing']:
                suggestions = validation['suggestions'].get(missing_id, [])

                if suggestions:
                    best_match, score, reason = suggestions[0]
                    print(f"  • {missing_id}")
                    print(f"    → Suggestion: {best_match} ({score*100:.0f}% match - {reason})")

                    if args.auto_fix_renames and score >= 0.8:  # High confidence threshold
                        renames_to_apply[missing_id] = best_match
                        print(f"    ✓ Will auto-fix")

                    # Show other suggestions
                    for alt_match, alt_score, alt_reason in suggestions[1:]:
                        print(f"      Alternative: {alt_match} ({alt_score*100:.0f}% match)")
                else:
                    print(f"  • {missing_id}")
                    print(f"    → No suggestions found")

                print()

            if args.auto_fix_renames and renames_to_apply:
                print(f"\n🔧 Applying {len(renames_to_apply)} renames...\n")
                content = apply_renames(content, renames_to_apply)

                for old_id, new_id in renames_to_apply.items():
                    print(f"  ✓ {old_id} → {new_id}")
            elif not args.auto_fix_renames and validation['suggestions']:
                print("\n💡 Run with --auto-fix-renames to apply high-confidence renames automatically.\n")

    # Add new entries (existing functionality)
    print(f"\n📝 Processing {analysis.get('summary', {}).get('total_new_endpoints', 0)} new endpoints...\n")

    # Group new endpoints by category
    new_entries = {}
    unknown_categories = []

    for tag, info in analysis.get('by_tag', {}).items():
        if not info.get('endpoints'):
            continue

        category_name = map_tag_to_category(tag)

        if category_name not in categories:
            unknown_categories.append((tag, category_name, info['endpoints']))
            continue

        new_entries[category_name] = info['endpoints']

    # Update sidebar with new entries
    if new_entries:
        content = insert_entries_into_categories(content, categories, new_entries)

        print(f"Added entries to categories:")
        for category_name, entries in new_entries.items():
            print(f"  • {category_name}: {len(entries)} new operations")

    # Write updated sidebar
    if args.validate or args.auto_fix_renames or new_entries:
        # Create backup
        backup_path = sidebar_path.with_suffix('.js.backup')
        with open(backup_path, 'w') as f:
            with open(sidebar_path, 'r') as orig:
                f.write(orig.read())
        print(f"\n✅ Created backup: {backup_path}")

        # Write updated sidebar
        with open(sidebar_path, 'w') as f:
            f.write(content)
        print(f"✅ Updated sidebar: {sidebar_path}")

    # Report unknown categories
    if unknown_categories:
        print("\n⚠️  MANUAL INTERVENTION REQUIRED:")
        print("The following endpoints belong to categories not found in the sidebar:\n")

        for tag, category_name, endpoints in unknown_categories:
            print(f"Category: {category_name} (tag: {tag})")
            for endpoint in endpoints:
                print(f"  • {endpoint['method']} {endpoint['endpoint']}")
                entry_str = generate_sidebar_entry(endpoint)
                print(f"    Suggested entry:\n    {entry_str}")
            print()

        print("You'll need to manually create these categories in the sidebar.")

if __name__ == '__main__':
    main()
