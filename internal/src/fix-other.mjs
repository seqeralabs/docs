export function fixOther(content) {
  // Remove prettier-ignore comments
  const unwantedStrings = [
    /<!-- prettier-ignore -->/g,
    /<!-- prettier-ignore-start -->/g,
    /<!-- prettier-ignore-end -->/g,
  ];
  for (const unwantedString of unwantedStrings) {
    content = content.replace(unwantedString, "");
  }

  // Fix <br> tags
  content = content.replace(/<br>/g, "<br/>");

  // Escape certain tags
  content = content.replace(/<USERNAME>/g, /\<USERNAME\>/);
  content = content.replace(/<PASSWORD>/g, /\PASSWORD\>/);
  content = content.replace(/<YOUR NAME>/g, /\<YOUR NAME\>/);
  content = content.replace(/<YOUR HOST>/g, /\<YOUR HOST\>/);

  return content;
}
