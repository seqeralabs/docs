# Vale setup guide for Seqera documentation

Complete setup guide for Vale linting integration with editorial workflows.

## What this does

- **Vale** - Fast, free terminology checker (catches 80% of issues in 2 seconds)
- **Claude AI** - Context-aware review (catches nuanced issues Vale can't)
- **VSCode integration** - Inline feedback as you type
- **CI integration** - Automated PR reviews

## Files created

```
docs/
├── .vale.ini                              # Vale configuration
├── .pre-commit-config.yaml                # Pre-commit hooks (updated)
├── .gitignore                             # Updated to ignore .vscode/
├── .github/
│   ├── styles/
│   │   └── Seqera/
│   │       ├── Products.yml               # Product name rules
│   │       └── Features.yml               # Feature terminology rules
│   └── workflows/
│       └── docs-review.yml                # Updated workflow (Vale + AI)
```

**Note:** VSCode settings are configured in User Settings (not workspace), so `.vscode/settings.json` is gitignored.

## One-time setup (per developer)

### 1. Install Vale

**macOS:**
```bash
brew install vale
```

**Linux:**
```bash
snap install vale
```

**Verify installation:**
```bash
vale --version
# Should show: vale version 3.x.x
```

### 2. Install pre-commit

**macOS:**
```bash
brew install pre-commit
```

**Python:**
```bash
pip install pre-commit
```

**Verify installation:**
```bash
pre-commit --version
# Should show: pre-commit 3.x.x
```

### 3. Install Vale packages

```bash
cd /Users/justine.geffen/work/docs

# Download write-good package and sync Vale styles
vale sync

# Should see:
# Downloading package 'write-good'...
# ✓ write-good installed
```

### 4. Set up git hooks

```bash
cd /Users/justine.geffen/work/docs

# Install pre-commit hooks
pre-commit install

# Should see:
# pre-commit installed at .git/hooks/pre-commit
```

### 5. Install VSCode extension

1. Open VSCode
2. Press `Cmd+Shift+X` (Extensions)
3. Search for "Vale VSCode"
4. Install "Vale" by Chris Chinchilla (errata-ai)
5. **Do NOT reload yet** - configure settings first

### 6. Configure VSCode Vale settings (CRITICAL)

**IMPORTANT:** Vale extension requires configuration in **User Settings** (not just workspace settings).

#### Step 6.1: Add to user settings

1. Press `Cmd+,` (Command + Comma) to open Settings
2. Click the file icon in top right to open `settings.json`
3. Add these lines to your User settings:

```json
{
  "vale.valeCLI.path": "/opt/homebrew/bin/vale",
  "vale.valeCLI.config": "/Users/justine.geffen/work/docs/.vale.ini"
}
```

**Note:** Adjust paths if needed:
- macOS Homebrew (Apple Silicon): `/opt/homebrew/bin/vale`
- macOS Homebrew (Intel): `/usr/local/bin/vale`
- Linux: `/usr/bin/vale`

To find your Vale path: `which vale`

#### Step 6.2: Reload VSCode

1. Press `Cmd+Shift+P`
2. Type "Developer: Reload Window"
3. Press Enter

**Why User Settings?** The Vale extension needs the config in User Settings to properly locate the `.vale.ini` file. Workspace settings alone don't work reliably.

## How to invoke Vale

### Option 1: VSCode (Automatic)

Vale runs automatically when you:
- Open a `.md` or `.mdx` file
- Save a file (`Cmd+S`)

**See results:**
- Inline squiggles in the editor
- Problems panel: Press `Cmd+Shift+M`

### Option 2: Command line (manual)

```bash
# Check single file
vale platform-enterprise_docs/getting-started.md

# Check directory
vale platform-enterprise_docs/

# Check all changed files
git diff --name-only | grep -E '\.(md|mdx)$' | xargs vale

# Check with config explicitly
vale --config=.vale.ini path/to/file.md
```

### Option 3: Pre-commit (Manual)

```bash
# Check all markdown files
pre-commit run vale --all-files

# Check only staged files
pre-commit run vale
```

**Note:** Pre-commit Vale hook is set to `manual` stage, so it does NOT run automatically on `git commit`.

### Option 4: CI/CD (Automatic)

Vale runs automatically on GitHub when:
- PR is opened
- PR is updated (new commits)
- Files in `platform-*` directories are changed

## Validation and testing

### Test 1: Vale CLI works

```bash
# Test Vale on a single file
vale platform-enterprise_docs/README.md

# Expected output:
# ✓ 0 errors, 0 warnings and 0 suggestions in 1 file.
# (or list of issues if any found)
```

### Test 2: VSCode integration works

1. Open VSCode
2. Open any `.md` file (e.g., `platform-enterprise_docs/getting-started.md`)
3. Add a test error outside code blocks: Type `NextFlow` in regular prose
4. **Save the file** (`Cmd+S`)
5. You should see:
   - Red/yellow squiggle under `NextFlow`
   - Hover shows: "Use 'Nextflow' instead of 'NextFlow'"
   - Problems panel (`Cmd+Shift+M`) shows the error
6. Remove the test after validating

**Troubleshooting:**
- If no squiggles appear, check Vale output panel: `Cmd+Shift+P` → "Output" → Select "Vale"
- Verify User Settings have Vale config (see Step 6.1 above)
- Reload VSCode: `Cmd+Shift+P` → "Developer: Reload Window"

### Test 3: Pre-commit hook works

```bash
# Manually run Vale via pre-commit
pre-commit run vale --all-files

# Expected output:
# Vale Documentation Linter (manual)...........Passed
# (or list of issues if any found)
```

### Test 4: Standard pre-commit hooks work

```bash
# Test all pre-commit hooks
pre-commit run --all-files

# Expected output:
# Trim trailing whitespace.............Passed
# Fix end of files.....................Passed
# Check YAML...........................Passed
# Check for added large files..........Passed
```

### Test 5: Create test commit

```bash
# Create a test file with intentional errors
cat > test-vale.md << 'EOF'
# Test Vale

This is a test of NextFlow and Tower.

You can use compute env for your pipelines.
EOF

# Add to git
git add test-vale.md

# Run Vale check manually
vale test-vale.md

# Expected output should show errors:
# 3:20  error  Use 'Nextflow' instead of 'NextFlow'    Seqera.Products
# 3:33  error  Use 'Seqera Platform' instead of 'Tower' Seqera.Products
# 5:16  error  Use 'compute environment' instead        Seqera.Features
#              of 'compute env'

# Clean up test file
rm test-vale.md
git reset HEAD test-vale.md
```

### Test 6: CI integration (after merging)

1. Create a test PR with a small change
2. Push to GitHub
3. Check PR → Actions tab
4. Verify Vale job runs and completes
5. Check PR → Files changed
6. Look for Vale inline review comments

## Vale rules summary

### Product names (Products.yml)

| Wrong | Correct |
|-------|---------|
| Tower | Seqera Platform |
| NextFlow | Nextflow |
| wave | Wave |
| fusion | Fusion |
| studio/studios | Studio/Studios |
| multi-qc | MultiQC |

### Feature terms (Features.yml)

| Wrong | Correct |
|-------|---------|
| compute env | compute environment |
| creds | credentials |
| repo | repository |
| config | configuration |
| dropdown | drop-down |
| work space | workspace |

### write-good package

Checks for:
- Passive voice (suggestions only)
- Weasel words (disabled - "very", "really" OK)
- "There is" constructions (disabled - fine for technical docs)

## Daily workflow

### Option 1: VSCode Real-time (Recommended)

```
Open file → See errors inline → Fix → Save → Commit
```

### Option 2: Manual check before commit

```bash
# Check specific files
vale platform-enterprise_docs/getting-started.md

# Or check all changed files
git diff --name-only | xargs vale

# Fix issues, then commit
git commit -m "Update docs"
```

### Option 3: Let CI catch it

```bash
# Just commit and push
git commit -m "Update docs"
git push

# Vale runs in CI, posts inline comments
# Fix using GitHub "Commit suggestion" button
```

## When Vale runs

Vale runs in three different contexts:

### 1. VSCode (Real-time)
- **Trigger:** Opening or saving `.md`/`.mdx` files
- **How:** VSCode extension runs Vale automatically
- **Feedback:** Inline squiggles, Problems panel (`Cmd+Shift+M`)
- **Speed:** Instant (as you type/save)
- **Purpose:** Catch issues before committing

### 2. Pre-commit hook (manual)
- **Trigger:** `pre-commit run vale --all-files` (manual command)
- **How:** Runs on staged markdown files
- **Feedback:** Terminal output
- **Speed:** 2-5 seconds
- **Purpose:** Check before pushing (optional)
- **Note:** Does NOT run automatically on `git commit` (set to manual stage)

### 3. GitHub Actions (Automated)
- **Trigger:** PR opened/updated to `platform-*` directories
- **How:** CI workflow runs Vale, then Claude agents
- **Feedback:** Inline PR review comments
- **Speed:** 2 seconds (Vale), then 30 seconds (Claude)
- **Purpose:** Automated review on PRs

## Workflow summary

```
Local Development
    ↓
1. Edit .md file in VSCode
    ↓
2. Vale shows inline errors as you type/save
    ↓
3. Fix issues in real-time
    ↓
4. (Optional) Run: pre-commit run vale --all-files
    ↓
5. Commit (git commit)
    ↓
    Standard pre-commit hooks run (trailing whitespace, etc.)
    Vale does NOT run automatically
    ↓
6. Push to GitHub
    ↓
PR Workflow (Automated)
    ↓
7. PR opened → CI runs
    ↓
    a. Vale (2 sec, free)
       - Checks product names, feature terms
       - Posts inline PR comments
       - Does NOT block (fail_on_error: false)
    ↓
    b. Claude AI (30 sec, costs tokens)
       - SKIPS what Vale already checked
       - Checks formatting, context-dependent issues
       - Posts inline PR comments
    ↓
8. Review Summary Posted
    - Vale results (Terminology)
    - AI results (Voice/Tone, Terminology)
    - Up to 60 inline suggestions
```

## Token savings

**Before Vale:**
- Claude checks everything: ~500 tokens per file
- 50 files = 25,000 tokens wasted on simple fixes

**After Vale:**
- Vale checks terminology: free, 2 seconds
- Claude skips Vale's checks: ~200 tokens per file
- 50 files = 15,000 tokens saved (~60% reduction)

## Troubleshooting

### Vale not found in VSCode

1. Check Vale CLI path:
   ```bash
   which vale
   ```

2. Update `.vscode/settings.json`:
   ```json
   "vale.valeCLI.path": "/path/from/which/vale"
   ```

3. Reload VSCode: `Cmd+Shift+P` → "Developer: Reload Window"

### Vale packages not found

```bash
cd /Users/justine.geffen/work/docs
vale sync
```

### Pre-commit hook not running

```bash
# Reinstall hooks
pre-commit uninstall
pre-commit install

# Test
pre-commit run --all-files
```

### Vale shows errors for legacy docs mentioning "Tower"

This is expected. Rules to remember:
- `Tower` → warning (not error) in legacy contexts
- Use `<!-- vale off -->` for specific sections if needed

### VSCode shows no errors but Vale CLI does

1. Check VSCode Vale is enabled (bottom status bar)
2. Try toggling: `Cmd+Shift+P` → "Vale: Toggle Linting"
3. Check file type is `.md` or `.mdx`
4. Reload window: `Cmd+Shift+P` → "Developer: Reload Window"

## Adding new rules

### Add product name

Edit `.github/styles/Seqera/Products.yml`:
```yaml
swap:
  "Wrong Name": Correct Name
```

### Add feature term

Edit `.github/styles/Seqera/Features.yml`:
```yaml
swap:
  "abbrev": full term
```

### Make rule a warning instead of error

Edit `.vale.ini`:
```ini
[*.md]
Seqera.Products.Tower = warning  # Was error, now warning
```

### Disable noisy rule

Edit `.vale.ini`:
```ini
[*.md]
write-good.Weasel = NO  # Completely disabled
```

## Support

- **Vale Documentation**: https://vale.sh/docs/
- **Vale Package Hub**: https://vale.sh/hub/
- **VSCode Extension**: https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode
- **Internal Docs**: See `CLAUDE.md` for editorial workflow details

## Quick reference

```bash
# Check single file
vale path/to/file.md

# Check directory
vale platform-enterprise_docs/

# Check via pre-commit
pre-commit run vale --all-files

# Sync packages
vale sync

# Skip vale for one commit
git commit --no-verify

# Toggle Vale in VSCode
Cmd+Shift+P → "Vale: Toggle Linting"
```

---

**Setup Date**: 2026-02-03
**Vale Version**: 3.0.7
**write-good Version**: Latest from package hub
