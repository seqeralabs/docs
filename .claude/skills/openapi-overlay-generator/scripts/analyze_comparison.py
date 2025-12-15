#!/usr/bin/env python3
"""
Analyzes a Speakeasy comparison overlay to identify and categorize API changes.
"""

import sys
import yaml
import json
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Set

def normalize_jsonpath(target: str) -> str:
    """Convert bracket notation to dot notation for easier parsing."""
    import re
    # Convert $["key"] to $.key and $["key"]["subkey"] to $.key.subkey
    # Handle both string keys and wildcards
    normalized = target
    normalized = re.sub(r'\["\*"\]', '[*]', normalized)  # Preserve wildcards
    normalized = re.sub(r'\["([^"]+)"\]', r'.\1', normalized)
    normalized = re.sub(r'\[\*\]', '.*', normalized)  # Convert [*] to .*
    return normalized

def is_paths_target(target: str) -> bool:
    """Check if target refers to paths (endpoints)."""
    return target.startswith('$.paths') or '$["paths"]' in target or "$.paths" in target

def is_schemas_target(target: str) -> bool:
    """Check if target refers to schemas."""
    return target.startswith('$.components.schemas') or '$["components"]["schemas"]' in target

def is_parameters_target(target: str) -> bool:
    """Check if target refers to parameters."""
    return 'parameters' in target

def parse_comparison_overlay(overlay_path: Path) -> Dict:
    """Parse the comparison overlay and categorize changes."""
    with open(overlay_path, 'r') as f:
        overlay = yaml.safe_load(f)

    changes = {
        'new_endpoints': [],
        'modified_endpoints': [],
        'new_schemas': [],
        'modified_schemas': [],
        'new_parameters': [],
        'deprecated_endpoints': [],
        'by_tag': defaultdict(lambda: {'endpoints': [], 'schemas': []}),
        'summary': {}
    }

    for action in overlay.get('actions', []):
        target = action.get('target', '')
        normalized_target = normalize_jsonpath(target)

        # Analyze path operations (endpoints)
        if is_paths_target(target) and not is_parameters_target(target):
            update_data = action.get('update', {})

            # Handle case where target is $.paths and update contains full endpoint(s)
            # Example: target: $["paths"], update: {"/datasets/hide": {"post": {...}}}
            if normalized_target == '$.paths' and isinstance(update_data, dict):
                for path_key, path_value in update_data.items():
                    if isinstance(path_value, dict) and path_key.startswith('/'):
                        # This is a path like "/datasets/hide"
                        for http_method, method_def in path_value.items():
                            if http_method in ['get', 'post', 'put', 'delete', 'patch'] and isinstance(method_def, dict):
                                tag = method_def.get('tags', [None])[0] if method_def.get('tags') else infer_tag_from_endpoint(path_key)
                                new_endpoint_info = {
                                    'endpoint': path_key,
                                    'method': http_method.upper(),
                                    'operation_id': method_def.get('operationId'),
                                    'tag': tag,
                                    'summary': method_def.get('summary'),
                                    'target': target
                                }
                                changes['new_endpoints'].append(new_endpoint_info)
                                changes['by_tag'][tag]['endpoints'].append(new_endpoint_info)
            else:
                # Handle traditional targets like $["paths"]["/datasets"]["get"]
                endpoint_info = analyze_endpoint_change(normalized_target, action, target)
                if endpoint_info:
                    endpoint = endpoint_info['endpoint']
                    method = endpoint_info['method']
                    tag = endpoint_info.get('tag', 'unknown')

                    if action.get('update'):
                        # Check if it's a new endpoint (has complete operation definition)
                        if isinstance(update_data, dict) and 'operationId' in update_data:
                            changes['new_endpoints'].append(endpoint_info)
                            changes['by_tag'][tag]['endpoints'].append(endpoint_info)
                        # Check if update is adding a new method to an existing path
                        elif isinstance(update_data, dict) and any(key in update_data for key in ['get', 'post', 'put', 'delete', 'patch']):
                            # Adding new methods to path
                            for http_method, method_def in update_data.items():
                                if http_method in ['get', 'post', 'put', 'delete', 'patch'] and isinstance(method_def, dict):
                                    new_endpoint_info = {
                                        'endpoint': endpoint,
                                        'method': http_method.upper(),
                                        'operation_id': method_def.get('operationId'),
                                        'tag': method_def.get('tags', [None])[0] if method_def.get('tags') else infer_tag_from_endpoint(endpoint),
                                        'summary': method_def.get('summary'),
                                        'target': target
                                    }
                                    changes['new_endpoints'].append(new_endpoint_info)
                                    changes['by_tag'][new_endpoint_info['tag']]['endpoints'].append(new_endpoint_info)
                        else:
                            changes['modified_endpoints'].append(endpoint_info)
                    elif action.get('remove'):
                        changes['deprecated_endpoints'].append(endpoint_info)

        # Analyze schema changes
        elif is_schemas_target(target) and not is_parameters_target(target):
            update_data = action.get('update', {})

            # Handle case where target is $.components.schemas and update contains full schema(s)
            # Example: target: $["components"]["schemas"], update: {"NewSchema": {"type": "object", ...}}
            if normalized_target == '$.components.schemas' and isinstance(update_data, dict):
                for schema_name, schema_def in update_data.items():
                    if isinstance(schema_def, dict):
                        # Check if this looks like a schema definition
                        has_type = 'type' in schema_def
                        has_properties = 'properties' in schema_def
                        has_allof = 'allOf' in schema_def
                        has_oneof = 'oneOf' in schema_def
                        has_enum = 'enum' in schema_def

                        if has_type or has_allof or has_oneof or has_enum:
                            schema_info = {
                                'schema': schema_name,
                                'target': target,
                                'is_property_change': False
                            }
                            changes['new_schemas'].append(schema_info)
                            # Try to infer tag from schema name
                            tag = infer_tag_from_schema(schema_name)
                            if tag:
                                changes['by_tag'][tag]['schemas'].append(schema_info)
            else:
                # Handle traditional targets like $["components"]["schemas"]["DatasetRequest"]
                schema_info = analyze_schema_change(normalized_target, action, target)
                if schema_info:
                    schema_name = schema_info['schema']

                    # Check if it's a new schema (complete schema definition)
                    if isinstance(update_data, dict):
                        # New schema has type definition or is a complete schema object
                        has_type = 'type' in update_data
                        has_properties = 'properties' in update_data
                        has_allof = 'allOf' in update_data
                        has_oneof = 'oneOf' in update_data
                        has_enum = 'enum' in update_data

                        # Check if this is defining a new schema (not just modifying a property)
                        is_property_modification = '.properties.' in normalized_target

                        if (has_type or has_allof or has_oneof or has_enum) and not is_property_modification:
                            changes['new_schemas'].append(schema_info)
                            # Try to infer tag from schema name
                            tag = infer_tag_from_schema(schema_name)
                            if tag:
                                changes['by_tag'][tag]['schemas'].append(schema_info)
                        else:
                            changes['modified_schemas'].append(schema_info)
                    else:
                        changes['modified_schemas'].append(schema_info)

        # Analyze parameter changes
        elif is_parameters_target(target):
            param_info = analyze_parameter_change(target, action)
            if param_info:
                changes['new_parameters'].append(param_info)

    # Generate summary statistics
    changes['summary'] = {
        'total_new_endpoints': len(changes['new_endpoints']),
        'total_modified_endpoints': len(changes['modified_endpoints']),
        'total_new_schemas': len(changes['new_schemas']),
        'total_modified_schemas': len(changes['modified_schemas']),
        'affected_tags': list(changes['by_tag'].keys()),
        'requires_new_category': any(
            len(info['endpoints']) > 0 and info['endpoints'][0].get('tag') not in ['actions', 'compute-envs', 'credentials', 'datasets', 'pipelines', 'workflows', 'orgs', 'workspaces', 'teams', 'users']
            for tag, info in changes['by_tag'].items()
        )
    }

    return changes

def analyze_endpoint_change(normalized_target: str, action: Dict, original_target: str) -> Dict:
    """Extract endpoint information from target path."""
    # Example normalized: $.paths./datasets.get.summary
    # Example bracket: $["paths"]["/datasets"]["get"]["summary"]
    parts = normalized_target.split('.')
    if len(parts) < 3:
        return None

    # Find the endpoint (the part that starts with /)
    endpoint = None
    method = 'unknown'

    for i, part in enumerate(parts):
        if part.startswith('/'):
            endpoint = part
            # Method might be the next part
            if i + 1 < len(parts) and parts[i + 1] in ['get', 'post', 'put', 'delete', 'patch', 'options', 'head']:
                method = parts[i + 1]
            break

    if not endpoint:
        return None

    # Try to extract operation ID and tag from update
    update = action.get('update', {})
    operation_id = None
    tag = None
    summary = None

    if isinstance(update, dict):
        # Check if update has method definitions
        for http_method in ['get', 'post', 'put', 'delete', 'patch']:
            if http_method in update and isinstance(update[http_method], dict):
                method_def = update[http_method]
                operation_id = method_def.get('operationId')
                tags = method_def.get('tags', [])
                tag = tags[0] if tags else None
                summary = method_def.get('summary')
                method = http_method
                break

        # If no method in update, check top level
        if not operation_id:
            operation_id = update.get('operationId')
            tags = update.get('tags', [])
            tag = tags[0] if tags else None
            summary = update.get('summary')

    return {
        'endpoint': endpoint,
        'method': method.upper() if method != 'unknown' else 'UNKNOWN',
        'operation_id': operation_id,
        'tag': tag or infer_tag_from_endpoint(endpoint),
        'summary': summary,
        'target': original_target
    }

def analyze_schema_change(normalized_target: str, action: Dict, original_target: str) -> Dict:
    """Extract schema information from target path."""
    # Example normalized: $.components.schemas.DatasetRequest.properties.name
    # Example bracket: $["components"]["schemas"]["DatasetRequest"]["properties"]["name"]
    parts = normalized_target.split('.')
    if len(parts) < 4:
        return None

    schema_name = parts[3]  # e.g., DatasetRequest

    return {
        'schema': schema_name,
        'target': original_target,
        'is_property_change': 'properties' in normalized_target
    }

def analyze_parameter_change(target: str, action: Dict) -> Dict:
    """Extract parameter information from target path."""
    return {
        'target': target,
        'update': action.get('update')
    }

def infer_tag_from_endpoint(endpoint: str) -> str:
    """Infer the tag/controller from endpoint path."""
    # Remove leading slash and get first segment
    path_parts = endpoint.strip('/').split('/')
    if path_parts:
        first_segment = path_parts[0]
        # Map common patterns
        tag_map = {
            'actions': 'actions',
            'compute-envs': 'compute-envs',
            'credentials': 'credentials',
            'datasets': 'datasets',
            'data-links': 'data-links',
            'pipelines': 'pipelines',
            'workflows': 'workflows',
            'orgs': 'orgs',
            'workspaces': 'workspaces',
            'teams': 'teams',
            'users': 'users',
            'trace': 'trace',
            'studios': 'studios',
            'tokens': 'tokens',
            'labels': 'labels',
        }
        return tag_map.get(first_segment, first_segment)
    return 'unknown'

def infer_tag_from_schema(schema_name: str) -> str:
    """Infer the tag/controller from schema name."""
    # Common patterns: DatasetRequest, CreateWorkspaceRequest, etc.
    lower_name = schema_name.lower()
    
    tag_keywords = {
        'dataset': 'datasets',
        'action': 'actions',
        'computeenv': 'compute-envs',
        'credential': 'credentials',
        'pipeline': 'pipelines',
        'workflow': 'workflows',
        'org': 'orgs',
        'workspace': 'workspaces',
        'team': 'teams',
        'user': 'users',
        'studio': 'studios',
        'datalink': 'data-links',
    }
    
    for keyword, tag in tag_keywords.items():
        if keyword in lower_name:
            return tag
    
    return None

def generate_report(changes: Dict) -> str:
    """Generate a human-readable report of changes."""
    report = []
    
    report.append("# API Changes Analysis\n")
    report.append("## Summary\n")
    report.append(f"- **New Endpoints**: {changes['summary']['total_new_endpoints']}")
    report.append(f"- **Modified Endpoints**: {changes['summary']['total_modified_endpoints']}")
    report.append(f"- **New Schemas**: {changes['summary']['total_new_schemas']}")
    report.append(f"- **Modified Schemas**: {changes['summary']['total_modified_schemas']}")
    report.append(f"- **Affected Tags**: {', '.join(changes['summary']['affected_tags'])}\n")
    
    if changes['summary']['requires_new_category']:
        report.append("⚠️  **MANUAL INTERVENTION REQUIRED**: New controller/category detected that may need manual sidebar addition\n")
    
    # New endpoints by tag
    if changes['new_endpoints']:
        report.append("## New Endpoints by Controller\n")
        for tag, info in sorted(changes['by_tag'].items()):
            if info['endpoints']:
                report.append(f"### {tag}\n")
                for endpoint in info['endpoints']:
                    report.append(f"- `{endpoint['method']} {endpoint['endpoint']}` - {endpoint.get('operation_id', 'N/A')}")
                    if endpoint.get('summary'):
                        report.append(f"  - Summary: {endpoint['summary']}")
                report.append("")
    
    # New schemas
    if changes['new_schemas']:
        report.append("## New Schemas\n")
        for schema in changes['new_schemas']:
            report.append(f"- `{schema['schema']}`")
        report.append("")
    
    # Modified endpoints
    if changes['modified_endpoints']:
        report.append("## Modified Endpoints\n")
        for endpoint in changes['modified_endpoints'][:10]:  # Limit to first 10
            report.append(f"- `{endpoint['method']} {endpoint['endpoint']}`")
        if len(changes['modified_endpoints']) > 10:
            report.append(f"\n... and {len(changes['modified_endpoints']) - 10} more")
        report.append("")
    
    return '\n'.join(report)

def main():
    if len(sys.argv) < 2:
        print("Usage: analyze_comparison.py <comparison-overlay.yaml>")
        sys.exit(1)
    
    overlay_path = Path(sys.argv[1])
    
    if not overlay_path.exists():
        print(f"❌ File not found: {overlay_path}")
        sys.exit(1)
    
    print(f"Analyzing {overlay_path.name}...\n")
    
    # Parse and analyze
    changes = parse_comparison_overlay(overlay_path)
    
    # Generate report
    report = generate_report(changes)
    print(report)
    
    # Also output JSON for programmatic use
    json_output = overlay_path.parent / f"{overlay_path.stem}-analysis.json"
    with open(json_output, 'w') as f:
        json.dump(changes, f, indent=2)
    
    print(f"\n✅ Analysis complete! JSON output saved to: {json_output}")

if __name__ == '__main__':
    main()
