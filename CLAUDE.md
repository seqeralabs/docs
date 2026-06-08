# Documentation maintenance with Claude

This guide indexes the Claude-powered skills, agents, and workflows for the Seqera Platform documentation repository. For per-skill detail, follow the links to each `SKILL.md`.

## Skills

The repository ships eight skills under [.claude/skills/](.claude/skills/). Invoke any of them from Claude Code (`/<skill-name>`) or via `Skill` tool calls.

### Editorial and review

| Skill | When to use |
|---|---|
| [`/editorial-review`](.claude/skills/editorial-review/SKILL.md) | Style-check documentation files using specialized agents (voice-tone, terminology, punctuation, clarity). Run locally in Claude Code or on a PR by commenting `/editorial-review` |

### Content authoring

| Skill | When to use |
|---|---|
| [`/docs-feature`](.claude/skills/docs-feature/SKILL.md) | Turn Jira epics, PRDs, design docs, or PRs into documentation updates with a draft PR |
| [`/docs-state-assessment`](.claude/skills/docs-state-assessment/SKILL.md) | Cross-reference shipped code, Jira backlog, and published docs to produce a gap-analysis report |
| [`/docs-release-impact`](.claude/skills/docs-release-impact/SKILL.md) | Triage the doc impact of a single release — env vars, screenshots, broken cross-links |

### Changelogs and version pins

| Skill | When to use |
|---|---|
| [`/changelog-platform-formatter`](.claude/skills/changelog-platform-formatter/SKILL.md) | Style-check Cloud and Enterprise Platform changelogs in `changelog/seqera-cloud/` and `changelog/seqera-enterprise/` |
| [`/changelog-os-formatter`](.claude/skills/changelog-os-formatter/SKILL.md) | Style-check Nextflow and Wave open-source changelogs |
| [`/platform-version-bumps`](.claude/skills/platform-version-bumps/SKILL.md) | Bump enterprise point releases (Docker image tags, K8s manifests, compatibility table) and the Connect-client version across all docs surfaces |

### API documentation

| Skill | When to use |
|---|---|
| [`/api-overlay-generator`](.claude/skills/api-overlay-generator/SKILL.md) | Generate OpenAPI overlay files for Platform API documentation updates |

## Editorial agents

Agents live under [.claude/agents/](.claude/agents/). The editorial-review skill orchestrates them; the `/review` slash command runs them locally.

| Agent | Status |
|---|---|
| `voice-tone` | Active — runs in CI |
| `terminology` | Active — runs in CI |
| `clarity` | Disabled in CI; available locally |
| `punctuation` | Agent definition exists; not yet wired into the CI workflow |
| `docs-fix` | Local only — applies corrections on explicit request |

For full agent definitions and editorial-review CI architecture see [.claude/README.md](.claude/README.md).

## Editorial review: trigger model

Editorial reviews are **on-demand only** — they do not run automatically on PR creation or commits. Trigger one of three ways:

- Run `/editorial-review` locally in Claude Code
- Comment `/editorial-review` on a PR
- Manually dispatch the **Documentation Review** workflow from the Actions tab

A smart-gate in the CI workflow blocks wasteful runs: recent re-review (<60 min), very small changes (<10 lines), or excessive formatting noise (fix with markdownlint first).

## Documentation directory structure

| Directory | Description | Approx file count |
|-----------|-------------|------------|
| [platform-enterprise_docs/](platform-enterprise_docs/) | Main enterprise docs | ~129 |
| [platform-cloud/docs/](platform-cloud/docs/) | Cloud platform docs | ~114 |
| [platform-enterprise_versioned_docs/](platform-enterprise_versioned_docs/) | Versioned enterprise docs (frozen snapshots per release) | Variable |
| [platform-api-docs/docs/](platform-api-docs/docs/) | API documentation | ~218 |
| [fusion_docs/](fusion_docs/) | Fusion docs | ~24 |
| [multiqc_docs/](multiqc_docs/) | MultiQC docs | ~212 |
| [wave_docs/](wave_docs/) | Wave docs | ~43 |
| [changelog/](changelog/) | Release notes (Cloud, Enterprise, Nextflow, Wave) | ~232 |

## Enterprise release version bumps (quick reference)

When cutting an enterprise point release (e.g., `25.3.4` → `25.3.5`), six files under `platform-enterprise_versioned_docs/version-<MAJOR.MINOR>/` need manual version bumps:

- `enterprise/_templates/docker/docker-compose.yml`
- `enterprise/_templates/k8s/tower-cron.yml`
- `enterprise/_templates/k8s/tower-svc.yml`
- `enterprise/configuration/mirroring.md`
- `enterprise/platform-kubernetes.md`
- `functionality_matrix/overview.md`

Surface anything that drifted before editing:

```bash
grep -rl "{old-version}" platform-enterprise_versioned_docs/version-<MAJOR.MINOR>/
```

> **Note:** When the minor version rolls (e.g., a 25.4 release), the target directory changes to `platform-enterprise_versioned_docs/version-25.4/`. Verify the correct versioned directory before applying changes.

For the full playbook — including the Connect-client surface and verification commands — see [`.claude/skills/platform-version-bumps/SKILL.md`](.claude/skills/platform-version-bumps/SKILL.md).

## Related

- Skill definitions: [.claude/skills/](.claude/skills/)
- Agent definitions: [.claude/agents/](.claude/agents/)
- Editorial workflow architecture: [.claude/README.md](.claude/README.md)
- GitHub Actions workflows: [.github/workflows/](.github/workflows/)
- Workflow scripts: [.github/scripts/](.github/scripts/)
