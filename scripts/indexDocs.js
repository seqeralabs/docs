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
  // Convert file path to URL path - must match your actual site URLs
  let url = filePath
    .replace(/^platform-enterprise_docs\//, '/platform/')
    .replace(/^platform-enterprise_versioned_docs\/version-([^\/]+)\//, '/platform/$1/')
    .replace(/^fusion_docs\//, '/fusion/')
    .replace(/^wave_docs\//, '/wave/')
    .replace(/^multiqc_docs\//, '/multiqc/')
    .replace(/^platform-cloud\/docs\//, '/cloud/')
    .replace(/^platform-api-docs\/docs\//, '/api/')
    .replace(/\.mdx?$/, '')
    .replace(/\/index$/, '');
  
  // Add the base domain to match your crawler
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
  // Create objectID similar to DocSearch crawler
  const anchor = lvl2 ? `#${lvl2.toLowerCase().replace(/\s+/g, '-')}` : '';
  const objectID = url + (anchor || '');
  
  const record = {
    objectID: objectID,
    url: url,
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
    anchor: anchor
  };
  
  // Add version for platform-enterprise docs
  if (version) {
    record.version = [version];
  }
  
  return record;
}

async function indexAllDocs() {
  try {
    console.log('🔍 Starting documentation indexing...');
    
    let allRecords = [];
    let totalFiles = 0;
    
    for (const dir of DOC_DIRECTORIES) {
      if (!fs.existsSync(dir)) {
        console.log(`⚠️  Directory ${dir} does not exist, skipping...`);
        continue;
      }
      
      console.log(`📂 Processing directory: ${dir}`);
      const files = getAllMarkdownFiles(dir);
      
      for (const file of files) {
        const records = processMarkdownFile(file);
        allRecords.push(...records);
        totalFiles++;
        
        if (totalFiles % 25 === 0) {
          console.log(`   Processed ${totalFiles} files...`);
        }
      }
    }
    
    console.log(`📝 Total records to index: ${allRecords.length} from ${totalFiles} files`);
    
    if (allRecords.length === 0) {
      console.log('❌ No records to index');
      return;
    }
    
    // Clear existing index
    console.log('🧹 Clearing existing index...');
    await index.clearObjects();
    
    // Upload new records in batches
    console.log('📤 Uploading new records to Algolia...');
    const { objectIDs } = await index.saveObjects(allRecords);
    
    console.log(`✅ Successfully indexed ${objectIDs.length} records to Algolia index "${indexName}"`);
    console.log('🎉 Indexing completed successfully!');
    console.log('💡 Existing search settings preserved');
    
  } catch (error) {
    console.error('❌ Error during indexing:', error);
    process.exit(1);
  }
}

function getAllMarkdownFiles(directory) {
  const files = [];
  
  function scanDirectory(dir) {
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
  }
  
  scanDirectory(directory);
  return files;
}

// Run the indexing
indexAllDocs();