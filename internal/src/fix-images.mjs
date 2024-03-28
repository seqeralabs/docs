export function fixImages(content) {
  // Prepend "./" to image paths
  return content.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    (match, altText, imagePath) => {
      if (imagePath.startsWith("./") || imagePath.startsWith("../"))
        return match;
      return `![${altText}](./${imagePath})`;
    },
  );
}
