import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { fileURLToPath } from 'url';
import { parse } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPEC_PATH = path.resolve(__dirname, '../seqera-api-latest.yml');
const OUTPUT_DIR = path.resolve(__dirname, '../docs/parameter-tables');

// Utility to safely dereference $ref fields
function resolveRef(ref, spec) {
  const parts = ref.replace(/^#\//, '').split('/');
  return parts.reduce((obj, key) => (obj ? obj[key] : null), spec);
}

function formatParameter(param) {
  return {
    Name: `\`${param.name}\``,
    Type: param.schema?.type || 'unknown',
    Location: param.in || 'unknown',
    'Req/Opt': param.required ? 'Required' : 'Optional',
    Description: (param.description || '').replace(/\n/g, ' '),
  };
}

function formatRequestBody(schema, spec, required = [], parentPath = '') {
  const properties = schema?.properties || {};
  const rows = [];

  for (const [key, prop] of Object.entries(properties)) {
    const resolved = prop.$ref ? resolveRef(prop.$ref, spec) : prop;
    const fullKey = parentPath ? `${parentPath}.${key}` : key;

    // Add row for this field
    rows.push({
      Name: fullKey,
      Type: resolved.type || 'object',
      'Req/Opt': required.includes(key) ? 'Required' : 'Optional',
      Description: (resolved.description || '').replace(/\n/g, ' '),
    });

    // Recurse into nested object
    if (resolved.type === 'object' && resolved.properties) {
      const childRequired = resolved.required || [];
      rows.push(...formatRequestBody(resolved, spec, childRequired, fullKey));
    }

    // Handle arrays of objects
    if (resolved.type === 'array' && resolved.items) {
      const items = resolved.items.$ref
        ? resolveRef(resolved.items.$ref, spec)
        : resolved.items;

      if (items.type === 'object' && items.properties) {
        const childRequired = items.required || [];
        rows.push(...formatRequestBody(items, spec, childRequired, `${fullKey}[]`));
      }
    }
  }

  return rows;
}


function formatResponseBody(schema, spec, required = []) {
  const properties = schema?.properties || {};
  return Object.entries(properties).map(([key, prop]) => {
    const resolved = prop.$ref ? resolveRef(prop.$ref, spec) : prop;
    return {
      Name: `  ${key}`,
      Type: resolved.type || 'object',
      'Req/Opt': required.includes(key) ? 'Required' : 'Optional',
      Description: (resolved.description || '').replace(/\n/g, ' '),
    };
  });
}

function writeYaml(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, YAML.stringify(data), 'utf-8');
  console.log(`✅ Wrote: ${filePath}`);
}

const specContent = fs.readFileSync(SPEC_PATH, 'utf-8');
const spec = parse(specContent);

const taggedOps = {};

for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
  for (const method of Object.keys(pathItem)) {
    const op = pathItem[method];
    if (!op.tags) continue;

    for (const tag of op.tags) {
      if (!taggedOps[tag]) taggedOps[tag] = [];

      taggedOps[tag].push({
        path: pathKey,
        method: method.toUpperCase(),
        operationId: op.operationId,
        summary: op.summary,
        parameters: [...(pathItem.parameters || []), ...(op.parameters || [])],
        requestBody: op.requestBody,
      });
    }
  }
}

for (const [tag, operations] of Object.entries(taggedOps)) {
  const paramRows = [];
  const bodyRows = [];
  const responseRows = [];

  operations.forEach((op) => {
    op.parameters.forEach((p) => {
      const param = p.$ref ? resolveRef(p.$ref, spec) : p;
      paramRows.push(formatParameter(param));
    });

    if (op.requestBody?.content?.['application/json']?.schema) {
      const schema = op.requestBody.content['application/json'].schema;
      const resolved = schema.$ref ? resolveRef(schema.$ref, spec) : schema;
      const reqList = resolved.required || [];

      const sectionLabel = {
        Name: `**${op.operationId}**`,
        Type: '',
        'Req/Opt': '',
        Description: op.summary || '',
      };
      bodyRows.push(sectionLabel);
      bodyRows.push(...formatRequestBody(resolved, spec, reqList));
    }

    operations.forEach((op) => {
      const response = op.responses?.['200']?.content?.['application/json']?.schema;
      if (!response) return;
    
      const resolved = response.$ref ? resolveRef(response.$ref, spec) : response;
      const reqList = resolved.required || [];
    
      const sectionLabel = {
        Name: `**${op.operationId}**`,
        Type: '',
        'Req/Opt': '',
        Description: op.summary || '',
      };
      responseRows.push(sectionLabel);
    
      if (resolved.properties) {
        responseRows.push(...formatResponseBody(resolved, spec, reqList));
      } else {
        responseRows.push({
          Name: '  (no properties)',
          Type: resolved.type || 'object',
          'Req/Opt': '',
          Description: 'No properties defined in response schema or unable to resolve.',
        });
      }
    });
  });

  const safeTag = tag.replace(/\s+/g, '-').toLowerCase();
  const tagDir = path.join(OUTPUT_DIR, safeTag); 
  
  // Deduplicate parameters by name and location
  const seenParams = new Set();
  const uniqueParams = paramRows.filter((param) => {
    const key = `${param.Name}|${param.Location}`;
    if (seenParams.has(key)) return false;
    seenParams.add(key);
    return true;
  });

  if (paramRows.length > 0) {
    writeYaml(path.join(tagDir, `parameters.yml`), uniqueParams); 
  }
  if (bodyRows.length > 0) {
    writeYaml(path.join(tagDir, `request-bodies.yml`), bodyRows); 
  }  
  if (responseRows.length > 0) {
    writeYaml(path.join(tagDir, `responses.yml`), responseRows);
  }  
}
