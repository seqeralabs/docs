import React from "react";
// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import CodeBlock from "@theme-original/CodeBlock";

export default {
  // Re-use the default mapping
  ...MDXComponents,
  CodeBlock,
};
