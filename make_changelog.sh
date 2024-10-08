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

    # Set the corresponding product name and colour based on the repository selected
    case "$REPO" in
        "nextflow-io/nextflow")
            product="nextflow"
            COLOR="32" # Green
            ;;
        "MultiQC/MultiQC")
            product="multiqc"
            COLOR="214" # Orange
            ;;
        "seqeralabs/fusion")
            product="fusion"
            COLOR="196" # Red
            ;;
        "seqeralabs/wave")
            product="wave"
            COLOR="33" # Blue
            ;;
        "seqeralabs/platform")
            # We will handle the conditional product in the loop for this case
            COLOR="93" # Purple
            ;;
        "[ other ]")
            # If "other" is selected, prompt for both repository and product name
            REPO=$(gum input --placeholder "Enter repository name (e.g., org/repo)")
            product=$(gum input --placeholder "Enter name for filenames and tags array (e.g., custom-name)")
            COLOR="240" # Default grey
            ;;
    esac
else
    REPO=$1
    if [ -z "$2" ]; then
        product=$(gum input --placeholder "Enter name for filenames and tags array (e.g., fusion)")
        COLOR="240" # Default grey
    else
        product=$2
        COLOR="240" # Default grey
    fi
fi

# Prompt for whether to fetch all releases or stop at the first existing file
FETCH_ALL=$(gum choose "Just new until an existing entry found" "All releases")

# Fetch the releases, sort them by publishedAt in descending order
gh -R "$REPO" release list --json tagName,publishedAt --limit 1000 | jq -r 'sort_by(.publishedAt) | reverse | .[] | "\(.tagName) \(.publishedAt)"' | while read tag publishedAt; do
  # Skip any release with "nightly" in the tagName
  if [[ "$tag" == *"nightly"* ]]; then
    gum style --foreground "240" "Skipping nightly release: $tag"
    continue
  fi

  # Format the date to yyyy-mm-dd
  date=$(echo $publishedAt | cut -d'T' -f1)

  # Set the appropriate product based on conditions
  if [[ "$REPO" == "seqeralabs/platform" ]]; then
      if [[ "$tag" == *"enterprise"* ]]; then
          product="seqera-enterprise"
      else
          product="seqera-cloud"
      fi
  fi

  # Capitalize the first letter of the product
  capitalized_product=$(echo "$product" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')

  # Create a file in changelog/{product} directory with the name {tagName}.mdx
  filename="changelog/${product}/${tag}.mdx"

  # Check if the file already exists
  if [ -f "$filename" ]; then
    # If the option is to stop at the first existing file, break the loop
    if [ "$FETCH_ALL" == "Just new until an existing entry found" ]; then
        gum style --foreground "240" "Stopping: Found existing file: $filename"
        break
    fi
  else
    # Fetch the body (release notes) for the current tag
    body=$(gh -R "$REPO" release view "$tag" --json body -q '.body')

    # Write the content to the file
    cat <<EOF > "$filename"
---
title: ${capitalized_product} ${tag}
date: ${date}
tags: [${product}]
---

${body}
EOF

    # Output nice feedback with gum, using single-line style and colour coding
    gum style --foreground "$COLOR" "Created file: $filename"
  fi
done
