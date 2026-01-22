#!/usr/bin/env python3
"""
Validates OpenAPI overlay files for structural correctness and JSONPath syntax.
"""

import sys
import yaml
from pathlib import Path
from typing import List, Dict, Tuple

def validate_overlay_structure(overlay_path: Path) -> List[str]:
    """Validate basic overlay structure and required fields."""
    errors = []
    
    try:
        with open(overlay_path, 'r') as f:
            overlay = yaml.safe_load(f)
    except yaml.YAMLError as e:
        return [f"Invalid YAML syntax: {e}"]
    except FileNotFoundError:
        return [f"File not found: {overlay_path}"]
    
    # Check required top-level fields
    if not isinstance(overlay, dict):
        return ["Overlay must be a dictionary"]
    
    if overlay.get('overlay') != '1.0.0':
        errors.append("Missing or invalid 'overlay: 1.0.0' field")
    
    if 'info' not in overlay or not isinstance(overlay['info'], dict):
        errors.append("Missing 'info' section")
    else:
        if 'title' not in overlay['info']:
            errors.append("Missing 'info.title' field")
        if 'version' not in overlay['info']:
            errors.append("Missing 'info.version' field")
    
    if 'actions' not in overlay or not isinstance(overlay['actions'], list):
        errors.append("Missing or invalid 'actions' array")
        return errors
    
    # Validate each action
    for i, action in enumerate(overlay['actions']):
        if not isinstance(action, dict):
            errors.append(f"Action {i} is not a dictionary")
            continue
        
        if 'target' not in action:
            errors.append(f"Action {i} missing 'target' field")
        elif not validate_jsonpath(action['target']):
            errors.append(f"Action {i} has invalid JSONPath syntax: {action['target']}")
        
        if 'update' not in action and 'remove' not in action:
            errors.append(f"Action {i} must have either 'update' or 'remove' field")
    
    return errors

def validate_jsonpath(path: str) -> bool:
    """Basic validation of JSONPath syntax. Accepts dot notation, bracket notation, and mixed formats."""
    if not path.startswith('$'):
        return False

    # Check for common syntax errors
    if path.count('[') != path.count(']'):
        return False
    if path.count('{') != path.count('}'):
        return False

    # Check for valid OpenAPI root keys using flexible matching
    # Supports: $.paths, $["paths"], $.components.schemas, $["components"]["schemas"], etc.
    valid_root_keys = ['paths', 'components', 'servers', 'info', 'tags']

    # Check if any valid root key appears in the path
    # Handle both dot notation ($.paths) and bracket notation ($["paths"])
    has_valid_root = False
    for key in valid_root_keys:
        if f'.{key}' in path or f'["{key}"]' in path or f"['{key}']" in path:
            has_valid_root = True
            break

    if not has_valid_root:
        return False

    return True

def validate_documentation_standards(overlay_path: Path) -> List[str]:
    """Check overlay content against documentation standards."""
    warnings = []
    
    with open(overlay_path, 'r') as f:
        overlay = yaml.safe_load(f)
    
    for i, action in enumerate(overlay.get('actions', [])):
        if 'update' not in action:
            continue
        
        update_value = action['update']
        target = action.get('target', '')
        
        # Check summary standards
        if '.summary' in target and isinstance(update_value, str):
            # Should be sentence case
            if update_value and update_value[0].islower():
                warnings.append(f"Action {i}: Summary should start with capital letter: '{update_value}'")
            
            # Should NOT end with period
            if update_value.endswith('.'):
                warnings.append(f"Action {i}: Summary should NOT end with period: '{update_value}'")
        
        # Check description standards
        if '.description' in target and isinstance(update_value, str):
            # Should end with period
            if update_value and not update_value.endswith('.'):
                warnings.append(f"Action {i}: Description should end with period: '{update_value}'")
        
        # Check for common terminology issues
        if isinstance(update_value, str):
            if 'datalink' in update_value.lower() or 'data link' in update_value.lower():
                if 'data-link' not in update_value:
                    warnings.append(f"Action {i}: Use 'data-link' (not 'datalink' or 'data link')")
            
            if 'bucket path' in update_value.lower():
                warnings.append(f"Action {i}: Use 'resource path' instead of 'bucket path'")
    
    return warnings

def main():
    if len(sys.argv) < 2:
        print("Usage: validate_overlay.py <overlay-file>")
        sys.exit(1)
    
    overlay_path = Path(sys.argv[1])
    
    print(f"Validating {overlay_path.name}...")
    print()
    
    # Run structural validation
    errors = validate_overlay_structure(overlay_path)
    if errors:
        print("❌ ERRORS:")
        for error in errors:
            print(f"  - {error}")
        print()
    
    # Run standards validation
    warnings = validate_documentation_standards(overlay_path)
    if warnings:
        print("⚠️  WARNINGS (documentation standards):")
        for warning in warnings:
            print(f"  - {warning}")
        print()
    
    # Summary
    if errors:
        print(f"❌ Validation FAILED with {len(errors)} error(s)")
        sys.exit(1)
    elif warnings:
        print(f"⚠️  Validation PASSED with {len(warnings)} warning(s)")
        print("   (Warnings are suggestions, not blockers)")
        sys.exit(0)
    else:
        print("✅ Validation PASSED - No issues found!")
        sys.exit(0)

if __name__ == '__main__':
    main()
