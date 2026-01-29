# Extract CLI Documentation to Separate Docset

## Overview

Extract CLI documentation from `platform-cloud` and `platform-enterprise` into a separate `platform-cli-docs` docset that renders at `/platform-cli`, similar to how `platform-api` is structured. This eliminates duplication and creates a single source of truth for CLI documentation.

## Current State

- **Primary source**: `platform-cloud/docs/cli/` (includes overlays, scripts, metadata)
- **Mirror copy**: `platform-enterprise_docs/cli/` (reference docs copied by workflow)
- **Problem**: CLI docs duplicated across docsets, maintained separately
- **Solution**: Extract to standalone docset, reference via external links

## Implementation Steps

### 1. Create Platform-CLI-Docs Structure

**Create directory**: `/platform-cli-docs/`

**Directory layout**:
```
platform-cli-docs/
├── docs/
│   ├── overview.md
│   ├── installation.md
│   ├── commands-reference.md
│   ├── reference/          (18 command files)
│   ├── _images/
│   └── sidebar/
│       └── sidebar.js      (NEW - CLI navigation)
├── overlays/               (79 overlay files)
├── scripts/
│   ├── generate-cli-docs.py
│   ├── compare-metadata.py
│   ├── MAINTENANCE.md
│   └── README.md
├── metadata/
│   ├── cli-metadata-latest.json (symlink)
│   └── cli-metadata-v*.json
└── README.md
```

**Actions**:
- Create `/platform-cli-docs/` directory
- Move all content from `/platform-cloud/docs/cli/` to `/platform-cli-docs/`
  - Move docs → `platform-cli-docs/docs/`
  - Move overlays → `platform-cli-docs/overlays/`
  - Move scripts → `platform-cli-docs/scripts/`
  - Move metadata → `platform-cli-docs/metadata/`
  - Move _images → `platform-cli-docs/docs/_images/`

**Create sidebar**: `/platform-cli-docs/docs/sidebar/sidebar.js`
```javascript
module.exports = {
  clisidebar: [
    { type: "doc", id: "overview" },
    { type: "doc", id: "installation" },
    {
      type: "category",
      label: "Command Reference",
      link: { type: "doc", id: "commands-reference" },
      collapsed: false,
      items: [
        { type: "doc", id: "reference/info" },
        { type: "doc", id: "reference/credentials" },
        { type: "doc", id: "reference/compute-envs" },
        { type: "doc", id: "reference/datasets" },
        { type: "doc", id: "reference/data-links" },
        { type: "doc", id: "reference/labels" },
        { type: "doc", id: "reference/secrets" },
        { type: "doc", id: "reference/pipelines" },
        { type: "doc", id: "reference/launch" },
        { type: "doc", id: "reference/runs" },
        { type: "doc", id: "reference/actions" },
        { type: "doc", id: "reference/organizations" },
        { type: "doc", id: "reference/workspaces" },
        { type: "doc", id: "reference/teams" },
        { type: "doc", id: "reference/members" },
        { type: "doc", id: "reference/participants" },
        { type: "doc", id: "reference/collaborators" },
        { type: "doc", id: "reference/studios" },
      ],
    },
  ],
};
```

### 2. Update Docusaurus Configuration

**File**: `/docusaurus.config.js`

**Add plugin configuration** (after line 57):
```javascript
const docs_platform_cli = [
  "@docusaurus/plugin-content-docs",
  {
    id: "platform-cli",
    routeBasePath: "/platform-cli",
    path: "platform-cli-docs/docs",
    remarkPlugins: [
      (await import("remark-code-import")).default,
      (await require("remark-math")).default,
      (await import("docusaurus-remark-plugin-tab-blocks")).default,
      (await require("remark-yaml-to-table")).default,
    ],
    rehypePlugins: [(await require("rehype-katex")).default],
    sidebarPath: "platform-cli-docs/docs/sidebar/sidebar.js",
    editUrl: "https://github.com/seqeralabs/docs/tree/master/",
  },
];
```

**Register in plugins array** (around line 262):
```javascript
plugins: [
  process.env.EXCLUDE_PLATFORM_ENTERPRISE ? null : docs_platform_enterprise,
  process.env.EXCLUDE_PLATFORM_CLOUD ? null : docs_platform_cloud,
  process.env.EXCLUDE_PLATFORM_API ? null : docs_platform_api,
  process.env.EXCLUDE_PLATFORM_CLI ? null : docs_platform_cli,  // ADD THIS
  process.env.EXCLUDE_PLATFORM_OPENAPI ? null : docs_platform_openapi,
  // ...
]
```

**Add navbar item** (themeConfig.navbar.items, after Platform API):
```javascript
{
  to: "/platform-cli",
  label: "Platform CLI",
  position: "left",
}
```

**Add environment variable logging**:
```javascript
console.log(
  // ... existing logs
  "\n  EXCLUDE_PLATFORM_CLI: " + (process.env.EXCLUDE_PLATFORM_CLI ? true : false),
);
```

### 3. Update Cloud and Enterprise Sidebars

**File**: `/platform-cloud/cloud-sidebar.json`

Replace CLI category (lines 184-218) with external link:
```json
{
  "type": "category",
  "label": "Developer tools",
  "collapsed": true,
  "items": [
    {
      "type": "link",
      "label": "API",
      "href": "https://docs.seqera.io/platform-api"
    },
    {
      "type": "link",
      "label": "CLI",
      "href": "https://docs.seqera.io/platform-cli"
    },
    {
      "type": "category",
      "label": "Seqerakit",
      // ... rest unchanged
    }
  ]
}
```

**File**: `/platform-enterprise_docs/enterprise-sidebar.json`

Apply same change (lines 228-262).

**Files**: `/platform-enterprise_versioned_sidebars/version-*-sidebars.json` (10 files)

For each versioned sidebar, replace CLI category with:
```json
{
  "type": "link",
  "label": "CLI",
  "href": "https://docs.seqera.io/platform-cli"
}
```

### 4. Update GitHub Actions Workflow

**File**: `.github/workflows/update-cli-docs.yml`

**Update all path references** from `platform-cloud/docs/cli/` to `platform-cli-docs/`:

- Line 57: `platform-cli-docs/metadata/cli-metadata-v${{ ... }}.json`
- Lines 63-68: Comparison script paths → `platform-cli-docs/metadata/` and `platform-cli-docs/scripts/`
- Lines 82-85: Generation script → `platform-cli-docs/scripts/generate-cli-docs.py`, overlays → `platform-cli-docs/overlays`, output → `platform-cli-docs/docs/reference`
- Lines 97-115: Version notice insertion → `platform-cli-docs/docs/overview.md` and `platform-cli-docs/docs/commands-reference.md`
- Line 128: Symlink update → `cd platform-cli-docs/metadata`

**Remove step** (lines 117-124): "Copy to enterprise docs" - no longer needed

### 5. Clean Up Old CLI Directories

**Delete**:
- `/platform-cloud/docs/cli/` (moved to platform-cli-docs)
- `/platform-enterprise_docs/cli/` (no longer needed as separate copy)
- `/platform-enterprise_versioned_docs/version-*/cli/` (all 10 versions)

**Rationale**: External links make versioned CLI docs unnecessary - CLI is cross-version compatible.

### 6. Update Documentation Scripts

**Files to check for hardcoded paths**:
- `/platform-cli-docs/scripts/generate-cli-docs.py`
- `/platform-cli-docs/scripts/compare-metadata.py`
- `/platform-cli-docs/scripts/MAINTENANCE.md`
- `/platform-cli-docs/scripts/README.md`

Update any references from old paths to new structure.

### 7. Configure URL Redirects

**Update Netlify redirects file**: `/static/_redirects`

Add the following redirect rules (after line 77, in the CLI section):

```
# Redirect old CLI docs to new platform-cli docset
/platform-cloud/cli/*                        /platform-cli               301
/platform-enterprise/cli/*                   /platform-cli               301
/platform-enterprise/*/cli/*                 /platform-cli               301
/platform-enterprise/:version/cli/*          /platform-cli               301
```

These blanket redirects will send all old CLI URLs to the main platform-cli page, regardless of which specific CLI page was accessed. This provides a simple fallback for users with old bookmarks or external links.

**Note**: The `*/cli/*` pattern catches versioned paths like `/platform-enterprise/25.3/cli/overview`, while `:version/cli/*` provides additional coverage for version-specific patterns.

## Critical Files

- `/docusaurus.config.js` - Add platform-cli plugin, navbar item
- `.github/workflows/update-cli-docs.yml` - Update all path references
- `/platform-cloud/cloud-sidebar.json` - Replace CLI category with external link (lines 184-218)
- `/platform-enterprise_docs/enterprise-sidebar.json` - Replace CLI category with external link (lines 228-262)
- `/platform-enterprise_versioned_sidebars/version-*-sidebars.json` - Update all 10 files
- `/platform-cli-docs/docs/sidebar/sidebar.js` - New file defining CLI navigation

## Verification

### Local Build Testing
```bash
# Test full build
npm run build

# Test with CLI excluded
EXCLUDE_PLATFORM_CLI=true npm run build

# Test development server
npm run start
```

### Validation Checks
1. Verify `/platform-cli` route works
2. Test external links from Cloud docs ("Developer tools" → "CLI")
3. Test external links from Enterprise docs
4. Test external links from versioned Enterprise docs
5. Verify navbar navigation shows "Platform CLI"
6. Check that old `/platform-cloud/cli/` routes redirect or return 404

### Workflow Testing
1. Trigger workflow with manual dispatch
2. Verify files written to `platform-cli-docs/` (not old locations)
3. Verify PR creation with proper paths
4. Check comparison report generation works
5. Verify symlink creation at `platform-cli-docs/metadata/cli-metadata-latest.json`

### End-to-End Test
1. Build site locally
2. Navigate to `/platform-cli`
3. Verify all 18 command reference pages load
4. Check images load correctly
5. Verify sidebar navigation works
6. Test "Edit this page" links point to correct GitHub paths
7. Check external links from Cloud and Enterprise work

## Benefits

1. **Single Source of Truth**: `platform-cli-docs` is authoritative
2. **No Duplication**: Eliminates sync issues between Cloud and Enterprise
3. **Clean URLs**: `/platform-cli` consistent with `/platform-api`
4. **No Versioning Complexity**: CLI docs are cross-version compatible
5. **Simplified Automation**: Workflow writes to one location
6. **Follows Existing Pattern**: Mirrors platform-api-docs structure

## Rollback Plan

If issues arise:
1. Revert docusaurus.config.js changes
2. Revert sidebar changes
3. Revert workflow changes
4. Restore old CLI directories from git history
5. Full git revert of migration commits
