import git from "simple-git";
import fs from "fs-extra";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repositories = [
  {
    name: 'multiqc',
    url: 'https://github.com/MultiQC/MultiQC.git',
    path: path.join(__dirname, "..", "multiqc_docs", "multiqc_repo")
  },
  {
    name: 'wave',
    url: 'https://github.com/seqeralabs/wave.git',
    path: path.join(__dirname, "..", "wave_docs", "wave_repo")
  }
];

// Function to clone or update a repository
async function cloneOrUpdateRepo({ name, url, path: repoPath }) {
  const exists = await fs.pathExists(repoPath + "/.git");
  
  if (exists) {
    console.log(`${name}: Cloned repo already exists, will pull latest changes`);
    await git(repoPath).pull();
    console.log(`✅ ${name}: Pulled latest changes`);
  } else {
    console.log(`${name}: Cloning into ${repoPath}`);
    await git().clone(url, repoPath);
    console.log(`✅ ${name}: Cloned`);
  }

  // Initialize repo for submodule operations if needed
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