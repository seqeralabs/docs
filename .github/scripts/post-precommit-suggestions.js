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

  // Parse the diff into file chunks
  const diffLines = diff.split('\n');
  let currentFile = null;
  let currentHunk = null;
  let fileChanges = [];

  for (let i = 0; i < diffLines.length; i++) {
    const line = diffLines[i];

    // New file in diff
    if (line.startsWith('diff --git')) {
      if (currentFile && currentHunk) {
        fileChanges.push({ file: currentFile, hunk: currentHunk });
      }
      currentFile = null;
      currentHunk = null;
    } else if (line.startsWith('--- a/')) {
      currentFile = line.substring(6);
    } else if (line.startsWith('+++ b/')) {
      if (!currentFile) {
        currentFile = line.substring(6);
      }
    } else if (line.startsWith('@@')) {
      // Save previous hunk if exists
      if (currentFile && currentHunk) {
        fileChanges.push({ file: currentFile, hunk: currentHunk });
      }

      // Parse hunk header: @@ -start,count +start,count @@
      const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
      if (match) {
        currentHunk = {
          oldStart: parseInt(match[1]),
          newStart: parseInt(match[2]),
          oldLines: [],
          newLines: [],
          contextBefore: [],
          contextAfter: []
        };
      }
    } else if (currentHunk) {
      // Collect the changes
      if (line.startsWith('-')) {
        currentHunk.oldLines.push(line.substring(1));
      } else if (line.startsWith('+')) {
        currentHunk.newLines.push(line.substring(1));
      } else if (line.startsWith(' ')) {
        // Context line
        if (currentHunk.oldLines.length === 0 && currentHunk.newLines.length === 0) {
          currentHunk.contextBefore.push(line.substring(1));
        } else {
          currentHunk.contextAfter.push(line.substring(1));
        }
      }
    }
  }

  // Save last hunk
  if (currentFile && currentHunk) {
    fileChanges.push({ file: currentFile, hunk: currentHunk });
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
    const { file, hunk } = change;
    const suggestionContent = hunk.newLines.join('\n');

    // Create a unique marker for this specific suggestion
    const hash = crypto.createHash('md5').update(file + suggestionContent).digest('hex').substring(0, 8);
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
      const { file, hunk, marker } = change;

      // Build the suggestion body with marker
      let body = marker + "\n";
      body += "```suggestion\n";
      body += hunk.newLines.join('\n');
      if (hunk.newLines.length > 0 && !hunk.newLines[hunk.newLines.length - 1].endsWith('\n')) {
        body += '\n';
      }
      body += "```";

      // Calculate the correct line numbers in the CURRENT PR (the "old" side of the diff)
      // oldStart is where the hunk begins in the current file
      // We need to skip context lines before the actual changes
      const startLine = hunk.oldStart + hunk.contextBefore.length;
      // The suggestion should replace oldLines.length lines
      const endLine = startLine + hunk.oldLines.length - 1;

      const comment = {
        path: file,
        line: endLine,
        side: "RIGHT",
        body: body
      };

      // For multi-line suggestions, add start_line
      if (hunk.oldLines.length > 1) {
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
