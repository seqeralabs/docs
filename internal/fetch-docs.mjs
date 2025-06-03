import git from "simple-git";
import fs from "fs-extra";
import path from "path";
import "dotenv/config";
import { fileURLToPath } from "url";
import { sanitize } from "./src/sanitization.mjs";

// Git config
const owner = "seqeralabs";
const repoName = "nf-tower-cloud";
const token = process.env.GITHUB_TOKEN;
const repoUrl = `https://${token}@github.com/${owner}/${repoName}.git`;

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destPath = path.join(__dirname, "..", "platform-enterprise_versioned_docs");
const tmpPath = path.join(__dirname, "tmp");

async function fetchAndSaveContents() {
  const args = process.argv.slice(2);
  const commitArgument = args.find((arg) => arg.startsWith("--commit="));
  const commitID = commitArgument?.split("=")?.[1];

  if (commitID) console.log(`Specified commit: ${commitID}`);

  // Clone the repository
  const tmpExists = await fs.pathExists(tmpPath);
  if (tmpExists) {
    console.log("Cloned repo already exists");
  } else {
    console.log(`Cloning ${repoName} into ./tmp`);
    await git().clone(repoUrl, tmpPath);
    console.log("✅ Cloned");
  }

  // Initialize and update the submodules
  const repo = git(tmpPath);
  await repo.submoduleUpdate(["--init", "--recursive"]);

  // Get the release tags
  await repo.fetch(["--tags"]);
  const tagList = await repo.tag();
  const tags = tagList.split("\n").filter(Boolean);

  // Only include enterprise tags
  const regex = /^v\d+\.\d+\.\d+-enterprise$/;
  let filteredTags = tags.filter((tag) => regex.test(tag));

  console.log(`${filteredTags.length} enterprise releases found`);
  console.log(`Latest release: ${filteredTags[filteredTags.length - 1]}`);

  // Bypass the tag filtering if a commit ID is provided
  if (commitID) filteredTags = [commitID];

  for (const tag of filteredTags) {
    // Checkout the tag
    await repo.checkout(tag);

    // Check for docs presence
    const docsPath = path.join(tmpPath, "docs");
    const pathExists = await fs.pathExists(docsPath);
    if (!pathExists) continue;

    // Create the destination folder
    let newDir = tag.replace("-enterprise", "");
    newDir = "version-" + newDir;
    const fullDestPath = path.join(destPath, newDir);
    await fs.ensureDir(fullDestPath);

    // Copy the 'docs' folder to the destination folder
    await fs.copy(docsPath, fullDestPath);
    console.log(`Saved contents for release ${tag}`);

    // Sanitize the contents
    await sanitize(fullDestPath);
  }

  console.log(`Processed ${filteredTags.length} releases`);
}

fetchAndSaveContents().catch((err) => console.error(err));
