import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.join(__dirname, "..", "build");
const outputFile = path.join(buildDir, "llms.txt");

const localFiles = [
  "llms-enterprise.txt",
  "llms-cloud.txt",
  "llms-api.txt",
  "llms-cli.txt",
  "llms-multiqc.txt",
  "llms-fusion.txt",
  "llms-wave.txt",
];

const remoteFiles = [
  { filename: "llms-nextflow.txt", url: "https://docs-migration.netlify.app/llms-nextflow.txt" },
];

const header = `# Seqera Docs

> Documentation for Seqera products — Seqera Platform Cloud, Seqera Platform Enterprise, Seqera Platform API, Seqera Platform CLI, Nextflow, MultiQC, Fusion, and Wave.

This file contains links to all Seqera product documentation following the llmstxt.org standard.`;

const parts = [header];

for (const file of localFiles) {
  const filePath = path.join(buildDir, file);
  if (await fs.pathExists(filePath)) {
    const content = await fs.readFile(filePath, "utf-8");
    parts.push(content.trim());
    console.log(`  Merged ${file}`);
  } else {
    console.warn(`  Skipped ${file} (not found)`);
  }
}

for (const { filename, url } of remoteFiles) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const content = await response.text();
      parts.push(content.trim());
      console.log(`  Merged ${filename} (from ${url})`);
    } else {
      console.warn(`  Skipped ${filename} (HTTP ${response.status})`);
    }
  } catch (err) {
    console.warn(`  Skipped ${filename} (fetch failed: ${err.message})`);
  }
}

await fs.writeFile(outputFile, parts.join("\n\n") + "\n");
console.log(`\nWrote ${outputFile}`);
