import fs from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';
import { fromMarkdown } from 'mdast-util-from-markdown'
import YAML from 'yaml';

// Memory-optimized version with global caching to reduce repeated markdown parsing and YAML loading
// Original: https://github.com/seqeralabs/remark-yaml-to-table/blob/master/src/index.js

// Global caches persist across all files in a build
const globalMarkdownCache = new Map();
const globalYamlCache = new Map();

function generateTableMdast(parsedData = [], markdownCache) {
  // Extract headers (assuming all rows have the same columns)
  const headers = Object.keys(parsedData[0] || {});

  // Create mdast nodes for table headers
  const thead = headers.map(header => ({
      type: 'tableCell',
      // Handle possible null - use cache to avoid repeated parsing
      children: parseMarkdownCached(header, markdownCache)
  }));

  // Create mdast nodes for table rows
  const tbody = parsedData.map(row => ({
      type: 'tableRow',
      children: headers.map(header => ({
          type: 'tableCell',
          // Handle possible null - use cache to avoid repeated parsing
          children: parseMarkdownCached(row[header], markdownCache)
      }))
  }));

  // Combine headers and rows to create the table mdast node
  const table = {
      type: 'table',
      children: [{ type: 'tableRow', children: thead }, ...tbody]
  };

  return table;
}

// Cache markdown parsing results to reduce memory usage
function parseMarkdownCached(text, cache) {
  if (!text) return [];

  // Check cache first
  if (cache.has(text)) {
    return cache.get(text);
  }

  // Parse and cache (limit cache size to prevent unbounded growth)
  const result = fromMarkdown(text).children;
  if (cache.size < 5000) {
    cache.set(text, result);
  }

  return result;
}

// Cache YAML file loading and parsing
function loadYamlCached(fileAbsPath, cache) {
  // Check cache first
  if (cache.has(fileAbsPath)) {
    return cache.get(fileAbsPath);
  }

  // Load and parse YAML
  let yamlContent;
  try {
    yamlContent = fs.readFileSync(fileAbsPath, 'utf8');
  } catch(err) {
    throw new Error(`Cannot open '${fileAbsPath}'`);
  }

  let parsedData;
  try {
    parsedData = YAML.parse(yamlContent);
  } catch(err) {
    throw new Error(`Cannot parse YAML: ${err.message}`);
  }

  // Cache the result (limit cache size)
  if (cache.size < 500) {
    cache.set(fileAbsPath, parsedData);
  }

  return parsedData;
}

// Based on code from:
// https://github.com/kevin940726/remark-code-import
function yamlToGfmTable(options = {}) {
  const rootDir = process.cwd();

  if (!path.isAbsolute(rootDir)) {
    throw new Error(`"rootDir" has to be an absolute path`);
  }

  return function transformer(tree, file) {
    // Use global caches that persist across all files in the build
    const nodes = [];

    // directives remark plugin includes an `attributes` key
    visit(tree, 'leafDirective', node => {
      nodes.push(node);
    });

    for(const node of nodes) {
      // directive name, for example:
      // ::table{file=my.yaml}
      if(node.name !== 'table') continue;
      if(!node.attributes['file']) throw new Error(`file= attribute missing`);

      if (!file.dirname) {
        throw new Error('"file" should be an instance of VFile');
      }

      const filePath = node.attributes.file;
      const normalizedFilePath = filePath
        .replace(/^\[rootDir\]/, rootDir)
        .replace(/\\ /g, ' ');
      const fileAbsPath = path.resolve(file.dirname, normalizedFilePath);

      if (!options.allowImportingFromOutside) {
        const relativePathFromRootDir = path.relative(rootDir, fileAbsPath);
        if (
          !rootDir ||
          relativePathFromRootDir.startsWith(`..${path.sep}`) ||
          path.isAbsolute(relativePathFromRootDir)
        ) {
          throw new Error(
            `Attempted to import code from "${fileAbsPath}", which is outside from the rootDir "${rootDir}"`
          );
        }
      }

      // Load and parse YAML using global cache
      const parsedData = loadYamlCached(fileAbsPath, globalYamlCache);

      // Generate table using global markdown cache
      const tableHast = generateTableMdast(parsedData, globalMarkdownCache);

      // Replace the directive node with our table hast node
      Object.assign(node, tableHast);
    }
  }
}

export { yamlToGfmTable };
export default yamlToGfmTable;
