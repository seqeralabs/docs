import git from "simple-git";
import fs from "fs-extra";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repositories = [
  {
    name: "multiqc",
    url: "https://github.com/MultiQC/MultiQC.git",
    path: path.join(__dirname, "..", "multiqc_docs", "multiqc_repo"),
    branch: "main",
  },
  {
    name: "wave",
    url: "https://github.com/seqeralabs/wave.git",
    path: path.join(__dirname, "..", "wave_docs", "wave_repo"),
    branch: "master",
  },
];

// Function to clone or update a repository
async function cloneOrUpdateRepo({ name, url, path: repoPath, branch }) {
  const exists = await fs.pathExists(repoPath + "/.git");

  try {
    if (exists) {
      console.log(
        `${name}: Cloned repo already exists, will pull latest changes`,
      );
      // pull and checkout the branch
      await git(repoPath).pull("origin", branch);
      console.log(`✅ ${name}: Pulled latest changes`);
    } else {
      console.log(`${name}: Cloning into ${repoPath}`);
      await git().clone(url, repoPath);
      console.log(`✅ ${name}: Cloned`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${repoPath}:`);
    console.error(error.message);
    if (exists) {
      console.error(`Try removing the directory: ${repoPath}`);
    }
    // Exit with error code 1 to stop any subsequent npm scripts
    process.exit(1);
  }

  return git(repoPath);
}

// Clone/update all repositories
async function processRepositories() {
  for (const repo of repositories) {
    try {
      await cloneOrUpdateRepo(repo);
    } catch (error) {
      console.error(`❌ Error processing ${repo.name}:`, error);
    }
  }
}

// Execute
processRepositories().catch(console.error);
