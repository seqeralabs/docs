export function fixSnippets(content) {
  const snippetMatch = /\n\s+```(.+?)\n\s+--8<--\s+"docs(.+?)"\n\s+```\n/g;
  content = content.replace(snippetMatch, (match, type, filePath) => {
    return "\n\n```" + type + " file=.." + filePath + "\n\n```\n";
  });
  content = content.replace(/\n\s+--8<--\s+"docs(.+?)"/g, " file=..$1");
  return content;
}
