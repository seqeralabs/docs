#!/usr/bin/env node

/**
 * Find pages that are built by Docusaurus but not included in any sidebar.
 * These pages can potentially be excluded to speed up build times.
 */

import fs from 'fs-extra';
import path from 'path';
import glob from 'fast-glob';

const DOCS_SECTIONS = [
  {
    name: 'platform-enterprise',
    docsPath: 'platform-enterprise_docs',
    sidebarPath: 'platform-enterprise_docs/enterprise-sidebar.json',
    versionedSidebars: 'platform-enterprise_versioned_sidebars',
  },
  {
    name: 'platform-cloud',
    docsPath: 'platform-cloud/docs',
    sidebarPath: 'platform-cloud/cloud-sidebar.json',
  },
  {
    name: 'fusion',
    docsPath: 'fusion_docs',
    sidebarPath: 'fusion_docs/sidebar.json',
  },
  {
    name: 'wave',
    docsPath: 'wave_docs/wave_repo/docs',
    sidebarPath: 'wave_docs/sidebar.json',
  },
  {
    name: 'multiqc',
    docsPath: 'multiqc_docs/multiqc_repo/docs/markdown',
    sidebarPath: 'multiqc_docs/sidebar.js',
  },
];

/**
 * Extract all file references from a sidebar configuration
 */
function extractSidebarFiles(sidebarConfig, basePath = '') {
  const files = new Set();

  function traverse(item) {
    if (typeof item === 'string') {
      // Direct file reference
      files.add(item);
    } else if (typeof item === 'object') {
      // Handle different sidebar item types
      if (item.id) {
        files.add(item.id);
      }
      if (item.items && Array.isArray(item.items)) {
        item.items.forEach(traverse);
      }
      // Handle the sidebar structure where it's an object with keys
      Object.values(item).forEach(value => {
        if (Array.isArray(value)) {
          value.forEach(traverse);
        } else if (typeof value === 'object') {
          traverse(value);
        }
      });
    } else if (Array.isArray(item)) {
      item.forEach(traverse);
    }
  }

  traverse(sidebarConfig);
  return files;
}

/**
 * Load sidebar configuration (supports .js and .json)
 */
async function loadSidebar(sidebarPath) {
  const ext = path.extname(sidebarPath);

  if (ext === '.json') {
    return await fs.readJson(sidebarPath);
  } else if (ext === '.js' || ext === '.ts') {
    const module = await import(path.resolve(sidebarPath));
    return module.default || module;
  }

  throw new Error(`Unsupported sidebar format: ${ext}`);
}

/**
 * Find all markdown files in a directory
 */
async function findMarkdownFiles(docsPath) {
  const files = await glob('**/*.{md,mdx}', {
    cwd: docsPath,
    absolute: false,
  });

  // Remove extension and normalize paths
  return files.map(file => file.replace(/\.(md|mdx)$/, ''));
}

/**
 * Check for orphaned pages in a docs section
 */
async function checkSection(section) {
  console.log(`\n📁 Checking ${section.name}...`);

  if (!await fs.pathExists(section.docsPath)) {
    console.log(`   ⚠️  Docs path not found: ${section.docsPath}`);
    return { orphaned: [], total: 0 };
  }

  if (!await fs.pathExists(section.sidebarPath)) {
    console.log(`   ⚠️  Sidebar not found: ${section.sidebarPath}`);
    return { orphaned: [], total: 0 };
  }

  // Load sidebar and extract referenced files
  const sidebar = await loadSidebar(section.sidebarPath);
  const sidebarFiles = extractSidebarFiles(sidebar);

  // Check versioned sidebars if they exist
  if (section.versionedSidebars && await fs.pathExists(section.versionedSidebars)) {
    const versionedSidebarFiles = await glob('*.json', {
      cwd: section.versionedSidebars,
      absolute: false,
    });

    for (const versionedFile of versionedSidebarFiles) {
      const versionedPath = path.join(section.versionedSidebars, versionedFile);
      const versionedSidebar = await fs.readJson(versionedPath);
      const versionedFiles = extractSidebarFiles(versionedSidebar);
      versionedFiles.forEach(f => sidebarFiles.add(f));
    }
  }

  // Find all markdown files
  const allFiles = await findMarkdownFiles(section.docsPath);

  // Find orphaned files
  const orphaned = allFiles.filter(file => !sidebarFiles.has(file));

  console.log(`   Total pages: ${allFiles.length}`);
  console.log(`   Pages in sidebar: ${sidebarFiles.size}`);
  console.log(`   Orphaned pages: ${orphaned.length}`);

  if (orphaned.length > 0) {
    console.log(`\n   📄 Orphaned pages:`);
    orphaned.forEach(file => {
      console.log(`      - ${file}`);
    });
  }

  return { orphaned, total: allFiles.length, section: section.name };
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Finding orphaned pages in Docusaurus site...\n');
  console.log('These are pages that are built but not included in any sidebar.');
  console.log('You can potentially exclude these to speed up build times.\n');
  console.log('='.repeat(80));

  const results = [];

  for (const section of DOCS_SECTIONS) {
    try {
      const result = await checkSection(section);
      results.push(result);
    } catch (error) {
      console.error(`   ❌ Error checking ${section.name}:`, error.message);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY\n');

  let totalOrphaned = 0;
  let totalPages = 0;

  results.forEach(result => {
    totalOrphaned += result.orphaned.length;
    totalPages += result.total;
    if (result.orphaned.length > 0) {
      console.log(`   ${result.section}: ${result.orphaned.length} orphaned page(s)`);
    }
  });

  console.log(`\n   Total pages across all sections: ${totalPages}`);
  console.log(`   Total orphaned pages: ${totalOrphaned}`);

  if (totalOrphaned > 0) {
    console.log('\n💡 Tips for speeding up builds:');
    console.log('   1. Use environment variables to exclude entire sections during development:');
    console.log('      EXCLUDE_PLATFORM_ENTERPRISE=true npm run build');
    console.log('   2. Move orphaned pages to a separate directory if not needed');
    console.log('   3. Delete unused pages');
    console.log('   4. Use .docusaurus-skip in files you want Docusaurus to ignore');
  }
}

main().catch(console.error);
