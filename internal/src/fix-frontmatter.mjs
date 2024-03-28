export function fixFrontmatter(content) {
  const lines = content.split("\n");

  // Add title attribute if missing
  if (lines[0] === "---") {
    if (!lines.some((line) => line.startsWith("title:"))) {
      const title = path.basename(file, ".md");
      lines.splice(1, 0, `title: "${title}"`);
    }
  }

  return lines.join("\n");
}
