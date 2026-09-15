# Enterprise vs Cloud vs 26.1 — content divergence audit

**Date:** 2026-09-16
**Trees compared:**

| Label | Path | Files | Published? |
|---|---|---|---|
| **Unversioned** | `platform-enterprise_docs/` | 172 | **No** — excluded from every build |
| **26.1** | `platform-enterprise_versioned_docs/version-26.1/` | 172 | Yes — this is what Enterprise readers see |
| **Cloud** | `platform-cloud/docs/` | 144 | Yes |

**Shared paths:** 115 exist in all three trees; 116 in Unversioned ∩ Cloud; 171 in Unversioned ∩ 26.1.

**Headline result:** 101 of 116 Unversioned/Cloud pairs differ, and 62 of 171 Unversioned/26.1 pairs differ. The second number is the more serious one, and it is new to this audit.

---

## The structural finding: the unversioned tree is not published

`docusaurus.config.js` sets `includeCurrentVersion: envFlag("INCLUDE_NEXT")` for the `platform-enterprise` docs plugin, and `netlify.toml` sets `INCLUDE_NEXT=""` for both production and deploy previews. `envFlag` treats an empty string as false, so `platform-enterprise_docs/` is **excluded from production and from PR previews**. `lastVersion` resolves to `26.1`, so every Enterprise reader lands on `platform-enterprise_versioned_docs/version-26.1/`.

The practical consequence: **an edit made only in `platform-enterprise_docs/` reaches nobody, and it cannot be spotted in a deploy preview either.** Sixty-two files have accumulated in that state. A sample of what is currently stranded there:

| Fix sitting only in the unpublished tree | Effect on the published 26.1 page |
|---|---|
| Three dead/redirected dataset links in `getting-started/quickstart-demo/add-data.md` | Readers follow two links into a decommissioned Google Cloud product |
| `forceably` → `forcibly` in `quickstart-demo/view-run-information.md` | Typo is live |
| US spelling of `favourited`/`favourite` in `orgs-and-teams/custom-roles.md` | British spelling is live in the permissions reference |
| `pinned-header-row` wrapper on the ~90-row table in `orgs-and-teams/roles.md` | No sticky header; Cloud readers get one, Enterprise readers do not |
| GitHub SAML-SSO token authorization and fine-grained resource-owner caveats in `git/overview.md` | Published guidance omits the two most common reasons a GitHub token fails |
| `Azure Cloud` compute environment support in `studios/overview.md` | Drift runs the *other* way here — see below |

This PR fixes the reader-facing items in that list. It does not attempt the remaining ~55 files, and it does not change the build configuration. **See "Open questions" #1.**

---

## 1. Drift bugs fixed (no judgment needed)

| Fix | Tree | File |
|---|---|---|
| Broken reference key `[pipeline-version]` → `[pipeline-versioning]` (only the plural form is defined) | Cloud | `launch/launchpad.md` |
| Frontmatter description `"Nextflow Tower"` → `"Seqera Platform"` (reverse-rebrand) | Cloud | `labels/overview.md` |
| Removed duplicate `[custom-container]` link reference | Cloud | `studios/add-studio.md` |
| Moved orphaned "This command revokes…" sentence from under a `:::note` to the **Log out** section it describes | Cloud | `co-scientist/authentication.md` |
| Renumbered procedure `2–9` → `1–8` (artifact of a removed "Create a user policy" section) | Cloud | `enterprise/advanced-topics/manual-aws-batch-setup.mdx` |
| `RStudio session` → `R-IDE session` in the heading and body of one FAQ entry; kept `RStudio` where it names the Posit product in the Copilot entry | Cloud | `troubleshooting_and_faqs/studios_troubleshooting.md` |
| Connect example tags `4.2.3-0.9` / `4.2.3-0.10` → `4.2.3-0.12`, matching the `<connect_version>` line on the same page and the 26.1.x row of the compatibility table | All three | `studios/container-images.md` |
| Restored `Azure Cloud` to the supported compute environments for Studios, plus its missing link reference | Unversioned | `studios/overview.md` |
| Three dead/redirected external dataset links | 26.1 | `getting-started/quickstart-demo/add-data.md` |
| `forceably` → `forcibly` | 26.1 | `getting-started/quickstart-demo/view-run-information.md` |

`studios/overview.md` is worth calling out because the drift runs opposite to everything else: Azure Cloud support was added to **26.1 and Cloud** but never landed in the unversioned tree, which still carries the pre-26.1 sentence. The published pages are correct; the unpublished one is stale.

---

## 2. User roles and permissions

Compared `orgs-and-teams/roles.md` and `orgs-and-teams/custom-roles.md` across all three trees. Endpoint claims were checked against `platform-api-docs/scripts/specs/seqera-api-1.181.0.yaml`.

### Fixed

| Fix | Tree | File |
|---|---|---|
| `studio:execute` for **Launch**: ✅ → ❌, aligning Enterprise with Cloud | Unversioned + 26.1 | `roles.md` |
| Added the `pinned-header-row` wrapper so the permissions table header sticks, as it already does on Cloud | 26.1 | `roles.md` |
| `favourited`/`favourite`/`unfavourite` → US spelling | 26.1 | `custom-roles.md` |
| Restored the `See [Custom roles]` pointer, which Cloud had dropped — the custom-roles page was otherwise unreachable from the roles page | Cloud | `roles.md` |
| `credentials_encrypted:read`: `_(Used by Platform)_` → `GET /credentials/{credentialsId}/keys`. The endpoint is in the spec; Cloud already had it right | Unversioned + 26.1 | `custom-roles.md` |
| `Download dataset`: `_(Used by Platform)_` → `GET /workspaces/{workspaceId}/datasets/{datasetId}/v/{version}/n/{fileName}`. The endpoint is in the spec; Enterprise already had it right | Cloud | `custom-roles.md` |

After these changes `roles.md` and `custom-roles.md` are identical between Unversioned and 26.1, and the only remaining Enterprise/Cloud differences are the deliberate Cloud Pro gating notes and the items below.

### Not fixed — the Enterprise permissions reference is behind the API

Cloud's `custom-roles.md` documents a `data_link_object:*` permission family that splits browse, download, and upload operations out of `data_link:*`. Enterprise still documents all of them under `data_link:*`, and Cloud's `roles.md` carries three matching `data_link_object:*` rows that Enterprise's role table lacks. On top of that, Enterprise's table is missing rows that Cloud has and that the 1.181.0 spec confirms exist:

| Missing from Enterprise | Spec path |
|---|---|
| Enable / disable compute environment | `POST /compute-envs/{computeEnvId}/{enable,disable}` |
| Dataset preview (2 rows) | `POST /datasets/preview-url`, `GET /datasets/{datasetId}/v/{version}/preview` |
| Dataset URL linking (2 rows) | `POST /datasets/{datasetId}/link`, `POST /datasets/validate-url` |
| Update a studio (3 rows, incl. resource labels and another user's private studio) | `PUT /studios/{sessionId}` |

Enterprise also documents the data-link download endpoint as `GET /data-links/{dataLinkId}/download`; the spec has `GET /data-links/{dataLinkId}/download/{filePath}`, which is Cloud's form. Conversely Enterprise has a `List containers` row that Cloud lacks.

This is a table-wide reconciliation rather than a set of isolated typos, and whether `data_link_object:*` exists on Enterprise 26.1 is a product question, not a docs one. **See "Open questions" #2.**

---

## 3. Content ports

**Cloud → Enterprise (Unversioned + 26.1):**

- **Bitbucket API tokens** — `git/overview.md`. Enterprise documented only app passwords, which Atlassian stopped issuing on September 9, 2025 and scheduled for removal on June 9, 2026. Both dates are now past, so the published Enterprise procedure describes a credential a reader can no longer create. Ported Cloud's API-token instructions, the scope requirement, the deprecation `:::warning`, and the **Username** (account email) / **Token** field labels, keeping Enterprise's `_BitBucket_` italics and bold section header. **The warning's tense is now wrong on both trees — see "Open questions" #3.**
- **Define pipeline schema** — `pipeline-schema/overview.md`. Enterprise's schema reference page had no section describing the three schema options or the Platform-stored schema, even though Enterprise's own `pipelines/versioning.md` and `co-scientist/prerequisites.md` both refer to "Seqera Platform schema" (as does `getting-started/quickstart-demo/launch-pipelines.md` in the unversioned tree). The canonical explanation existed only on Cloud. Ported verbatim; the `../orgs-and-teams/roles.md` link resolves in both Enterprise trees.

---

## 4. Divergences left alone (look intentional)

- **Cloud Pro gating** — SSO/external-collaborator note in `roles.md`, the Cloud-Pro-only note in `custom-roles.md`, free-tier Studio limit in `studios/overview.md`.
- **Seqera Compute and credits pricing** — `orgs-and-teams/organizations.md`, `workspace-management.md`, `limits/overview.md`.
- **Enterprise install/config subtree** — the `enterprise/` tree, `TOWER_*` environment variables, Enterprise-only troubleshooting sections (Databases, Email/TLS, Healthcheck, APM).
- **Antigravity/Gemini skill** — `co-scientist/skill-antigravity.md` is Cloud-only, and Enterprise's `coding-agents.md` omits it. Not ported. **See "Open questions" #4.**
- **`launch/advanced.md` "Pull latest" section** — Enterprise-only, but Cloud documents Pull latest more fully in `pipelines/revision.md` and `launch/launchpad.md`. Enterprise's version is a one-line duplicate of better content; no port needed.
- **Anchor names that differ per tree** — Enterprise's `#config-profiles` and `#building-pipeline-schema-files` versus Cloud's `#general-config` and `#define-pipeline-schema`. Each link resolves inside its own tree. Renaming either to match the other would break live links.
- **`tutorials/retry-strategy.md` vs `compute-envs/aws-spot-interruptions.md`** — the page was renamed in the unversioned tree; `getting-started/production-checklist.md` links correctly in each tree.
- **Frontmatter date fields** — untouched by design. Roughly 110 files still carry a single `date:` key rather than `date created:` / `last updated:`, and six Cloud credential pages have `date created` values that jumped from 2023 to 2025. Real, but a separate mechanical sweep.

---

## 5. Audit corrections

The 2026-06-08 audit was wrong or now out of date on these:

1. **"Enterprise `getting-started/overview.md` has a broken `/administration/overview` link"** — false. `administration/overview.md` exists in both Enterprise trees and contains a `### Members` heading, so `../administration/overview#members` resolves. Cloud's different target is correct for Cloud, which has no `administration/` directory.
2. **"`/migrate-from-wdl` and `/write-nf-test` are missing from one tree"** — no longer applicable; neither skill appears in any tree's `skills-reference.md`.
3. **"`a uploaded dataset` grammar regression", "duplicate Work directory bullet", "stray backtick block above Add a new participant"** — all fixed on master since June.
4. **"Agent capitalization drift"** and **"token placeholder drift in `quickstart-demo/automation.md`"** — both trees now agree (lowercase `agent`, `<your_access_token>`). Only `credentials/agent_credentials.md` still diverges: `<YOUR TOKEN>` on Enterprise, `<TOKEN_NAME>` on Cloud. Left alone pending a canonical choice.
5. **Functionality matrix** — the unversioned table is both stale (stops at 26.1.2) and corrupted (36 rows against 26, with seven duplicated version numbers). Deliberately **not** touched here: open PR #1858 already fixes exactly these three files, and editing them would conflict.

---

## Open questions

1. **Should the unversioned Enterprise tree be published, or should contributors stop editing it?** Right now it is neither. Sixty-two files differ from the published 26.1 snapshot, deploy previews cannot show enterprise changes made there, and there is no signal to a contributor that their edit went nowhere. Either flip `INCLUDE_NEXT` for previews, or make the versioned tree the edit target for anything that is not a next-release feature.
2. **Does Enterprise 26.1 have the `data_link_object:*` permission family?** If yes, both Enterprise permission tables need the split plus the seven missing rows listed above. If no, the divergence is correct and should be labelled as Cloud-only.
3. **Is the Bitbucket app-password warning still accurate?** It says app passwords "will be phased out June 9, 2026" and are "still supported". That date has passed. The wording needs updating on **both** trees, but only someone who can confirm the current Atlassian state should write it — I have not guessed.
4. **Should the Antigravity/Gemini skill be documented for Enterprise?** The skill content is platform-agnostic, so this is a product-availability question rather than a content one.
5. **`[vscode-blog]` is an undefined link reference in all three copies of `troubleshooting_and_faqs/studios_troubleshooting.md`.** `[Learn more][vscode-blog]` renders as literal text on the live site. Needs the intended URL; not fixed here because I would be inventing it.
6. **Confirm `studio:execute` = ❌ for Launch.** This PR flips Enterprise to match Cloud on the basis that Cloud is the more recently maintained table, but the two trees disagreed and one of them is wrong about the product.
7. **Is `Maintain` allowed to create Studios?** Enterprise says maintainers "cannot create workspace credentials, compute environments, or Studios"; Cloud omits the Studios clause. The permission rows (`studio:write` ✅ for Maintain) match Cloud's prose, which suggests Enterprise's prose is wrong — but that contradicts its own table, so it needs confirming rather than silently editing.
