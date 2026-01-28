# Editorial Review Orchestrator

## Purpose
Orchestrate a comprehensive editorial review of documentation using specialized SME agents. Provides structured, actionable feedback on editorial quality across multiple dimensions.

## Workflow

This skill coordinates multiple specialized agents to provide comprehensive editorial feedback:

1. **Identify review scope** (PR files or specified files)
2. **Spawn specialized agents in parallel** for efficiency
3. **Collate findings** into structured report
4. **Provide actionable summary** with priorities

## Available Review Agents

### Core Editorial Agents (Always Run)
- **voice-tone**: Second person, active voice, present tense, confidence
- **terminology**: Product names, feature names, formatting conventions
- **punctuation**: List punctuation, Oxford commas, quotation marks, dashes

### Structural Agents (Run for major changes)
- **clarity**: Sentence length, jargon, complexity, prerequisites

### Specialized Agents (Run as final pass)
- **docs-fix**: Apply corrections (only when explicitly requested)

## Usage Patterns

### PR Review (Automated)
```
Use editorial-review skill on changed files: [file list]
Focus: voice-tone, terminology, punctuation
Scope: comprehensive
Output: GitHub PR comment format
```about:blank#blocked

### Local Review (Manual)
```
Use editorial-review skill on: [directory or file]
Focus: all agents
Scope: thorough
Output: development report format
```

### Targeted Review (Specific Issues)
```
Use editorial-review skill on: [files]
Focus: [specific agents]
Scope: focused
Output: issue-specific report
```

## Orchestration Logic

### Step 1: Scope Analysis
```
Determine files to review:
- PR mode: Use git diff to find changed .md/.mdx files
- Manual mode: Use provided file/directory paths
- Exclude: code files, changelog files (unless specifically requested)
```

### Step 2: Agent Selection
```
Based on review type and file changes:
- New files: all agents
- Content changes: voice-tone, terminology, punctuation, clarity
- Minor edits: voice-tone, terminology
- Force comprehensive: all agents except docs-fix
```

### Step 3: Parallel Execution
```
Launch selected agents concurrently:
- Each agent reviews all files in scope
- Each agent returns findings with file:line references
- Wait for all agents to complete before proceeding
```

### Step 4: Report Generation
```
Structure findings by priority:
- Critical: Issues that affect user comprehension
- Important: Brand/style consistency issues
- Minor: Polish improvements
- Info: Style preferences and suggestions
```

## Output Format

### GitHub PR Comment Format
```markdown
## 📝 Editorial Review Summary

### Critical Issues ❌
| File | Line | Agent | Issue | Suggestion |
|------|------|-------|-------|------------|
| ... | ... | ... | ... | ... |

### Important Issues ⚠️
| File | Line | Agent | Issue | Suggestion |
|------|------|-------|-------|------------|
| ... | ... | ... | ... | ... |

### Minor Issues 💡
| File | Line | Agent | Issue | Suggestion |
|------|------|-------|------------|
| ... | ... | ... | ... | ... |

### Summary
- **Files reviewed:** X
- **Agents used:** [list]
- **Total suggestions:** X critical, X important, X minor
- **Focus areas:** [top 3 issue categories]

---
*To apply fixes: Comment `/fix-docs` on this PR*
*Review powered by Claude Code SME agents*
```

### Development Report Format
```markdown
# Editorial Review Report

## Overview
- **Scope:** [files/directories reviewed]
- **Agents:** [agents used]
- **Generated:** [timestamp]

## Findings by File

### file1.md
#### voice-tone
- Line X: [issue] → [suggestion]

#### terminology
- Line Y: [issue] → [suggestion]

### file2.md
[similar structure]

## Priority Actions
1. **Fix immediately:** [critical issues]
2. **Address soon:** [important issues]
3. **Consider for next revision:** [minor issues]

## Agent Performance
- voice-tone: X issues found
- terminology: X issues found
- punctuation: X issues found
[etc.]
```

## Implementation

### Core Orchestration Script
```typescript
async function runEditorialReview(scope, options) {
  // 1. Determine files to review
  const files = await identifyReviewFiles(scope);

  // 2. Select agents based on options/changes
  const agents = selectAgents(files, options);

  // 3. Launch agents in parallel
  const results = await Promise.all(
    agents.map(agent => runAgent(agent, files))
  );

  // 4. Collate and structure findings
  const report = await generateReport(results, options.format);

  return report;
}
```

### Agent Communication Protocol
Each agent returns standardized findings:
```json
{
  "agent": "voice-tone",
  "files": [
    {
      "path": "docs/example.md",
      "findings": [
        {
          "line": 42,
          "severity": "important",
          "issue": "Passive voice construction",
          "current": "The pipeline is configured by the user",
          "suggestion": "Configure the pipeline",
          "rule": "Use active voice for instructions"
        }
      ]
    }
  ]
}
```

## Quality Gates

### Before Publishing Report
- Validate all line references exist
- Remove duplicate findings between agents
- Sort findings by file, then line number
- Apply severity scoring consistently
- Verify suggestions don't conflict

### Agent Coordination
- Prevent multiple agents from flagging same issue
- Ensure terminology agent has priority over punctuation for product names

## Customization

### Review Profiles
```yaml
# .claude/agents/review-config.yaml
profiles:
  quick:
    agents: [voice-tone, terminology]
    focus: ["critical", "important"]
  comprehensive:
    agents: [voice-tone, terminology, punctuation, clarity]
    focus: ["critical", "important", "minor"]
  new-content:
    agents: [voice-tone, terminology, punctuation, clarity]
    focus: ["critical", "important"]
```

### File Filters
```yaml
include_patterns:
  - "**/*.md"
  - "**/*.mdx"
exclude_patterns:
  - "changelog/**"
  - "node_modules/**"
  - ".github/**"
```

This orchestrator skill provides the structured, parallel approach you requested while maintaining the lightweight coordination design.
