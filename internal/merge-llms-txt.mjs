import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LLMS_TXT_PATH = path.join(__dirname, "..", "build", "llms.txt");

// Sub-sites served via Netlify rewrites that are absent from the local build.
// Each site must have the llms-txt plugin installed and generating URLs
// relative to https://docs.seqera.io (not their own Netlify domain).
const REMOTE_ORIGINS = [
  { name: "nextflow", url: "https://docs-migration.netlify.app/llms.txt" },
  { name: "platform-api", url: "https://seqera-docs-api.netlify.app/llms.txt" },
];

/**
 * Strips the llms.txt header (title, description, top-level links) and
 * returns only the ## section content.
 */
function extractSections(text) {
  const lines = text.split("\n");
  const firstSection = lines.findIndex((line) => line.startsWith("## "));
  if (firstSection === -1) return "";
  return lines.slice(firstSection).join("\n");
}

async function mergeLlmsTxt() {
  if (!(await fs.pathExists(LLMS_TXT_PATH))) {
    console.error("❌ merge-llms-txt: build/llms.txt not found. Run the build first.");
    process.exit(1);
  }

  let base = await fs.readFile(LLMS_TXT_PATH, "utf-8");

  for (const { name, url } of REMOTE_ORIGINS) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`⚠️  merge-llms-txt: ${name} returned ${response.status} — skipping`);
        continue;
      }
      const sections = extractSections(await response.text());
      if (!sections) {
        console.warn(`⚠️  merge-llms-txt: no ## sections found in ${name} llms.txt — skipping`);
        continue;
      }
      base += "\n" + sections;
      console.log(`✅ merge-llms-txt: merged ${name}`);
    } catch (error) {
      console.warn(`⚠️  merge-llms-txt: failed to fetch ${name} — skipping`);
      console.warn(`   ${error.message}`);
    }
  }

  await fs.writeFile(LLMS_TXT_PATH, base, "utf-8");
  console.log("✅ merge-llms-txt: build/llms.txt updated");
}

mergeLlmsTxt().catch((error) => {
  console.error("❌ merge-llms-txt failed:", error);
  process.exit(1);
});
