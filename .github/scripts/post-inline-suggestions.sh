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

  # Get the PR head SHA and diff to identify changed lines
  local head_sha=$(gh pr view "$pr_number" --json headRefOid -q '.headRefOid')

  # Get the PR diff to identify which lines are actually in the diff
  local diff_output=$(gh pr diff "$pr_number")

  # Build a map of file:line -> is_in_diff
  declare -A changed_lines
  local current_diff_file=""
  local line_num=0

  while IFS= read -r diff_line; do
    if [[ "$diff_line" =~ ^\+\+\+\ b/(.+)$ ]]; then
      current_diff_file="${BASH_REMATCH[1]}"
      line_num=0
    elif [[ "$diff_line" =~ ^@@\ -[0-9]+(,[0-9]+)?\ \+([0-9]+)(,[0-9]+)?\ @@.*$ ]]; then
      # New hunk - extract starting line number
      line_num="${BASH_REMATCH[2]}"
    elif [[ -n "$current_diff_file" && "$line_num" -gt 0 ]]; then
      # Track lines in the diff (both additions and context)
      if [[ "$diff_line" =~ ^[\ +].* ]]; then
        changed_lines["${current_diff_file}:${line_num}"]=1
        ((line_num++)) || true
      elif [[ "$diff_line" =~ ^-.* ]]; then
        # Deletion - don't increment line_num
        :
      fi
    fi
  done <<< "$diff_output"

  # Filter comments to only include lines that are in the PR diff
  local filtered_comments='[]'
  local total_suggestions=$(echo "$comments" | jq 'length')
  local filtered_count=0

  for ((i=0; i<total_suggestions; i++)); do
    local path=$(echo "$comments" | jq -r ".[$i].path")
    local line=$(echo "$comments" | jq -r ".[$i].line")
    local key="${path}:${line}"

    if [[ -n "${changed_lines[$key]}" ]]; then
      local comment=$(echo "$comments" | jq ".[$i]")
      filtered_comments=$(jq -n \
        --argjson filtered "$filtered_comments" \
        --argjson comment "$comment" \
        '$filtered + [$comment]')
      ((filtered_count++)) || true
    fi
  done

  echo "Filtered suggestions: $filtered_count of $total_suggestions are on changed lines"

  if [[ "$filtered_comments" == "[]" ]]; then
    echo "⚠️ No suggestions apply to changed lines in this PR"
    # Post a comment explaining this
    gh pr comment "$pr_number" --body "✅ **Editorial Review Complete** - Reviewed changed files. The editorial agents found some potential improvements, but they're all on lines outside the PR diff. The changed lines look good! *Review by Claude Code editorial agents*"
    return 0
  fi

  comments="$filtered_comments"

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
