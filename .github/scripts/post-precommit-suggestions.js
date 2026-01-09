/**
 * Posts pre-commit suggestions as GitHub PR comments
 * Each suggestion is tracked with a unique marker to avoid duplicates across multiple workflow runs
 */

const crypto = require('crypto');  // used to hash suggestion content

module.exports = async ({ github, context, diff }) => {
  // Get all existing comments to check for duplicates
  const { data: comments } = await github.rest.issues.listComments({
    issue_number: context.issue.number,
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

  // Filter out changes that already have suggestions posted
  const newChanges = [];
  for (const change of fileChanges) {
    const { file, hunk } = change;
    const suggestionContent = hunk.newLines.join('\n');

    // Create a unique marker for this specific suggestion
    const hash = crypto.createHash('md5').update(file + suggestionContent).digest('hex').substring(0, 8);
    const marker = `<!-- pre-commit-suggestion-${hash} -->`;

    // Check if this exact suggestion already exists
    const alreadyExists = comments.some(comment => comment.body.includes(marker));

    if (!alreadyExists) {
      newChanges.push({ ...change, marker });
    }
  }

  // Only post a comment if there are new suggestions
  if (newChanges.length > 0) {
    let body = "**Pre-commit formatting suggestions**\n\n";
    body += "Pre-commit hooks found some formatting changes. You can apply each suggestion directly:\n\n";

    for (const change of newChanges) {
      const { file, hunk, marker } = change;

      // Add the unique marker for this suggestion
      body += marker + "\n";
      body += `### \`${file}\` (line ${hunk.newStart})\n\n`;

      // Create suggestion block
      body += "```suggestion\n";
      body += hunk.newLines.join('\n');
      if (hunk.newLines.length > 0 && !hunk.newLines[hunk.newLines.length - 1].endsWith('\n')) {
        body += '\n';
      }
      body += "```\n\n";
    }

    body += "---\n\n";
    body += "🪄 **Quick fix:** Comment `fix formatting` below and I'll apply these changes automatically!\n\n";
    body += "**Other options:**\n";
    body += "- Apply the suggestions above directly in GitHub\n";
    body += "- Run `pre-commit` locally and commit again\n\n";
    body += "Need help? Check the [README](https://github.com/" + context.repo.owner + "/" + context.repo.repo + "/blob/main/README.md).\n";

    await github.rest.issues.createComment({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: body
    });
  }
};
