#!/usr/bin/env python3
"""
Updates the custom sidebar.js file with new operation entries based on analysis.
"""

import sys
import json
import re
from pathlib import Path
from typing import Dict, List

def parse_sidebar_js(sidebar_path: Path) -> tuple[str, Dict]:
    """Parse the sidebar.js file and extract category structure."""
    with open(sidebar_path, 'r') as f:
        content = f.read()
    
    # Extract the items array structure
    # This is a simplified parser - assumes consistent formatting
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
    
    return content, categories

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
    # This mapping should match your sidebar categories
    tag_to_category = {
        'actions': 'Actions',
        'compute-envs': 'Compute environments',
        'credentials': 'Credentials',
        'datasets': 'Datasets',
        'data-links': 'Data-links',
        'pipelines': 'Pipelines',
        'workflows': 'Workflows',
        'orgs': 'Organizations',
        'workspaces': 'Workspaces',
        'teams': 'Teams',
        'users': 'Users',
        'trace': 'Trace',
        'studios': 'Studios',
        'tokens': 'Tokens',
        'labels': 'Labels',
        'avatars': 'Avatars',
        'ga4gh': 'GA4GH',
        'launch': 'Launch',
        'platforms': 'Platforms',
        'service-info': 'Service info',
        'pipeline-secrets': 'Pipeline secrets',
    }
    
    return tag_to_category.get(tag, tag.title())

def main():
    if len(sys.argv) < 3:
        print("Usage: update_sidebar.py <sidebar.js> <analysis.json>")
        sys.exit(1)
    
    sidebar_path = Path(sys.argv[1])
    analysis_path = Path(sys.argv[2])
    
    if not sidebar_path.exists():
        print(f"❌ Sidebar file not found: {sidebar_path}")
        sys.exit(1)
    
    if not analysis_path.exists():
        print(f"❌ Analysis file not found: {analysis_path}")
        sys.exit(1)
    
    # Load analysis
    with open(analysis_path, 'r') as f:
        analysis = json.load(f)
    
    print(f"Updating sidebar with {analysis['summary']['total_new_endpoints']} new endpoints...\n")
    
    # Parse sidebar
    content, categories = parse_sidebar_js(sidebar_path)
    
    print(f"Found {len(categories)} categories in sidebar:")
    for cat_name in categories.keys():
        print(f"  - {cat_name}")
    print()
    
    # Group new endpoints by category
    new_entries = {}
    unknown_categories = []
    
    for tag, info in analysis['by_tag'].items():
        if not info['endpoints']:
            continue
        
        category_name = map_tag_to_category(tag)
        
        if category_name not in categories:
            unknown_categories.append((tag, category_name, info['endpoints']))
            continue
        
        new_entries[category_name] = info['endpoints']
    
    # Update sidebar
    if new_entries:
        modified_content = insert_entries_into_categories(content, categories, new_entries)
        
        # Write backup
        backup_path = sidebar_path.with_suffix('.js.backup')
        with open(backup_path, 'w') as f:
            f.write(content)
        print(f"✅ Created backup: {backup_path}")
        
        # Write updated sidebar
        with open(sidebar_path, 'w') as f:
            f.write(modified_content)
        print(f"✅ Updated sidebar: {sidebar_path}")
        
        # Print summary
        print(f"\nAdded entries to categories:")
        for category_name, entries in new_entries.items():
            print(f"  - {category_name}: {len(entries)} new operations")
    
    # Report unknown categories
    if unknown_categories:
        print("\n⚠️  MANUAL INTERVENTION REQUIRED:")
        print("The following endpoints belong to categories not found in the sidebar:\n")
        
        for tag, category_name, endpoints in unknown_categories:
            print(f"Category: {category_name} (tag: {tag})")
            for endpoint in endpoints:
                print(f"  - {endpoint['method']} {endpoint['endpoint']}")
                entry_str = generate_sidebar_entry(endpoint)
                print(f"    Suggested entry:\n    {entry_str}")
            print()
        
        print("You'll need to manually create these categories in the sidebar.")

if __name__ == '__main__':
    main()
