# Claude Code Configuration

This directory contains Claude Code configuration for the Seqera Platform documentation repository.

## Skills

Skills are AI-powered workflows that help automate documentation tasks. Skills in this directory are available to:
- Claude Code CLI users working on this project
- Claude Desktop app (when this directory is in a synced project)
- GitHub Actions workflows using the Claude API

### openapi-overlay-generator

Generates OpenAPI overlay files for Seqera Platform API documentation updates.

**Use when**:
- Analyzing Speakeasy comparison overlays
- Generating operations, parameters, or schemas overlay files
- Documenting new API endpoints or Platform version updates
- Validating overlay files against documentation standards

See `skills/openapi-overlay-generator/SKILL.md` for complete documentation.

## For Contributors

When working on API documentation:
1. Claude Code will automatically detect and offer to use relevant skills
2. Skills provide specialized knowledge about documentation standards and automation
3. Skills include scripts and references that ensure consistency across API docs

## Maintenance

- Skills are version-controlled with the repository
- Updates to skills should be reviewed like any other code change
- Test skill changes locally before committing
