/**
 * Posts pre-commit suggestions as inline GitHub PR review comments
 * Each suggestion is tracked with a unique marker to avoid duplicates across multiple workflow runs
 */

const crypto = require('crypto');  // used to hash suggestion content

module.exports = async ({ github, context, diff }) => {
  // Get all existing review comments to check for duplicates
  const { data: reviewComments } = await github.rest.pulls.listReviewComments({
    pull_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  // Parse the diff into individual change blocks
  const diffLines = diff.split('\n');
  let currentFile = null;
  let currentLineInOldFile = 0;
  let fileChanges = [];

  for (let i = 0; i < diffLines.length; i++) {
    const line = diffLines[i];

    // New file in diff
    if (line.startsWith('diff --git')) {
      currentFile = null;
      currentLineInOldFile = 0;
    } else if (line.startsWith('--- a/')) {
      currentFile = line.substring(6);
    } else if (line.startsWith('+++ b/')) {
      if (!currentFile) {
        currentFile = line.substring(6);
      }
    } else if (line.startsWith('@@')) {
      // Parse hunk header: @@ -start,count +start,count @@
      const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
      if (match) {
        currentLineInOldFile = parseInt(match[1]);
      }
    } else if (currentFile && currentLineInOldFile > 0) {
      // Process the actual diff content
      if (line.startsWith('-')) {
        // Start of a change block - collect all consecutive -/+ lines
        const changeBlock = {
          file: currentFile,
          startLine: currentLineInOldFile,
          oldLines: [],
          newLines: []
        };

        // Collect all - lines
        let j = i;
        while (j < diffLines.length && diffLines[j].startsWith('-')) {
          changeBlock.oldLines.push(diffLines[j].substring(1));
          j++;
        }

        // Collect all + lines that follow
        while (j < diffLines.length && diffLines[j].startsWith('+')) {
          changeBlock.newLines.push(diffLines[j].substring(1));
          j++;
        }

        // Only add if we have both old and new lines (actual change, not just deletion)
        if (changeBlock.oldLines.length > 0 && changeBlock.newLines.length > 0) {
          fileChanges.push(changeBlock);
        }

        // Move index forward and update line counter
        i = j - 1; // -1 because the loop will increment
        currentLineInOldFile += changeBlock.oldLines.length;
      } else if (line.startsWith('+')) {
        // Addition without deletion - skip for now as we can't suggest these
        currentLineInOldFile += 0; // + lines don't affect old file line numbering
      } else if (line.startsWith(' ')) {
        // Context line
        currentLineInOldFile++;
      }
    }
  }

  // Get the PR head commit SHA
  const { data: pullRequest } = await github.rest.pulls.get({
    pull_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
  });
  const commitSha = pullRequest.head.sha;

  // Filter out changes that already have suggestions posted
  const newChanges = [];
  for (const change of fileChanges) {
    const suggestionContent = change.newLines.join('\n');

    // Create a unique marker for this specific suggestion
    const hash = crypto.createHash('md5').update(change.file + suggestionContent).digest('hex').substring(0, 8);
    const marker = `<!-- pre-commit-suggestion-${hash} -->`;

    // Check if this exact suggestion already exists in review comments
    const alreadyExists = reviewComments.some(comment => comment.body && comment.body.includes(marker));

    if (!alreadyExists) {
      newChanges.push({ ...change, marker });
    }
  }

  // Only post inline review comments if there are new suggestions
  if (newChanges.length > 0) {
    // Create inline review comments for each suggestion
    const comments = [];

    for (const change of newChanges) {
      const { file, startLine, oldLines, newLines, marker } = change;

      // Build the suggestion body with marker
      let body = marker + "\n";
      body += "```suggestion\n";
      body += newLines.join('\n');
      if (newLines.length > 0 && !newLines[newLines.length - 1].endsWith('\n')) {
        body += '\n';
      }
      body += "```";

      // Calculate the line range for the suggestion
      const endLine = startLine + oldLines.length - 1;

      const comment = {
        path: file,
        line: endLine,
        side: "RIGHT",
        body: body
      };

      // For multi-line suggestions, add start_line
      if (oldLines.length > 1) {
        comment.start_line = startLine;
        comment.start_side = "RIGHT";
      }

      comments.push(comment);
    }

    // Create a review with all inline comments
    await github.rest.pulls.createReview({
      pull_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      commit_id: commitSha,
      event: "COMMENT",
      body: "🪄 **Pre-commit formatting suggestions**\n\nYou can apply each suggestion via the GitHub UI, add a comment containing the keyword `fix formatting` or [set up pre-commit](https://github.com/seqeralabs/docs/blob/master/README.md#install-pre-commit) locally and commit again.",
      comments: comments
    });
  }
};
