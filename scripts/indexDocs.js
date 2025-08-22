const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const algoliasearch = require('algoliasearch');

// Algolia configuration
const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_API_KEY;
const indexName = process.env.ALGOLIA_INDEX_NAME;

if (!appId || !apiKey || !indexName) {
  console.error('Missing required Algolia environment variables');
  console.error('Required: ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME');
  process.exit(1);
}

const client = algoliasearch(appId, apiKey);
const index = client.initIndex(indexName);

// Define directories to scan
const DOC_DIRECTORIES = [
  'platform-enterprise_docs',
  'platform-enterprise_versioned_docs',
  'fusion_docs',
  'wave_docs',
  'multiqc_docs',
  'platform-cloud/docs',
  'platform-api-docs/docs'
];

function extractTextContent(markdownContent) {
  // Remove markdown syntax and extract plain text
  let content = markdownContent
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove headers markdown
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  return content;
}

function generateUrlFromPath(filePath) {
  // Convert file path to URL path - MUST match ProductItem.tsx expectations
  let url = filePath
    .replace(/^platform-enterprise_docs\//, '/platform-enterprise/')
    .replace(/^platform-enterprise_versioned_docs\/version-([^\/]+)\//, '/platform-enterprise/$1/')
    .replace(/^fusion_docs\//, '/fusion/')
    .replace(/^wave_docs\//, '/wave/')
    .replace(/^multiqc_docs\//, '/multiqc/')
    .replace(/^platform-cloud\/docs\//, '/platform-cloud/')
    .replace(/^platform-api-docs\/docs\//, '/platform-api/')
    .replace(/\.mdx?$/, '')
    .replace(/\/index$/, '');
  
  // Add the base domain
  const fullUrl = 'https://docs.seqera.io' + url;
  return fullUrl;
}

function extractVersion(filePath) {
  // Extract version from platform-enterprise versioned docs
  const versionMatch = filePath.match(/platform-enterprise_versioned_docs\/version-([^\/]+)\//); 
  return versionMatch ? versionMatch[1] : null;
}

function getLvl0(filePath) {
  // Map to your site's main sections
  if (filePath.includes('platform-enterprise')) return 'Platform';
  if (filePath.includes('fusion')) return 'Fusion';
  if (filePath.includes('wave')) return 'Wave';
  if (filePath.includes('multiqc')) return 'MultiQC';
  if (filePath.includes('platform-cloud')) return 'Cloud';
  if (filePath.includes('platform-api')) return 'API';
  return 'Documentation';
}

function processMarkdownFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(fileContent);
    const { data: frontmatter, content } = parsed;
    
    // Extract title (lvl1)
    const title = frontmatter.title || 
                 frontmatter.name || 
                 path.basename(filePath, path.extname(filePath));
    
    // Generate URL
    const url = generateUrlFromPath(filePath);
    
    // Get hierarchical data
    const lvl0 = getLvl0(filePath);
    const version = extractVersion(filePath);
    
    const records = [];
    
    // Split content by headings to create individual records
    const lines = content.split('\n');
    let currentH2 = '';
    let currentH3 = '';
    let currentH4 = '';
    let currentContent = [];
    let recordCount = 0;
    
    for (const line of lines) {
      const h2Match = line.match(/^##\s+(.+)/);
      const h3Match = line.match(/^###\s+(.+)/);
      const h4Match = line.match(/^####\s+(.+)/);
      
      if (h2Match) {
        // Save previous section if it has content
        if (currentContent.length > 0) {
          const cleanContent = extractTextContent(currentContent.join(' '));
          if (cleanContent.length > 10) {
            records.push(createRecord(
              url, lvl0, title, currentH2, currentH3, currentH4, 
              cleanContent, version, recordCount++
            ));
          }
        }
        
        currentH2 = h2Match[1];
        currentH3 = '';
        currentH4 = '';
        currentContent = [];
      } else if (h3Match) {
        // Save previous section if it has content
        if (currentContent.length > 0) {
          const cleanContent = extractTextContent(currentContent.join(' '));
          if (cleanContent.length > 10) {
            records.push(createRecord(
              url, lvl0, title, currentH2, currentH3, currentH4, 
              cleanContent, version, recordCount++
            ));
          }
        }
        
        currentH3 = h3Match[1];
        currentH4 = '';
        currentContent = [];
      } else if (h4Match) {
        // Save previous section if it has content
        if (currentContent.length > 0) {
          const cleanContent = extractTextContent(currentContent.join(' '));
          if (cleanContent.length > 10) {
            records.push(createRecord(
              url, lvl0, title, currentH2, currentH3, currentH4, 
              cleanContent, version, recordCount++
            ));
          }
        }
        
        currentH4 = h4Match[1];
        currentContent = [];
      } else {
        // Regular content line
        if (line.trim() && !line.match(/^#{1,6}/)) {
          currentContent.push(line.trim());
        }
      }
    }
    
    // Don't forget the last section
    if (currentContent.length > 0) {
      const cleanContent = extractTextContent(currentContent.join(' '));
      if (cleanContent.length > 10) {
        records.push(createRecord(
          url, lvl0, title, currentH2, currentH3, currentH4, 
          cleanContent, version, recordCount++
        ));
      }
    }
    
    // Always create at least one record for the page
    if (records.length === 0) {
      const description = frontmatter.description || extractTextContent(content).substring(0, 200);
      records.push(createRecord(url, lvl0, title, '', '', '', description, version, 0));
    }
    
    return records;
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return [];
  }
}

function createRecord(url, lvl0, lvl1, lvl2, lvl3, lvl4, content, version, position) {
  // Create anchor for headings (sanitize for URL)
  const anchor = lvl2 ? `#${lvl2.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}` : '';
  
  // Create unique objectID
  const objectID = url + anchor + (position > 0 ? `-${position}` : '');
  
  // Add anchor to the URL for direct linking
  const finalUrl = url + anchor;
  
  const record = {
    objectID: objectID,
    url: finalUrl,
    url_without_anchor: url,
    hierarchy: {
      lvl0: lvl0,
      lvl1: lvl1,
      lvl2: lvl2 || null,
      lvl3: lvl3 || null,
      lvl4: lvl4 || null,
      lvl5: null,
      lvl6: null
    },
    content: content,
    type: 'content',
    anchor: anchor,
    // CRITICAL: Add _highlightResult structure for React components
    _highlightResult: {
      hierarchy: {
        lvl0: { value: lvl0, matchLevel: 'none', matchedWords: [] },
        lvl1: { value: lvl1, matchLevel: 'none', matchedWords: [] },
        lvl2: lvl2 ? { value: lvl2, matchLevel: 'none', matchedWords: [] } : null,
        lvl3: lvl3 ? { value: lvl3, matchLevel: 'none', matchedWords: [] } : null,
        lvl4: lvl4 ? { value: lvl4, matchLevel: 'none', matchedWords: [] } : null,
        lvl5: null,
        lvl6: null
      },
      content: { value: content, matchLevel: 'none', matchedWords: [] }
    }
  };
  
  // Add version for platform-enterprise docs
  if (version) {
    record.version = [version];
    // CRITICAL: Add version to _highlightResult for React components
    record._highlightResult.version = [{ value: version, matchLevel: 'none', matchedWords: [] }];
  }
  
  return record;
}

async function indexAllDocs() {
  try {
    console.log('🔍 Starting documentation indexing...');
    console.log(`📡 App ID: ${appId}`);
    console.log(`📇 Index: ${indexName}`);
    console.log(`📂 Scanning directories: ${DOC_DIRECTORIES.join(', ')}\n`);
    
    let allRecords = [];
    let totalFiles = 0;
    let productStats = {};
    
    for (const dir of DOC_DIRECTORIES) {
      if (!fs.existsSync(dir)) {
        console.log(`⚠️  Directory ${dir} does not exist, skipping...`);
        continue;
      }
      
      console.log(`📂 Processing directory: ${dir}`);
      const files = getAllMarkdownFiles(dir);
      
      for (const file of files) {
        const records = processMarkdownFile(file);
        
        if (records.length > 0) {
          allRecords.push(...records);
          totalFiles++;
          
          // Track product stats
          const product = getLvl0(file);
          productStats[product] = (productStats[product] || 0) + records.length;
          
          // Log progress for verification
          const url = generateUrlFromPath(file);
          const version = extractVersion(file);
          console.log(`   📄 ${file}:`);
          console.log(`      → Generated ${records.length} records`);
          console.log(`      → URL: ${url}`);
          console.log(`      → Product: ${product}`);
          if (version) console.log(`      → Version: ${version}`);
          
          if (totalFiles % 25 === 0) {
            console.log(`   ✅ Processed ${totalFiles} files so far...`);
          }
        }
      }
    }
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`📝 Total records generated: ${allRecords.length} from ${totalFiles} files`);
    console.log(`📈 Records by product:`);
    Object.entries(productStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([product, count]) => {
        console.log(`   ${product}: ${count} records`);
      });
    
    if (allRecords.length === 0) {
      console.log('❌ No records to index');
      return;
    }
    
    // Show sample records for verification
    console.log('\n📋 Sample records:');
    const samplesByProduct = {};
    allRecords.forEach(record => {
      const product = record.hierarchy.lvl0;
      if (!samplesByProduct[product]) {
        samplesByProduct[product] = record;
      }
    });
    
    Object.entries(samplesByProduct).forEach(([product, record]) => {
      console.log(`🏷️  ${product}:`);
      console.log(`   URL: ${record.url}`);
      console.log(`   Title: ${record.hierarchy.lvl1}`);
      console.log(`   Content preview: ${record.content.substring(0, 100)}...`);
    });
    
    // Clear existing index
    console.log('\n🧹 Clearing existing index...');
    await index.clearObjects();
    
    // Configure index settings for optimal search
    console.log('⚙️ Configuring index settings...');
    await index.setSettings({
      searchableAttributes: [
        'unordered(hierarchy.lvl0)',
        'unordered(hierarchy.lvl1)',
        'unordered(hierarchy.lvl2)',
        'unordered(hierarchy.lvl3)',
        'unordered(hierarchy.lvl4)',
        'unordered(hierarchy.lvl5)',
        'unordered(hierarchy.lvl6)',
        'content'
      ],
      attributesToHighlight: [
        'hierarchy.lvl0',
        'hierarchy.lvl1',
        'hierarchy.lvl2',
        'hierarchy.lvl3',
        'hierarchy.lvl4',
        'hierarchy.lvl5',
        'hierarchy.lvl6',
        'content'
      ],
      attributesToSnippet: [
        'content:30'
      ],
      attributesForFaceting: [
        'version',
        'hierarchy.lvl0',
        'hierarchy.lvl1'
      ],
      ranking: [
        'words',
        'filters',
        'typo',
        'attribute',
        'proximity',
        'exact',
        'custom'
      ],
      customRanking: [
        'desc(weight.pageRank)',
        'desc(weight.level)',
        'asc(weight.position)'
      ],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      separatorsToIndex: '_'
    });
    
    // Upload records in batches
    console.log('📤 Uploading records to Algolia...');
    const batchSize = 1000;
    let uploadedCount = 0;
    
    for (let i = 0; i < allRecords.length; i += batchSize) {
      const batch = allRecords.slice(i, i + batchSize);
      await index.saveObjects(batch);
      uploadedCount += batch.length;
      console.log(`   📦 Uploaded ${uploadedCount}/${allRecords.length} records...`);
    }
    
    // Save sample records locally for verification
    const sampleRecords = Object.values(samplesByProduct).slice(0, 10);
    fs.writeFileSync('./sample-records.json', JSON.stringify(sampleRecords, null, 2));
    console.log(`💾 Saved ${sampleRecords.length} sample records to sample-records.json`);
    
    console.log(`\n✅ Successfully indexed ${allRecords.length} records to Algolia index "${indexName}"`);
    console.log('🎉 Indexing completed successfully!');
    console.log('📁 Check sample-records.json to see the exact data structure');
    console.log('🎯 Records are formatted correctly for ProductItem.tsx');
    
  } catch (error) {
    console.error('❌ Error during indexing:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

function getAllMarkdownFiles(directory) {
  const files = [];
  
  function scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (item.match(/\.(md|mdx)$/)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error.message);
    }
  }
  
  scanDirectory(directory);
  return files;
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n⚠️  Indexing interrupted by user');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the indexing
console.log('🚀 Seqera Documentation Indexer');
console.log('================================\n');

// Verify environment
if (!fs.existsSync('package.json')) {
  console.warn('⚠️  Warning: package.json not found. Make sure you\'re in the correct directory.\n');
}

indexAllDocs();