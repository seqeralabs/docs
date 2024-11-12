import git from "simple-git";
import fs from "fs-extra";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const repoUrl = `https://github.com/MultiQC/MultiQC.git`;

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tmpPath = path.join(__dirname, "..", "multiqc_docs", "multiqc_repo");

// Clone the repository
const tmpExists = await fs.pathExists(tmpPath);
if (tmpExists) {
  console.log("Cloned repo already exists, will pull latest changes");
  await git(tmpPath).pull();
  console.log("✅ Pulled latest changes");
} else {
  console.log(`Cloning MultiQC into ${tmpPath}`);
  await git().clone(repoUrl, tmpPath);
  console.log("✅ Cloned");
}

// Initialize and update the submodules
const repo = git(tmpPath);