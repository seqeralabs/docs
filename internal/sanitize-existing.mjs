import git from "simple-git";
import fs from "fs-extra";
import path from "path";
import "dotenv/config";
import { fileURLToPath } from "url";
import { sanitize } from "./src/sanitization.mjs";

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sanitizeExisting() {
  const args = process.argv.slice(2);
  const dirArgument = args.find((arg) => arg.startsWith("--dir="));
  let dir = dirArgument?.split("=")?.[1];
  if (!dir) dir = "platform-enterprise_versioned_docs";

  const destPath = path.join(__dirname, "..", dir);
  const pathExists = await fs.pathExists(destPath);

  if (!pathExists) {
    console.log("ℹ️ Path does not exist:", destPath);
    return;
  }

  console.log("ℹ️ Sanitizing path:", destPath);

  await sanitize(destPath);
}

sanitizeExisting().catch((err) => console.error(err));
