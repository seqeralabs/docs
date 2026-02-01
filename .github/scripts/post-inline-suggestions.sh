#!/bin/bash

# Script to post Claude agent findings as inline GitHub suggestions
# Usage: ./post-inline-suggestions.sh <review-file> <pr-number>

set -e

REVIEW_FILE=$1
PR_NUMBER=$2
REPO="${GITHUB_REPOSITORY}"

if [[ -z "$REVIEW_FILE" || -z "$PR_NUMBER" ]]; then
  echo "Usage: $0 <review-file> <pr-number>"
  exit 1
fi

# Parse the review file and create review comments with suggestions
# Expected format in review file:
# FILE: path/to/file.md
# LINE: 42
# ISSUE: Brief description
# ORIGINAL: |
# original text here
# SUGGESTION: |
# corrected text here
# ---

# Create a review with all suggestions
create_review() {
  local pr_number=$1
  local review_file=$2

  # Start building the review comments array
  local comments='[]'
  local current_file=""
  local current_line=""
  local current_issue=""
  local current_original=""
  local current_suggestion=""
  local in_original=false
  local in_suggestion=false

  while IFS= read -r line; do
    if [[ "$line" =~ ^FILE:\ (.+)$ ]]; then
      current_file="${BASH_REMATCH[1]}"
      in_original=false
      in_suggestion=false

    elif [[ "$line" =~ ^LINE:\ ([0-9]+)$ ]]; then
      current_line="${BASH_REMATCH[1]}"

    elif [[ "$line" =~ ^ISSUE:\ (.+)$ ]]; then
      current_issue="${BASH_REMATCH[1]}"

    elif [[ "$line" == "ORIGINAL: |" ]]; then
      in_original=true
      in_suggestion=false
      current_original=""

    elif [[ "$line" == "SUGGESTION: |" ]]; then
      in_original=false
      in_suggestion=true
      current_suggestion=""

    elif [[ "$line" == "---" ]]; then
      # End of this suggestion block - add to comments
      if [[ -n "$current_file" && -n "$current_line" && -n "$current_suggestion" ]]; then
        local comment_body="**${current_issue}**"$'\n\n'
        comment_body+='```suggestion'$'\n'
        comment_body+="${current_suggestion}"$'\n'
        comment_body+='```'

        # Add to comments JSON array
        comments=$(jq -n \
          --argjson comments "$comments" \
          --arg path "$current_file" \
          --argjson line "$current_line" \
          --arg body "$comment_body" \
          '$comments + [{"path": $path, "line": ($line | tonumber), "body": $body}]')
      fi

      # Reset for next suggestion
      current_file=""
      current_line=""
      current_issue=""
      current_original=""
      current_suggestion=""
      in_original=false
      in_suggestion=false

    elif [[ "$in_original" == true ]]; then
      current_original+="$line"$'\n'

    elif [[ "$in_suggestion" == true ]]; then
      current_suggestion+="$line"$'\n'
    fi
  done < "$review_file"

  # Get the PR head SHA
  local head_sha=$(gh pr view "$pr_number" --json headRefOid -q '.headRefOid')

  if [[ "$comments" == "[]" ]]; then
    echo "No suggestions to post"
    return 0
  fi

  # Create the review using GitHub API
  local review_body="## 📝 Editorial Review with Inline Suggestions"$'\n\n'
  review_body+="I've reviewed the documentation and found some areas for improvement. "
  review_body+="Click **Commit suggestion** on each inline comment to apply the fix."$'\n\n'
  review_body+="*Review powered by Claude Code editorial agents*"

  local review_json=$(jq -n \
    --arg body "$review_body" \
    --argjson comments "$comments" \
    --arg commit_id "$head_sha" \
    --arg event "COMMENT" \
    '{body: $body, comments: $comments, commit_id: $commit_id, event: $event}')

  # Post the review
  gh api \
    --method POST \
    -H "Accept: application/vnd.github+json" \
    "/repos/${REPO}/pulls/${pr_number}/reviews" \
    --input - <<< "$review_json"

  echo "✅ Posted review with $(echo "$comments" | jq 'length') inline suggestions"
}

create_review "$PR_NUMBER" "$REVIEW_FILE"
