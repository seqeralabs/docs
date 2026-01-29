import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { visit } from 'unist-util-visit';
import { fromMarkdown } from 'mdast-util-from-markdown'
import YAML from 'yaml';

// Memory-optimized version with content-hash-based caching for versioned docs
// Uses small LRU caches with aggressive eviction to keep memory footprint minimal
// Caches based on content hash, not file path - perfect for deduplicated versioned docs
// Original: https://github.com/seqeralabs/remark-yaml-to-table/blob/master/src/index.js

// Small LRU caches - prioritize memory over speed
const MAX_YAML_CACHE = 20;  // Only cache 20 most recent unique YAML contents
const MAX_MARKDOWN_CACHE = 200;  // Only cache 200 most recent markdown parses
const globalYamlCache = new Map();  // hash -> parsed YAML
const globalMarkdownCache = new Map();
let filesProcessed = 0;

// Generate content hash for deduplication across versions
function hashContent(content) {
  return createHash('sha256').update(content).digest('hex').substring(0, 16);
}

function generateTableMdast(parsedData = [], markdownCache, maxSize) {
  // Extract headers (assuming all rows have the same columns)
  const headers = Object.keys(parsedData[0] || {});

  // Create mdast nodes for table headers
  const thead = headers.map(header => ({
      type: 'tableCell',
      // Handle possible null - use cache to avoid repeated parsing
      children: parseMarkdownCached(header, markdownCache, maxSize)
  }));

  // Create mdast nodes for table rows
  const tbody = parsedData.map(row => ({
      type: 'tableRow',
      children: headers.map(header => ({
          type: 'tableCell',
          // Handle possible null - use cache to avoid repeated parsing
          children: parseMarkdownCached(row[header], markdownCache, maxSize)
      }))
  }));

  // Combine headers and rows to create the table mdast node
  const table = {
      type: 'table',
      children: [{ type: 'tableRow', children: thead }, ...tbody]
  };

  return table;
}

// LRU cache eviction - removes oldest entry when cache is full
function evictOldestIfFull(cache, maxSize) {
  if (cache.size >= maxSize) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

// Cache markdown parsing with strict memory limits and LRU eviction
function parseMarkdownCached(text, cache, maxSize) {
  if (!text) return [];

  // Check cache first - move to end (LRU)
  if (cache.has(text)) {
    const result = cache.get(text);
    cache.delete(text);
    cache.set(text, result);
    return result;
  }

  // Evict oldest entry if cache is full
  evictOldestIfFull(cache, maxSize);

  // Parse and cache
  const result = fromMarkdown(text).children;
  cache.set(text, result);

  return result;
}

// Cache YAML file loading with content-hash-based deduplication
// This allows identical YAML files across different version directories to share cache
function loadYamlCached(fileAbsPath, cache, maxSize) {
  // Load file content first
  let yamlContent;
  try {
    yamlContent = fs.readFileSync(fileAbsPath, 'utf8');
  } catch(err) {
    throw new Error(`Cannot open '${fileAbsPath}'`);
  }

  // Generate content hash for cache key (deduplicates across versions)
  const contentHash = hashContent(yamlContent);

  // Check cache by content hash - move to end (LRU)
  if (cache.has(contentHash)) {
    const result = cache.get(contentHash);
    cache.delete(contentHash);
    cache.set(contentHash, result);
    yamlContent = null;  // Help GC
    return result;
  }

  // Evict oldest entry if cache is full
  evictOldestIfFull(cache, maxSize);

  // Parse YAML
  let parsedData;
  try {
    parsedData = YAML.parse(yamlContent);
  } catch(err) {
    throw new Error(`Cannot parse YAML: ${err.message}`);
  }

  // Cache by content hash, not file path
  cache.set(contentHash, parsedData);

  // Clear temporary variables to help GC
  yamlContent = null;

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
    // Use small LRU caches to minimize memory footprint
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

      // Load and parse YAML using LRU cache with strict size limit
      const parsedData = loadYamlCached(fileAbsPath, globalYamlCache, MAX_YAML_CACHE);

      // Generate table using LRU markdown cache with strict size limit
      const tableHast = generateTableMdast(parsedData, globalMarkdownCache, MAX_MARKDOWN_CACHE);

      // Replace the directive node with our table hast node
      Object.assign(node, tableHast);
    }

    // Periodic aggressive cache cleanup to limit peak memory
    filesProcessed++;
    if (filesProcessed % 10 === 0) {
      // Every 10 files, trim caches to half their max size to reduce memory spikes
      while (globalYamlCache.size > MAX_YAML_CACHE / 2) {
        const firstKey = globalYamlCache.keys().next().value;
        globalYamlCache.delete(firstKey);
      }
      while (globalMarkdownCache.size > MAX_MARKDOWN_CACHE / 2) {
        const firstKey = globalMarkdownCache.keys().next().value;
        globalMarkdownCache.delete(firstKey);
      }
    }
  }
}

export { yamlToGfmTable };
export default yamlToGfmTable;
