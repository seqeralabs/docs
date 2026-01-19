#!/usr/bin/env python3
"""
Checks overlay files for consistency with Seqera API documentation standards.
"""

import sys
import yaml
from pathlib import Path
from typing import List, Dict, Tuple

# Standard terminology that must be used consistently
STANDARD_TERMS = {
    'workspaceId': 'Workspace numeric identifier.',
    'orgId': 'Organization numeric identifier.',
    'max': 'Maximum number of results to return.',
    'offset': 'Number of results to skip for pagination. Default: `0`.',
    'search': 'Search query to filter results.',
}

# Terms that should NOT be used (with recommended alternatives)
DEPRECATED_TERMS = {
    'datalink': 'data-link',
    'data link': 'data-link',
    'bucket path': 'resource path',
    'bucket URL': 'resource path',
    'List of': 'Array of',
}

def check_standard_parameters(overlay_path: Path) -> List[Tuple[str, str]]:
    """Check that standard parameters use consistent descriptions."""
    issues = []
    
    with open(overlay_path, 'r') as f:
        overlay = yaml.safe_load(f)
    
    for i, action in enumerate(overlay.get('actions', [])):
        target = action.get('target', '')
        update = action.get('update', '')
        
        # Check for standard parameter names
        for param_name, standard_desc in STANDARD_TERMS.items():
            if f"[?(@.name=='{param_name}')]" in target or f".{param_name}" in target:
                if isinstance(update, str) and update != standard_desc:
                    issues.append((
                        f"Action {i}",
                        f"Parameter '{param_name}' description should be: '{standard_desc}'\n"
                        f"          Found: '{update}'"
                    ))
    
    return issues

def check_deprecated_terminology(overlay_path: Path) -> List[Tuple[str, str]]:
    """Check for deprecated terminology."""
    issues = []
    
    with open(overlay_path, 'r') as f:
        content = f.read()
        overlay = yaml.safe_load(content)
    
    for i, action in enumerate(overlay.get('actions', [])):
        update = action.get('update', '')
        
        if isinstance(update, str):
            for deprecated, recommended in DEPRECATED_TERMS.items():
                if deprecated.lower() in update.lower():
                    issues.append((
                        f"Action {i}",
                        f"Found deprecated term '{deprecated}' - use '{recommended}' instead\n"
                        f"          In: '{update}'"
                    ))
    
    return issues

def check_sentence_formatting(overlay_path: Path) -> List[Tuple[str, str]]:
    """Check sentence formatting rules."""
    issues = []
    
    with open(overlay_path, 'r') as f:
        overlay = yaml.safe_load(f)
    
    for i, action in enumerate(overlay.get('actions', [])):
        target = action.get('target', '')
        update = action.get('update', '')
        
        if not isinstance(update, str):
            continue
        
        # Summaries should be sentence case, no period
        if '.summary' in target:
            if update and update[0].islower():
                issues.append((
                    f"Action {i}",
                    f"Summary should start with capital letter: '{update}'"
                ))
            if update.endswith('.'):
                issues.append((
                    f"Action {i}",
                    f"Summary should NOT end with period: '{update}'"
                ))
        
        # Descriptions should end with period
        if '.description' in target:
            if update and not update.endswith('.'):
                issues.append((
                    f"Action {i}",
                    f"Description should end with period: '{update}'"
                ))
        
        # Parameter descriptions should end with period
        if 'parameters' in target and '.description' in target:
            if update and not update.endswith('.'):
                issues.append((
                    f"Action {i}",
                    f"Parameter description should end with period: '{update}'"
                ))
    
    return issues

def check_verb_entity_pattern(overlay_path: Path) -> List[Tuple[str, str]]:
    """Check that operation summaries follow [Verb] [entity] pattern."""
    issues = []
    
    common_verbs = ['List', 'Get', 'Create', 'Update', 'Delete', 'Add', 'Remove', 
                    'Describe', 'Validate', 'Execute', 'Cancel', 'Restart', 'Signal']
    
    with open(overlay_path, 'r') as f:
        overlay = yaml.safe_load(f)
    
    for i, action in enumerate(overlay.get('actions', [])):
        target = action.get('target', '')
        update = action.get('update', '')
        
        if '.summary' in target and isinstance(update, str):
            # Check if it starts with a common verb
            starts_with_verb = any(update.startswith(verb) for verb in common_verbs)
            
            if not starts_with_verb and update:
                issues.append((
                    f"Action {i}",
                    f"Summary should follow [Verb] [entity] pattern: '{update}'\n"
                    f"          Common verbs: {', '.join(common_verbs[:5])}, ..."
                ))
    
    return issues

def main():
    if len(sys.argv) < 2:
        print("Usage: check_consistency.py <overlay-file>")
        sys.exit(1)
    
    overlay_path = Path(sys.argv[1])
    
    if not overlay_path.exists():
        print(f"❌ File not found: {overlay_path}")
        sys.exit(1)
    
    print(f"Checking consistency for {overlay_path.name}...")
    print()
    
    all_issues = []
    
    # Run all checks
    checks = [
        ("Standard Parameters", check_standard_parameters),
        ("Deprecated Terminology", check_deprecated_terminology),
        ("Sentence Formatting", check_sentence_formatting),
        ("Verb-Entity Pattern", check_verb_entity_pattern),
    ]
    
    for check_name, check_func in checks:
        issues = check_func(overlay_path)
        if issues:
            all_issues.extend(issues)
            print(f"⚠️  {check_name}:")
            for location, message in issues:
                print(f"  [{location}] {message}")
            print()
    
    # Summary
    if all_issues:
        print(f"⚠️  Found {len(all_issues)} consistency issue(s)")
        print("   Review and update overlay file to match standards")
        sys.exit(1)
    else:
        print("✅ All consistency checks PASSED!")
        sys.exit(0)

if __name__ == '__main__':
    main()
