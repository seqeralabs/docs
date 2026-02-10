#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const proxyRedirects = `
# Proxy rewrites - status 200 serves content from external URLs
/platform-api/* https://seqera-docs-api.netlify.app/platform-api/:splat 200!
/nextflow/* https://docs-migration.netlify.app/nextflow/:splat 200!
/platform-enterprise/* https://deploy-preview-1011--seqera-docs.netlify.app/platform-enterprise/:splat 200!
/platform-cloud/* https://deploy-preview-1011--seqera-docs.netlify.app/platform-cloud/:splat 200!
/platform-cli/* https://deploy-preview-1011--seqera-docs.netlify.app/platform-cli/:splat 200!
/fusion/* https://deploy-preview-1011--seqera-docs.netlify.app/fusion/:splat 200!
/wave/* https://deploy-preview-1011--seqera-docs.netlify.app/wave/:splat 200!
/multiqc/* https://deploy-preview-1011--seqera-docs.netlify.app/multiqc/:splat 200!
/changelog/* https://deploy-preview-1011--seqera-docs.netlify.app/changelog/:splat 200!
`;

const redirectsPath = path.join(__dirname, 'build', '_redirects');
fs.appendFileSync(redirectsPath, proxyRedirects);
console.log('✅ Added proxy redirects to build/_redirects');
