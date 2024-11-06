import React from "react";
// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import CodeBlock from "@theme-original/CodeBlock";
import Button from "@site/src/components/Button";

export default {
  // Re-use the default mapping
  ...MDXComponents,
  CodeBlock,
  Button,
};
