const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const algoliasearch = require('algoliasearch');

// Algolia client initialization
const client = algoliasearch(5E8JEKSR3W, secrets.ALGOLIA_API_KEY);
const index = client.initIndex(test_docs_webhooks);

// Directory containing Markdown files
const docsDir = path.join(__dirname, '../docs');

function parseMarkdown(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Split content into sections
  const sections = content.split(/\n## /).map((section, idx) => ({
    objectID: `${path.basename(filePath, '.md')}-${idx}`,
    title: idx === 0 ? data.title : section.split('\n')[0].trim(),
    description: idx === 0 ? data.description : null,
    tags: data.tags || [],
    content: idx === 0 ? section : section.replace(/\n/g, ' ').trim(), // Simplify content
  }));

  return sections;
}

function indexDocs() {
  const files = fs.readdirSync(docsDir).filter((file) => file.endsWith('.md'));
  const records = [];

  files.forEach((file) => {
    const filePath = path.join(docsDir, file);
    const parsedSections = parseMarkdown(filePath);
    records.push(...parsedSections);
  });

  // Push records to Algolia
  index.saveObjects(records).then(() => {
    console.log('Indexed successfully!');
  }).catch((err) => {
    console.error('Error indexing:', err);
  });
}

indexDocs();
