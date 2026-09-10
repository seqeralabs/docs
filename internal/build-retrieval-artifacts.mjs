import crypto from "crypto";
import fs from "fs-extra";
import matter from "gray-matter";
import path from "path";
import zlib from "zlib";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "..");
const buildDir = path.join(repoRoot, "build");
const outputDir = path.join(buildDir, "retrieval");
const embeddingsDir = path.join(outputDir, "embeddings");

const SCHEMA_VERSION = "2026-07-15";
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const TOKEN_RE = /\w+|[^\w\s]/gu;
const SUPPORTED_EXTENSIONS = new Set([".md", ".mdx"]);

const PRODUCT_SOURCES = [
  {
    product: "platform-enterprise",
    title: "Seqera Platform Enterprise",
    docsDir: "platform-enterprise_docs",
    routeBasePath: "/platform-enterprise",
    tag: "platform-enterprise",
  },
  {
    product: "platform-cloud",
    title: "Seqera Platform Cloud",
    docsDir: "platform-cloud/docs",
    routeBasePath: "/platform-cloud",
    tag: "platform-cloud",
  },
  {
    product: "platform-api",
    title: "Seqera Platform API",
    docsDir: "platform-api-docs/docs",
    routeBasePath: "/platform-api",
    tag: "platform-api-docs",
  },
  {
    product: "platform-cli",
    title: "Seqera Platform CLI",
    docsDir: "platform-cli-docs/docs",
    routeBasePath: "/platform-cli",
    tag: "platform-cli-docs",
  },
  {
    product: "multiqc",
    title: "MultiQC",
    docsDir: "multiqc_docs/multiqc_repo/docs/markdown",
    routeBasePath: "/multiqc",
    tag: "multiqc",
  },
  {
    product: "fusion",
    title: "Fusion",
    docsDir: "fusion_docs",
    routeBasePath: "/fusion",
    tag: "fusion",
  },
  {
    product: "wave",
    title: "Wave",
    docsDir: "wave_docs/wave_repo/docs",
    routeBasePath: "/wave",
    tag: "wave",
  },
];

const BEDROCK_PROFILE = {
  id: "bedrock-titan-v2-1024",
  provider: "bedrock",
  model: "amazon.titan-embed-text-v2:0",
  dimensions: 1024,
  normalize: true,
};
const SUPPORTED_EMBEDDING_PROFILES = [BEDROCK_PROFILE];

function parseArgs() {
  const args = new Set(process.argv.slice(2));
  const values = new Map();
  for (const arg of process.argv.slice(2)) {
    const [key, value] = arg.split("=");
    if (value !== undefined) values.set(key, value);
  }

  return {
    validate: args.has("--validate"),
    includeEmbeddings:
      args.has("--embeddings") || values.get("--embedding-profile") === BEDROCK_PROFILE.id,
    embeddingProfile: values.get("--embedding-profile") || BEDROCK_PROFILE.id,
    limit: values.has("--limit") ? Number(values.get("--limit")) : null,
  };
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function fileSha256(filePath) {
  const hash = crypto.createHash("sha256");
  const stream = fs.createReadStream(filePath);
  for await (const chunk of stream) hash.update(chunk);
  return hash.digest("hex");
}

function countTokens(value) {
  return value.match(TOKEN_RE)?.length ?? 0;
}

function slugifyHeading(value) {
  return value
    .toLowerCase()
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function normalizeUrlPath(value) {
  return value.replace(/\/+/g, "/").replace(/\/$/, "");
}

function routeForFile(source, relativePath) {
  const parsed = path.parse(relativePath);
  const withoutExt = path.join(parsed.dir, parsed.name).replaceAll(path.sep, "/");
  let slug = withoutExt;
  if (slug === "index" || slug === source.product) slug = "";
  if (slug.endsWith("/index")) slug = slug.slice(0, -"index".length);

  const route = normalizeUrlPath(`${source.routeBasePath}/${slug}`);
  return `https://docs.seqera.io${route || source.routeBasePath}/`;
}

function extractTitle(content, filePath) {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  return path.parse(filePath).name.replace(/[-_]/g, " ");
}

function normalizeMarkdown(raw) {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/^import\s+.+?;?\n/gm, "")
    .replace(/^export\s+.+?;?\n/gm, "")
    .replace(/<Tabs[^>]*>/g, "")
    .replace(/<\/Tabs>/g, "")
    .replace(/<TabItem[^>]*>/g, "")
    .replace(/<\/TabItem>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitIntoSections(content, title) {
  const lines = content.split("\n");
  const sections = [];
  let current = { headings: [title], lines: [] };
  let stack = [title];

  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      if (current.lines.join("\n").trim()) sections.push(current);
      const level = heading[1].length;
      const text = heading[2].trim();
      stack = stack.slice(0, level - 1);
      stack[level - 1] = text;
      current = { headings: stack.filter(Boolean), lines: [line] };
    } else {
      current.lines.push(line);
    }
  }

  if (current.lines.join("\n").trim()) sections.push(current);
  return sections;
}

function findBreakPosition(text, targetTokenCount) {
  const tokens = [...text.matchAll(TOKEN_RE)];
  if (tokens.length <= targetTokenCount) return text.length;

  const target = tokens[Math.min(targetTokenCount, tokens.length - 1)].index ?? text.length;
  const windowStart = Math.max(0, target - 2000);
  const window = text.slice(windowStart, target);
  const candidates = [
    window.lastIndexOf("\n## "),
    window.lastIndexOf("\n### "),
    window.lastIndexOf("\n\n"),
    window.lastIndexOf(". "),
    window.lastIndexOf("\n"),
  ].filter((pos) => pos > 0);

  if (candidates.length === 0) return target;
  return windowStart + Math.max(...candidates) + 1;
}

function chunkSection(section) {
  const text = section.lines.join("\n").trim();
  if (!text) return [];
  if (countTokens(text) <= CHUNK_SIZE) return [text];

  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const remaining = text.slice(start).trimStart();
    if (!remaining) break;
    if (countTokens(remaining) <= CHUNK_SIZE) {
      chunks.push(remaining.trim());
      break;
    }

    const end = findBreakPosition(remaining, CHUNK_SIZE);
    const chunk = remaining.slice(0, end).trim();
    chunks.push(chunk);

    const chunkTokens = [...chunk.matchAll(TOKEN_RE)];
    if (CHUNK_OVERLAP <= 0 || chunkTokens.length <= CHUNK_OVERLAP) {
      start += end;
      continue;
    }
    const overlapStart = chunkTokens[chunkTokens.length - CHUNK_OVERLAP].index ?? chunk.length;
    start += Math.max(overlapStart, end);
  }
  return chunks;
}

async function walkDocs(dir) {
  const files = [];
  if (!(await fs.pathExists(dir))) return files;

  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (["node_modules", ".git", "_images", "assets"].includes(entry.name)) continue;
        await walk(fullPath);
      } else if (SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files.sort();
}

async function getGitCommit() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
  } catch {
    return process.env.COMMIT_REF || process.env.GITHUB_SHA || "unknown";
  }
}

function buildChunkRecord({ source, relativePath, title, section, text, index, sourceCommit }) {
  const contentHash = sha256(text);
  const url = routeForFile(source, relativePath);
  const anchorHeading = section.headings[section.headings.length - 1] || title;
  const anchor = slugifyHeading(anchorHeading);
  const chunkId = sha256(`${source.product}\0${relativePath}\0${index}\0${contentHash}`).slice(
    0,
    32,
  );

  return {
    schema_version: SCHEMA_VERSION,
    chunk_id: `${source.product}:${chunkId}`,
    source_id: "seqera-docs",
    source_path: relativePath,
    source_file: path.posix.join(source.docsDir, relativePath),
    source_commit: sourceCommit,
    product: source.product,
    product_title: source.title,
    tag: source.tag,
    kind: "docs",
    version: "latest",
    language: "en",
    title,
    hierarchy: [source.title, ...section.headings],
    heading_path: section.headings.join(" > "),
    url,
    anchor: anchor ? `#${anchor}` : "",
    content_hash: contentHash,
    content: text,
  };
}

async function buildChunks({ limit }) {
  const sourceCommit = await getGitCommit();
  const chunks = [];
  const productCounts = {};

  for (const source of PRODUCT_SOURCES) {
    const docsDir = path.join(repoRoot, source.docsDir);
    const files = await walkDocs(docsDir);
    if (files.length === 0) {
      console.warn(`Skipped ${source.product}: ${source.docsDir} not found or empty`);
      continue;
    }

    productCounts[source.product] = { files: files.length, chunks: 0 };
    for (const filePath of files) {
      const relativePath = path.relative(docsDir, filePath).replaceAll(path.sep, "/");
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = matter(raw);
      if (parsed.data?.draft === true) continue;

      const content = normalizeMarkdown(parsed.content);
      if (!content) continue;

      const title = parsed.data?.title || extractTitle(content, relativePath);
      const sections = splitIntoSections(content, title);
      let localIndex = 0;
      for (const section of sections) {
        for (const chunkText of chunkSection(section)) {
          chunks.push(
            buildChunkRecord({
              source,
              relativePath,
              title,
              section,
              text: chunkText,
              index: localIndex,
              sourceCommit,
            }),
          );
          localIndex += 1;
          productCounts[source.product].chunks += 1;
          if (limit && chunks.length >= limit) return { chunks, productCounts, sourceCommit };
        }
      }
    }
  }

  return { chunks, productCounts, sourceCommit };
}

async function writeJsonlGz(filePath, records) {
  const payload = records.map((record) => JSON.stringify(record)).join("\n") + "\n";
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, zlib.gzipSync(payload));
}

async function countJsonlGzRecords(filePath) {
  const text = zlib.gunzipSync(await fs.readFile(filePath)).toString("utf8").trim();
  return text ? text.split("\n").length : 0;
}

async function validateArtifacts() {
  const manifestPath = path.join(outputDir, "manifest.json");
  if (!(await fs.pathExists(manifestPath))) {
    throw new Error(`Missing retrieval manifest: ${path.relative(repoRoot, manifestPath)}`);
  }

  const manifest = await fs.readJson(manifestPath);
  const supportedProfileIds = new Set(
    (manifest.supported_embedding_profiles ?? []).map((profile) => profile.id),
  );
  if (supportedProfileIds.size === 0) {
    throw new Error("Retrieval manifest does not declare supported_embedding_profiles");
  }

  for (const [name, artifact] of Object.entries(manifest.artifacts ?? {})) {
    if (name === "embeddings") continue;
    const artifactPath = path.join(outputDir, artifact.path);
    if (!(await fs.pathExists(artifactPath))) {
      throw new Error(`Missing retrieval artifact: ${artifact.path}`);
    }
    const checksum = await fileSha256(artifactPath);
    if (checksum !== artifact.sha256) {
      throw new Error(`Checksum mismatch for ${artifact.path}`);
    }
    const records = await countJsonlGzRecords(artifactPath);
    if (records !== artifact.records) {
      throw new Error(`Record count mismatch for ${artifact.path}: ${records} != ${artifact.records}`);
    }
  }

  for (const [profile, artifact] of Object.entries(manifest.artifacts?.embeddings ?? {})) {
    if (!supportedProfileIds.has(profile)) {
      throw new Error(`Embedding artifact uses unsupported profile: ${profile}`);
    }
    const artifactPath = path.join(outputDir, artifact.path);
    if (!(await fs.pathExists(artifactPath))) {
      throw new Error(`Missing embedding artifact for ${profile}: ${artifact.path}`);
    }
    const checksum = await fileSha256(artifactPath);
    if (checksum !== artifact.sha256) {
      throw new Error(`Checksum mismatch for ${artifact.path}`);
    }
    const records = await countJsonlGzRecords(artifactPath);
    if (records !== artifact.records) {
      throw new Error(`Record count mismatch for ${artifact.path}: ${records} != ${artifact.records}`);
    }
  }

  console.log(
    `Validated retrieval artifacts: ${manifest.corpus?.chunk_count ?? 0} chunks, ` +
      `${Object.keys(manifest.artifacts?.embeddings ?? {}).length} embedding profiles`,
  );
}

function hmac(key, value, encoding) {
  return crypto.createHmac("sha256", key).update(value).digest(encoding);
}

function awsDateParts(date = new Date()) {
  const iso = date.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return {
    amzDate: iso,
    dateStamp: iso.slice(0, 8),
  };
}

function getAwsCredentials() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "Bedrock embeddings require AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in the environment.",
    );
  }
  return {
    accessKeyId,
    secretAccessKey,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  };
}

function signBedrockRequest({ body, region, host, path: requestPath }) {
  const credentials = getAwsCredentials();
  const { amzDate, dateStamp } = awsDateParts();
  const service = "bedrock";
  const payloadHash = sha256(body);
  const headers = {
    "content-type": "application/json",
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (credentials.sessionToken) headers["x-amz-security-token"] = credentials.sessionToken;

  const sortedHeaderNames = Object.keys(headers).sort();
  const canonicalHeaders = sortedHeaderNames
    .map((name) => `${name}:${headers[name]}`)
    .join("\n");
  const signedHeaders = sortedHeaderNames.join(";");
  const canonicalRequest = [
    "POST",
    requestPath,
    "",
    `${canonicalHeaders}\n`,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");
  const dateKey = hmac(`AWS4${credentials.secretAccessKey}`, dateStamp);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, service);
  const signingKey = hmac(serviceKey, "aws4_request");
  const signature = hmac(signingKey, stringToSign, "hex");

  return {
    ...headers,
    authorization:
      `AWS4-HMAC-SHA256 Credential=${credentials.accessKeyId}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

async function embedWithBedrock(chunks) {
  const region =
    process.env.BEDROCK_REGION ||
    process.env.AWS_REGION ||
    process.env.AWS_DEFAULT_REGION ||
    "us-east-1";
  const host = `bedrock-runtime.${region}.amazonaws.com`;
  const requestPath = `/model/${encodeURIComponent(BEDROCK_PROFILE.model)}/invoke`;
  const url = `https://${host}${requestPath}`;
  const records = [];

  for (const [index, chunk] of chunks.entries()) {
    const body = JSON.stringify({
        inputText: chunk.content,
        dimensions: BEDROCK_PROFILE.dimensions,
        normalize: BEDROCK_PROFILE.normalize,
    });
    const response = await fetch(url, {
      method: "POST",
      headers: signBedrockRequest({ body, region, host, path: requestPath }),
      body,
    });
    if (!response.ok) {
      throw new Error(
        `Bedrock embedding failed for ${chunk.chunk_id}: ${response.status} ${await response.text()}`,
      );
    }
    const responseBody = await response.json();
    records.push({
      schema_version: SCHEMA_VERSION,
      chunk_id: chunk.chunk_id,
      content_hash: chunk.content_hash,
      embedding_profile: BEDROCK_PROFILE.id,
      embedding_provider: BEDROCK_PROFILE.provider,
      embedding_model: BEDROCK_PROFILE.model,
      embedding_dimensions: BEDROCK_PROFILE.dimensions,
      embedding_normalized: BEDROCK_PROFILE.normalize,
      embedding: responseBody.embedding,
    });

    if ((index + 1) % 25 === 0) {
      console.log(`Embedded ${index + 1}/${chunks.length} chunks`);
    }
  }

  return records;
}

async function buildManifest({ chunks, productCounts, sourceCommit, artifacts }) {
  return {
    schema_version: SCHEMA_VERSION,
    generated_at: new Date().toISOString(),
    source_repo: "seqeralabs/docs",
    source_commit: sourceCommit,
    corpus: {
      source_id: "seqera-docs",
      scope: "official-docs",
      language: "en",
      chunk_count: chunks.length,
      products: productCounts,
    },
    chunking: {
      strategy: "heading-aware-markdown",
      chunk_size_tokens: CHUNK_SIZE,
      chunk_overlap_tokens: CHUNK_OVERLAP,
      token_counter: "javascript-regex-approximation",
    },
    supported_embedding_profiles: SUPPORTED_EMBEDDING_PROFILES,
    artifacts,
  };
}

async function main() {
  const options = parseArgs();
  if (options.validate) {
    await validateArtifacts();
    return;
  }

  if (options.includeEmbeddings && options.embeddingProfile !== BEDROCK_PROFILE.id) {
    throw new Error(`Unsupported embedding profile: ${options.embeddingProfile}`);
  }
  if (options.includeEmbeddings) {
    getAwsCredentials();
  }

  await fs.ensureDir(outputDir);
  const { chunks, productCounts, sourceCommit } = await buildChunks({ limit: options.limit });
  const chunksPath = path.join(outputDir, "chunks.jsonl.gz");
  await writeJsonlGz(chunksPath, chunks);

  const artifacts = {
    chunks: {
      path: "chunks.jsonl.gz",
      format: "jsonl+gzip",
      records: chunks.length,
      sha256: await fileSha256(chunksPath),
    },
  };
  if (options.includeEmbeddings) {
    const embeddings = await embedWithBedrock(chunks);
    const embeddingPath = path.join(embeddingsDir, `${BEDROCK_PROFILE.id}.jsonl.gz`);
    await writeJsonlGz(embeddingPath, embeddings);
    artifacts.embeddings = {
      [BEDROCK_PROFILE.id]: {
        path: `embeddings/${BEDROCK_PROFILE.id}.jsonl.gz`,
        format: "jsonl+gzip",
        records: embeddings.length,
        sha256: await fileSha256(embeddingPath),
      },
    };
  }

  const manifest = await buildManifest({
    chunks,
    productCounts,
    sourceCommit,
    artifacts,
  });
  const manifestPath = path.join(outputDir, "manifest.json");
  await fs.writeJson(manifestPath, manifest, { spaces: 2 });

  console.log(`Wrote ${chunks.length} chunks to ${path.relative(repoRoot, chunksPath)}`);
  if (options.includeEmbeddings) {
    console.log(`Wrote ${chunks.length} embeddings for ${BEDROCK_PROFILE.id}`);
  }
  console.log(`Wrote manifest to ${path.relative(repoRoot, manifestPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
