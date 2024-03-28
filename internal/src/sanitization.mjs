import path from "path";
import fs from "fs-extra";
import fg from "fast-glob";
import prettier from "prettier";
import { fixAdmonitions } from "./fix-admonitions.mjs";
import { fixSnippets } from "./fix-snippets.mjs";
import { fixOther } from "./fix-other.mjs";
import { fixImages } from "./fix-images.mjs";
import { fixFrontmatter } from "./fix-frontmatter.mjs";

export async function sanitize(destPath) {
  // Get all markdown files
  const files = fg.globSync(`${destPath}/**/*.md`, {
    absolute: true,
    onlyFiles: true,
  });

  console.log(`ℹ️ Sanitizing ${files.length} markdown files`);

  for (const file of files) {
    // Sanitize file
    let content = fs.readFileSync(file, "utf8");
    content = fixFrontmatter(content);
    content = fixImages(content);
    content = fixOther(content);
    content = fixAdmonitions(content);
    content = fixSnippets(content);

    // Format file with prettier
    content = await prettier.format(content, { parser: "markdown" });

    // Write file
    await fs.writeFile(file, content);
  }

  console.log("✅ Sanitized");
}
