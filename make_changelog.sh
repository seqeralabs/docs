#!/bin/bash

# Check if two arguments are passed
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <repository-name> <tag>"
  exit 1
fi

# Assign arguments to variables
REPO=$1
TAG=$2

# Capitalize the first letter of the tag
CAPITALIZED_TAG="$(echo "$TAG" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')"

# Fetch the releases and process them
gh -R "$REPO" release list --json tagName,publishedAt | jq -r '.[] | "\(.tagName) \(.publishedAt)"' | while read tag publishedAt; do
  # Format the date to yyyy-mm-dd
  date=$(echo $publishedAt | cut -d'T' -f1)

  # Create a file in changelog/{tag} directory with the name {tagName}.mdx
  filename="changelog/${TAG}/${tag}.mdx"

  # Check if the file already exists
  if [ ! -f "$filename" ]; then
    # Fetch the body (release notes) for the current tag
    body=$(gh -R "$REPO" release view "$tag" --json body -q '.body')

    # Write the content to the file
    cat <<EOF > "$filename"
---
title: ${CAPITALIZED_TAG} ${tag}
date: ${date}
tags: [${TAG}]
---

${body}
EOF

    echo "Created file: $filename"
  else
    echo "File already exists: $filename"
  fi
done
