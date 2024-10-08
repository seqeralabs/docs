#!/bin/bash

# Check if gum is installed
if ! command -v gum &> /dev/null
then
    echo "Error: 'gum' command not found. Please install it using 'brew install gum'."
    exit 1
fi

# Prompt for repository if not supplied as an argument
if [ -z "$1" ]; then
    REPO=$(gum choose \
      "nextflow-io/nextflow" \
      "MultiQC/MultiQC" \
      "seqeralabs/fusion" \
      "seqeralabs/wave" \
      "seqeralabs/platform" \
      "[ other ]")

    # Set the corresponding name (tag) and colour based on the repository selected
    case "$REPO" in
        "nextflow-io/nextflow")
            TAG="nextflow"
            COLOR="32" # Green
            ;;
        "MultiQC/MultiQC")
            TAG="multiqc"
            COLOR="214" # Orange
            ;;
        "seqeralabs/fusion")
            TAG="fusion"
            COLOR="196" # Red
            ;;
        "seqeralabs/wave")
            TAG="wave"
            COLOR="33" # Blue
            ;;
        "seqeralabs/platform")
            TAG="seqera-cloud"
            COLOR="93" # Purple
            ;;
        "[ other ]")
            # If "other" is selected, prompt for both repository and tag name
            REPO=$(gum input --placeholder "Enter repository name (e.g., org/repo)")
            TAG=$(gum input --placeholder "Enter name for filenames and tags array (e.g., custom-name)")
            COLOR="240" # Default grey
            ;;
    esac
else
    REPO=$1
    if [ -z "$2" ]; then
        TAG=$(gum input --placeholder "Enter name for filenames and tags array (e.g., fusion)")
        COLOR="240" # Default grey
    else
        TAG=$2
        COLOR="240" # Default grey
    fi
fi

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

    # Output nice feedback with gum, using single-line style and colour coding
    gum style --foreground "$COLOR" "Created file: $filename"
  else
    gum style --foreground "240" "File already exists: $filename"
  fi
done
