const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const algoliasearch = require('algoliasearch');

// Algolia configuration
const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_API_KEY;
const indexName = process.env.ALGOLIA_INDEX_NAME;

if (!appId || !apiKey || !indexName) {
  console.error('Missing required Algolia environment variables:');
  console.error('ALGOLIA_APP_ID:', !!appId);
  console.error('ALGOLIA_API_KEY:', !!apiKey);
  console.error('ALGOLIA_INDEX_NAME:', !!indexName);
  process.exit(1);
}

const client = algoliasearch(appId, apiKey);
const index = client.initIndex(indexName);

// Documentation directories to index
const DOC_DIRECTORIES = [
  'platform-enterprise_docs',
  'platform-enterprise_versioned_docs',
  'fusion_docs',
  'wave_docs',
  'multiqc_docs',
  'platform-cloud/docs',
  'platform-api-docs/docs'
];

function getAllMarkdownFiles(dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist, skipping...`);
    return files;
  }

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip certain directories
        if (entry.name.startsWith('.') || 
            entry.name === 'node_modules' || 
            entry.name === '_images' ||
            entry.name === '_logos' ||
            entry.name === '_templates') {
          continue;
        }
        traverse(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function extractTextContent(content) {
  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  content = content.replace(/`[^`]*`/g, '');
  // Remove HTML tags
  content = content.replace(/<[^>]*>/g, '');
  // Remove markdown links but keep text
  content = content.replace(/\[([^\]]*)\]\([^\)]*\)/g, '$1');
  // Remove markdown formatting
  content = content.replace(/[*_#]/g, '');
  // Clean up extra whitespace
  content = content.replace(/\s+/g, ' ').trim();
  
  return content;
}

function generateUrlFromPath(filePath) {
  // Convert file path to URL path
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
  
  // Ensure URL starts with /
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  
  return url;
}

function getDocumentType(filePath) {
  if (filePath.includes('platform-enterprise')) return 'Platform Enterprise';
  if (filePath.includes('fusion')) return 'Fusion';
  if (filePath.includes('wave')) return 'Wave';
  if (filePath.includes('multiqc')) return 'MultiQC';
  if (filePath.includes('platform-cloud')) return 'Platform Cloud';
  if (filePath.includes('platform-api')) return 'Platform API';
  return 'Documentation';
}

function processMarkdownFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(fileContent);
    const { data: frontmatter, content } = parsed;
    
    // Extract title
    const title = frontmatter.title || 
                 frontmatter.name || 
                 path.basename(filePath, path.extname(filePath));
    
    // Extract description
    const description = frontmatter.description || 
                       frontmatter.summary || 
                       extractTextContent(content).substring(0, 200);
    
    // Generate URL
    const url = generateUrlFromPath(filePath);
    
    // Get document type
    const docType = getDocumentType(filePath);
    
    // Extract headings and create sections
    const headings = content.match(/^#{1,6}\s+(.+)$/gm) || [];
    const sections = [];
    
    if (headings.length > 0) {
      // Split content by headings
      const contentParts = content.split(/^#{1,6}\s+.+$/gm);
      
      headings.forEach((heading, index) => {
        const headingText = heading.replace(/^#{1,6}\s+/, '');
        const sectionContent = contentParts[index + 1] || '';
        const cleanContent = extractTextContent(sectionContent);
        
        if (cleanContent.length > 20) { // Only index substantial content
          sections.push({
            objectID: `${url}#${headingText.toLowerCase().replace(/\s+/g, '-')}`,
            title: headingText,
            content: cleanContent.substring(0, 8000), // Limit content length
            url: `${url}#${headingText.toLowerCase().replace(/\s+/g, '-')}`,
            type: 'section',
            docType,
            hierarchy: [title, headingText],
            _tags: [docType.toLowerCase().replace(/\s+/g, '-')]
          });
        }
      });
    }
    
    // Main document record
    const mainRecord = {
      objectID: url,
      title,
      content: extractTextContent(content).substring(0, 8000),
      description,
      url,
      type: 'page',
      docType,
      hierarchy: [title],
      _tags: [docType.toLowerCase().replace(/\s+/g, '-')]
    };
    
    return [mainRecord, ...sections];
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return [];
  }
}

async function indexDocuments() {
  console.log('🔍 Starting documentation indexing...');
  
  let allRecords = [];
  let processedFiles = 0;
  
  for (const docDir of DOC_DIRECTORIES) {
    console.log(`📂 Processing directory: ${docDir}`);
    const markdownFiles = getAllMarkdownFiles(docDir);
    
    for (const file of markdownFiles) {
      const records = processMarkdownFile(file);
      allRecords.push(...records);
      processedFiles++;
      
      if (processedFiles % 50 === 0) {
        console.log(`   Processed ${processedFiles} files...`);
      }
    }
  }
  
  console.log(`📝 Total records to index: ${allRecords.length} from ${processedFiles} files`);
  
  if (allRecords.length === 0) {
    console.log('❌ No records to index. Exiting...');
    return;
  }
  
  try {
    // Clear existing index and add new records
    console.log('🧹 Clearing existing index...');
    await index.clearObjects();
    
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

// Run the indexing
indexDocuments();