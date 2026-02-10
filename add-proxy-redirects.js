#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const proxyRedirects = `
# Proxy rewrites - status 200 serves content from external URLs
# Only proxy routes that are NOT already served by this Docusaurus site
/platform-api/* https://seqera-docs-api.netlify.app/platform-api/:splat 200!
/nextflow/* https://docs-migration.netlify.app/nextflow/:splat 200!
`;

const redirectsPath = path.join(__dirname, 'build', '_redirects');
fs.appendFileSync(redirectsPath, proxyRedirects);
console.log('✅ Added proxy redirects to build/_redirects');
