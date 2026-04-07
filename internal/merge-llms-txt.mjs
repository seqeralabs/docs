import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.join(__dirname, "..", "build");

const localFiles = [
  "llms-enterprise.txt",
  "llms-cloud.txt",
  "llms-api.txt",
  "llms-cli.txt",
  "llms-multiqc.txt",
  "llms-fusion.txt",
  "llms-wave.txt",
];

const localFullFiles = [
  "llms-enterprise-full.txt",
  "llms-cloud-full.txt",
  "llms-api-full.txt",
  "llms-cli-full.txt",
  "llms-multiqc-full.txt",
  "llms-fusion-full.txt",
  "llms-wave-full.txt",
];

const remoteFiles = [
  { filename: "llms-nextflow.txt", url: "https://docs-migration.netlify.app/llms-nextflow.txt" },
];

const remoteFullFiles = [
  { filename: "llms-nextflow-full.txt", url: "https://docs-migration.netlify.app/llms-nextflow-full.txt" },
];

const header = `# Seqera Docs

> Documentation for Seqera products — Seqera Platform Cloud, Seqera Platform Enterprise, Seqera Platform API, Seqera Platform CLI, Nextflow, MultiQC, Fusion, and Wave.

This file contains links to all Seqera product documentation following the llmstxt.org standard.`;

const fullHeader = `# Seqera Docs

> Documentation for Seqera products — Seqera Platform Cloud, Seqera Platform Enterprise, Seqera Platform API, Seqera Platform CLI, Nextflow, MultiQC, Fusion, and Wave.

This file contains the full content of all Seqera product documentation following the llmstxt.org standard.`;

async function mergeFiles(files, remotes, outputFile, headerText) {
  const parts = [headerText];

  for (const file of files) {
    const filePath = path.join(buildDir, file);
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, "utf-8");
      parts.push(content.trim());
      console.log(`  Merged ${file}`);
    } else {
      console.warn(`  Skipped ${file} (not found)`);
    }
  }

  for (const { filename, url } of remotes) {
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
}

console.log("Merging llms.txt...");
await mergeFiles(localFiles, remoteFiles, path.join(buildDir, "llms.txt"), header);

console.log("Merging llms-full.txt...");
await mergeFiles(localFullFiles, remoteFullFiles, path.join(buildDir, "llms-full.txt"), fullHeader);
