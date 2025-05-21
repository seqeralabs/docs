#!/bin/bash

# Check if a folder path was provided
if [ -z "$1" ]; then
  echo "Usage: ./convert.sh <PATH/TO/FOLDER>"
  exit 1
fi

# Navigate to the specified folder
folder_path="$1"

if [ ! -d "$folder_path" ]; then
  echo "Error: Folder '$folder_path' does not exist."
  exit 1
fi

# Find all .mdx files recursively
find "$folder_path" -type f -name "*.mdx" | while read -r file; do
  if grep -qE '^\s*import .* from .+;$' "$file"; then
    echo "Skipped (contains 'import ... from ...;'): $file"
    continue
  fi

  # Construct new filename with .md extension
  new_file="${file%.mdx}.md"
  mv "$file" "$new_file"
  echo "Converted: $file -> $new_file"
done

echo "All .mdx files without imports have been converted to .md."