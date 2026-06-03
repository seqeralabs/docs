---
name: version-bumps
description: >
  Bump hard-coded version numbers across the Seqera docs in the two places they recur:
  (1) enterprise point releases — six files in platform-enterprise_versioned_docs/version-XX.Y/
  that pin Docker image tags and Kubernetes manifests to a released version, and
  (2) the Connect client used by Studios — Dockerfile ARG defaults, docker build commands,
  prerequisite "or later" lines, and container-image tag samples scattered across
  platform-cloud/, platform-enterprise_docs/, and the versioned snapshots.
  Use when the user says: "bump the connect version", "version bump for 25.3.5", "what files do
  I need to update for the enterprise release", "where is the connect client mentioned",
  "scan for version numbers", or invokes this skill directly.
---

# Version bumps

There are two version surfaces in the Seqera docs that need manual bumps when a release ships.
Each has a fixed, enumerated list of files — the skill below tells you exactly what to grep,
what to change, and what NOT to touch.

## Surface 1: Enterprise point release pins

When an enterprise point release is cut (e.g. `25.3.4` → `25.3.5`), six files in the
**versioned** docs tree pin Docker image tags and Kubernetes manifests to the released version:

- `platform-enterprise_versioned_docs/version-25.3/enterprise/_templates/docker/docker-compose.yml`
- `platform-enterprise_versioned_docs/version-25.3/enterprise/_templates/k8s/tower-cron.yml`
- `platform-enterprise_versioned_docs/version-25.3/enterprise/_templates/k8s/tower-svc.yml`
- `platform-enterprise_versioned_docs/version-25.3/enterprise/configuration/mirroring.md`
- `platform-enterprise_versioned_docs/version-25.3/enterprise/platform-kubernetes.md`
- `platform-enterprise_versioned_docs/version-25.3/functionality_matrix/overview.md`

**Why these and not their `platform-enterprise_docs/` equivalents:** the unversioned tree
always points at the *next upcoming* enterprise version and flows through normal doc updates.
The versioned tree is frozen against the released version, so the pins live there.

**How to apply:**

1. Pick the right versioned directory. The `25.3` above is the active minor. When a minor
   rolls (e.g. a 25.4 release), the target directory becomes `version-25.4/`. Verify before
   editing.
2. Surface anything that drifted:
   ```bash
   grep -rl "<old-version>" platform-enterprise_versioned_docs/version-<MAJOR.MINOR>/
   ```
3. Edit the six files manually. Version bumps in these files can be context-dependent
   (Docker image tag in one place, a `helm install --version` flag in another), so don't
   blanket-replace — review each hit.
4. The changelog file `changelog/seqera-enterprise/v<version>.md` is a release notes artifact,
   not a version bump target.

## Surface 2: Connect client version

The Connect client (used by Studios) is pinned in five distinct pattern forms across the docs.
A version bump touches the same set of files in `platform-cloud/`, `platform-enterprise_docs/`,
and the versioned snapshots.

### Pattern catalog

| # | Pattern | Lives in |
|---|---------|----------|
| 1 | `ARG CONNECT_CLIENT_VERSION="X.Y"` (Dockerfile ARG default, 2× per file) | `studios/custom-envs.md` |
| 2 | `--build-arg CONNECT_CLIENT_VERSION=X.Y` (docker build command) | `studios/example-studios.md` |
| 3 | `**connect-client vX.Y.Z or later**` and `**connect-server/proxy vX.Y.Z or later**` (prerequisites) | `troubleshooting_and_faqs/studios_troubleshooting.md` |
| 4 | `**Connect client**: Version X.Y.Z or later` and `**Connect server and proxy**: Version X.Y.Z or later` (prerequisites, enterprise only) | `enterprise/studios-ssh.md` |
| 5 | ``Seqera Connect client version, such as `X.Y` or `X.Y.Z`.`` (sample in version-scheme explainer) | `studios/container-images.md` |

### What NOT to bump

- `FROM public.cr.seqera.io/platform/connect-client:${CONNECT_CLIENT_VERSION}` — uses the ARG variable, no hard-coded version.
- `LABEL io.seqera.connect.version="${CONNECT_CLIENT_VERSION}"` — same, uses the ARG.
- A bare `ARG CONNECT_CLIENT_VERSION` line with no default — second-stage ARG that inherits.
- `studios/connect.md` — release-notes-style page documenting each shipped client/server version. New entries get appended, but the existing pinned-version mentions there describe what shipped, not what to recommend.

### File map (active docs)

These are the files that get bumped for the *current* release. Versioned snapshots
(`version-25.1/`, `version-25.2/`, `version-25.3/`) generally aren't bumped after their
release cuts, but `version-26.1/` (the next-to-cut enterprise version) IS active.

**Cloud:**
- `platform-cloud/docs/studios/custom-envs.md` (pattern 1, lines 80, 106)
- `platform-cloud/docs/studios/example-studios.md` (pattern 2, line 89)
- `platform-cloud/docs/studios/container-images.md` (pattern 5, line 19)

**Enterprise (unversioned + version-26.1):**
- `platform-enterprise_docs/studios/custom-envs.md` (pattern 1, lines 80, 106)
- `platform-enterprise_docs/studios/example-studios.md` (pattern 2, line 89)
- `platform-enterprise_docs/studios/container-images.md` (pattern 5, line 19)
- `platform-enterprise_docs/enterprise/studios-ssh.md` (pattern 4, lines 19-20)
- `platform-enterprise_docs/troubleshooting_and_faqs/studios_troubleshooting.md` (pattern 3, lines 148-149)
- Same files under `platform-enterprise_versioned_docs/version-26.1/`

### How to apply

1. Confirm the target version with the user. Patterns 1, 2, and 5 use a 2-part `X.Y` form
   (Docker tag style); patterns 3 and 4 use a 3-part `X.Y.Z` form (release-spec style). A
   single bump produces both.
2. Survey current pin state:
   ```bash
   grep -rnIE "CONNECT_CLIENT_VERSION|connect-client[: ]v?[0-9]|connect-(client|server|server/proxy).{0,15}v?[0-9]+\.[0-9]+|Connect (client|server).{0,30}Version [0-9]" platform-cloud platform-enterprise_docs platform-enterprise_versioned_docs/version-26.1 --include="*.md" --include="*.mdx"
   ```
3. Apply by exact-string replacement, keeping each pattern's surrounding format intact:
   - Pattern 1: `ARG CONNECT_CLIENT_VERSION="<old>"` → `ARG CONNECT_CLIENT_VERSION="<new>"`
   - Pattern 2: `--build-arg CONNECT_CLIENT_VERSION=<old>` → `--build-arg CONNECT_CLIENT_VERSION=<new>`
   - Pattern 3: `connect-client v<old>.0 or later` → `connect-client v<new>.0 or later` (and same for `connect-server/proxy`)
   - Pattern 4: `**Connect client**: Version <old>.0 or later` → `**Connect client**: Version <new>.0 or later` (and same for `**Connect server and proxy**`)
   - Pattern 5: ``such as `<old>` or `<old>.0``  → ``such as `<new>` or `<new>.0``
4. After bumping, re-run the grep above and confirm no stragglers.
5. Bump the `last updated` frontmatter on each edited file.

### Known inconsistencies to watch for

The Connect-client pins have historically drifted out of sync. As of this skill being
written, the docs reference *three* different "current" versions:

- Dockerfile ARG defaults pin `0.8` (custom-envs.md, example-studios.md)
- Cloud `container-images.md` sample says `0.9`
- Enterprise `container-images.md`, `studios-ssh.md`, and `studios_troubleshooting.md` say `0.10`

When you bump, normalise to one version across all surfaces unless the user explicitly
wants to keep cloud/enterprise on different versions.

## Verification commands

After bumping either surface, run these to confirm the new state:

```bash
# Enterprise release pins (substitute your version directory)
grep -rn "<new-version>" platform-enterprise_versioned_docs/version-25.3/enterprise/_templates/ platform-enterprise_versioned_docs/version-25.3/enterprise/configuration/mirroring.md platform-enterprise_versioned_docs/version-25.3/enterprise/platform-kubernetes.md platform-enterprise_versioned_docs/version-25.3/functionality_matrix/overview.md

# Connect client pins
grep -rnIE "CONNECT_CLIENT_VERSION|connect-client[: ]v?[0-9]|connect-(client|server|server/proxy).{0,15}v?[0-9]+\.[0-9]+|Connect (client|server).{0,30}Version [0-9]" platform-cloud platform-enterprise_docs platform-enterprise_versioned_docs/version-26.1 --include="*.md" --include="*.mdx"
```

Any output should show only the new version. If the old version still appears, you missed a pattern.
