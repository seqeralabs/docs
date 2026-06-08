# Enterprise vs Cloud — content divergence audit

**Date:** 2026-06-08
**Scope:** 113 file pairs that exist at the same path in both `platform-enterprise_docs/` and `platform-cloud/docs/`. **All 113 differ in some way.** The findings below are organized as: top concerning divergences (drift bugs) → likely-intentional product splits → re-examined "trivial" patterns → per-file concrete catalog appendix.

## Corrections from first pass

A second deep-dive pass surfaced two errors in the original report:

- **The Enterprise `pipelines/versioning.md` link to `#building-pipeline-schema-files` is NOT broken.** That anchor exists in Enterprise's own [pipeline-schema/overview.md](platform-enterprise_docs/pipeline-schema/overview.md) at heading level. The two trees use different anchor names (`#building-pipeline-schema-files` Enterprise / `#define-pipeline-schema` Cloud) but each link points to a valid anchor in its own tree. The risk is the inverse: if Enterprise's anchor gets renamed to match Cloud, the existing link breaks.
- **`pipelines/versioning.md` was misclassified as trivial-only.** Deep dive found ~13 distinct changes including content removal, rewritten JSON examples, and softened permissions language. Promoted to the concerning list below.

Also out-of-scope-but-worth-noting structural delta:

- **54 enterprise-only files** (mostly the `enterprise/` install/config subtree — expected)
- **20 cloud-only files** (cloud changelog, `cloud/`, `seqera-mcp/`, `getting-started/single-sign-on.md`, `getting-started/quickstart-demo/comm-showcase.md`, `co-scientist/skill-antigravity.md`, `co-scientist/credits.md`, `troubleshooting_and_faqs/sso_troubleshooting.md`)
- AWS/EKS compute-env files exist as `.md` in Enterprise but `.mdx` in Cloud — these were excluded from the shared-path comparison and warrant a separate diff

---

## 🚩 Top concerning divergences (probable unintentional drift)

These look like accidents — features documented on one side that should plausibly be on the other, broken links, or content the wrong tree is missing.

1. **[orgs-and-teams/roles.md](platform-enterprise_docs/orgs-and-teams/roles.md)** — `studio:execute` is **True** for the Launch role in Enterprise, **False** in Cloud. Almost certainly a drift bug, not an intentional product split.
2. **[launch/advanced.md](platform-enterprise_docs/launch/advanced.md)** — **Pull latest** toggle and **Nextflow v2 syntax parser** toggle are documented in Enterprise but missing from Cloud. Backwards from the usual cloud-leads-features pattern.
3. **[git/overview.md](platform-cloud/docs/git/overview.md)** — Cloud documents Bitbucket's new **API tokens** flow (app-password deprecation deadline already past). Enterprise still only documents app passwords. Enterprise docs are stale.
4. **[pipeline-schema/overview.md](platform-enterprise_docs/pipeline-schema/overview.md)** — Enterprise is missing the **Define pipeline schema** section that Cloud has. Worse: Enterprise's [pipelines/versioning.md](platform-enterprise_docs/pipelines/versioning.md) links to the `#define-pipeline-schema` anchor that no longer exists on its own schema page → **broken cross-link**.
5. **[co-scientist/coding-agents.md](platform-cloud/docs/co-scientist/coding-agents.md)** + **[co-scientist/skill-antigravity.md](platform-cloud/docs/co-scientist/skill-antigravity.md)** — Cloud advertises an Antigravity/Gemini integration whose source page is cloud-only. Enterprise has no equivalent — real feature gap or sync miss.
6. **[co-scientist/reference/skills-reference.md](platform-cloud/docs/co-scientist/reference/skills-reference.md)** — Cloud lists `/migrate-from-wdl` and `/write-nf-test` skills that Enterprise's reference table omits.
7. **[co-scientist/authentication.md](platform-cloud/docs/co-scientist/authentication.md)** — Cloud has an orphaned "This command revokes your current authentication token…" sentence above the wrong heading — looks like a botched section-reorder.
8. **[studios/add-studio.md](platform-cloud/docs/studios/add-studio.md)** — Cloud has a **duplicated `[custom-container]` link reference** in the link block — search-and-replace artifact from stripping SSH content.
9. **[orgs-and-teams/workspace-management.md](platform-cloud/docs/orgs-and-teams/workspace-management.md)** — Cloud has a **stray trailing backtick block** above "Add a new participant" — syntax bug.
10. **[studios/container-images.md](platform-cloud/docs/studios/container-images.md)** — Cloud's Connect-version example is `0.9` while Enterprise has been bumped to `0.10`. Missed version bump on Cloud.
11. **[troubleshooting_and_faqs/studios_troubleshooting.md](platform-cloud/docs/troubleshooting_and_faqs/studios_troubleshooting.md)** — Cloud still says "RStudio session"; Enterprise has been updated to "R-IDE". Rebrand miss on Cloud.
12. **[getting-started/overview.md](platform-enterprise_docs/getting-started/overview.md)** — Enterprise has a broken `/administration/overview` link that Cloud fixed to `/orgs-and-teams/organizations`.
13. **[functionality_matrix/overview.md](platform-cloud/docs/functionality_matrix/overview.md)** — Cloud's table has a Platform **26.1.2** row; Enterprise stops at **26.1.0** and pins it to `j21-25.10.2` rather than `j21-26.04`. Version-table drift.
14. **[enterprise/advanced-topics/manual-aws-batch-setup.mdx](platform-cloud/docs/enterprise/advanced-topics/manual-aws-batch-setup.mdx)** — Cloud's numbered procedure **starts at step 2** because the "Create a user policy" section was removed without cleanup.
15. **AWS Batch anchor drift** — `getting-started/proteinfold.md`, `rnaseq.md`, and `studios.md` all use different anchors (`#iam-user-creation` vs `#required-platform-iam-permissions`; `#automatic-configuration-of-batch-resources` vs `#create-a-seqera-aws-batch-compute-environment`). Suggests `compute-envs/aws-batch.md` itself has been restructured in only one tree — worth a focused follow-up diff (it's the `.md`/`.mdx` pair that this audit excluded).
16. **[studios/add-studio-git-repo.md](platform-enterprise_docs/studios/add-studio-git-repo.md)** + **[add-studio-provided-template.md](platform-enterprise_docs/studios/add-studio-provided-template.md)** — Enterprise documents custom-image registry via backend env vars (`TOWER_DATA_STUDIO_WAVE_CUSTOM_IMAGE_REGISTRY`/`_REPOSITORY`); Cloud documents it as a workspace UI setting (**Settings → Studios → Container repository**). One of these is almost certainly out of date.
17. **[tutorials/retry-strategy.md](platform-cloud/docs/tutorials/retry-strategy.md)** — Copy-edit pass + code-fence language change (`bash` → `groovy`) landed on Cloud only. Pure tech-writing churn that creates ongoing diff noise.

### Additional drift bugs surfaced by deep-dive pass

18. **[pipelines/versioning.md](platform-enterprise_docs/pipelines/versioning.md)** — Misclassified as trivial in the first pass. Actually contains: Enterprise-only `:::tip` admonition about commit-ID pinning (Cloud removed); Enterprise links `[Maintain or higher](../orgs-and-teams/roles.md)` while Cloud strips the role link in 3 places; Enterprise's "during pipeline edit or launch" qualifier dropped on Cloud; rewritten JSON example (Enterprise has truncated fragment, Cloud has complete example); heading depth changed (`###` → `####`); reordered "hash benefits" bullets; deletion-scope wording differs ("Individual versions" vs "Individual draft versions"). Looks like a Cloud-side editorial rewrite that didn't propagate.
19. **[launch/launchpad.md](platform-cloud/docs/launch/launchpad.md)** — Cloud uses reference key `[pipeline-version]` (singular) on the **Version name** line while every other reference on the page uses `[pipeline-versioning]` — almost certainly a broken cross-link. Cloud also has a **duplicate Work directory bullet** in the launch-form field list.
20. **[labels/overview.md](platform-cloud/docs/labels/overview.md)** — Frontmatter description on **Cloud** still says `"Instructions for using labels in Nextflow Tower."` Enterprise has been updated to "Seqera Platform". Reverse-rebrand bug.
21. **[credentials/agent_credentials.md](platform-cloud/docs/credentials/agent_credentials.md)** — Token-placeholder swap: Enterprise instructs replacing `<YOUR TOKEN>`, Cloud instructs replacing `<TOKEN_NAME>`. Real product-fact divergence that affects copy-paste correctness — one of these matches the actual CLI prompt and one doesn't.
22. **[getting-started/quickstart-demo/automation.md](platform-cloud/docs/getting-started/quickstart-demo/automation.md)** — Same kind of token-placeholder drift: Enterprise has `Authorization: Bearer <your_access_token>`, Cloud has `Authorization: Bearer <ACCESS_TOKEN>`.
23. **[data/datasets.md](platform-cloud/docs/data/datasets.md)** — Cloud has a grammar regression: `"Create new versions of a uploaded dataset."` (should be "an"). Also `"sample sheets"` → `"samplesheets"` (terminology drift; both forms used in the wild but the docs should pick one).
24. **[getting-started/quickstart-demo/studios.md](platform-cloud/docs/getting-started/quickstart-demo/studios.md)** — Real product-fact divergence: Enterprise says the demo deploys a generic "web app" (4 occurrences); Cloud says "RShiny application" / "RShiny app" (4 occurrences). The two are making factually different claims about what the demo produces.
25. **[supported_software/dragen/overview.md](platform-cloud/docs/supported_software/dragen/overview.md)** — Cloud stripped the inline cross-link to `compute-envs/aws-batch#automatic-configuration-of-batch-resources` entirely, leaving plain text "AWS Batch compute environment." Useful navigation removed.
26. **Cloud-side date-created typos in registry credential pages** — Several `date created` values jumped from 2023 to 2025 with no other reason: `docker_hub_registry_credentials.md` (`2025-10-21`), `gitea_registry_credentials.md` (`2025-12-15`), `github_registry_credentials.md` (`2025-12-15`), `gitlab_registry_credentials.md` (`2025-12-15`), `quay_registry_credentials.md` (`2025-04-21`), `ssh_credentials.md` (`2025-04-21`). Enterprise still has the original 2023 dates. Suggests a copy-paste error during a frontmatter-schema migration.
27. **[supported_software/agent/overview.md](platform-enterprise_docs/supported_software/agent/overview.md)** — Capitalization drift: Enterprise uses lowercase "agent" in 5 places (`"running the agent"`, `"before running the agent"`, etc.); Cloud capitalizes all 5 as "Agent". If "Agent" is a product name, Enterprise is wrong; if it's a generic noun, Cloud is wrong.

---

## Divergences that look intentional (deployment-flavor differences)

These read as legitimate product splits, but listing them so they're not lost:

### Enterprise-only feature documentation

- **Studios SSH (public preview, v25.3.3+)** — entire sections in [add-studio.md](platform-enterprise_docs/studios/add-studio.md), [add-studio-custom-container.md](platform-enterprise_docs/studios/add-studio-custom-container.md), [add-studio-git-repo.md](platform-enterprise_docs/studios/add-studio-git-repo.md), [add-studio-provided-template.md](platform-enterprise_docs/studios/add-studio-provided-template.md), [managing.md](platform-enterprise_docs/studios/managing.md) (~125-line SSH troubleshooting block), and [troubleshooting_and_faqs/studios_troubleshooting.md](platform-enterprise_docs/troubleshooting_and_faqs/studios_troubleshooting.md). Cloud stripped all of this. **Worth verifying** this is intentional — SSH is available on Cloud with the right Connect versions.
- **Azure Batch dual-pool architecture** — [compute-envs/azure-batch.md](platform-enterprise_docs/compute-envs/azure-batch.md) on Enterprise documents dual head/worker pools, four managed-identity fields, three-toggle job cleanup, Fusion-on-Ubuntu-24.04 AppArmor profile. Cloud still describes a single-pool model.
- **GCP Workload Identity Federation** — [compute-envs/google-cloud-batch.md](platform-enterprise_docs/compute-envs/google-cloud-batch.md) on Enterprise documents WIF as opt-in (PEM keys, `TOWER_OIDC_PEM_PATH`, choice between Service Account Key and WIF at credential-create). Cloud assumes WIF is hard-coded and only documents the Service Account Key path.
- **Disable compute environment** section — Enterprise [compute-envs/overview.md](platform-enterprise_docs/compute-envs/overview.md) has it; Cloud omits entirely.
- **Co-Scientist Enterprise backend config** — [authentication.md](platform-enterprise_docs/co-scientist/authentication.md), [installation.mdx](platform-enterprise_docs/co-scientist/installation.mdx), [reference/environment-variables.md](platform-enterprise_docs/co-scientist/reference/environment-variables.md), [quickstart.md](platform-enterprise_docs/co-scientist/quickstart.md), [projects.md](platform-enterprise_docs/co-scientist/projects.md) document `SEQERA_AI_BACKEND_URL` / `SEQERA_AUTH_DOMAIN` / portal prereqs.
- **Enterprise-specific troubleshooting** — [troubleshooting_and_faqs/troubleshooting.md](platform-enterprise_docs/troubleshooting_and_faqs/troubleshooting.md) has Databases, Email/TLS, Healthcheck, Login (`TOWER_ENABLE_UNSAFE_MODE`), Logging, APM monitoring sections all Enterprise-only (correct).
- **Azure Entra OIDC token-auth-method workaround** for v25.2.3- in [azure_troubleshooting.md](platform-enterprise_docs/troubleshooting_and_faqs/azure_troubleshooting.md).
- **AWS Batch nf-launcher custom job definition** tip in [troubleshooting_and_faqs/nextflow.md](platform-enterprise_docs/troubleshooting_and_faqs/nextflow.md).
- **`pipelines/overview.md`** has a Pipeline versioning intro pointer in Enterprise that Cloud drops.

### Cloud-only feature documentation

- **Seqera Compute + credits pricing** — added to [orgs-and-teams/organizations.md](platform-cloud/docs/orgs-and-teams/organizations.md), [workspace-management.md](platform-cloud/docs/orgs-and-teams/workspace-management.md), [limits/overview.md](platform-cloud/docs/limits/overview.md) ($1/credit, 0.1/CPU-Hr, etc.). Enterprise omits.
- **Cloud Pro gating** — [orgs-and-teams/custom-roles.md](platform-cloud/docs/orgs-and-teams/custom-roles.md), [roles.md](platform-cloud/docs/orgs-and-teams/roles.md) (SSO + external collaborator note), [studios/overview.md](platform-cloud/docs/studios/overview.md) (free-tier "one running Studio" limit).
- **Custom roles permission expansion** — many new compute-env, data-link, dataset preview, and studios PUT/admin permission rows in [custom-roles.md](platform-cloud/docs/orgs-and-teams/custom-roles.md).
- **Data lineage maturity** — [data/data-lineage.md](platform-cloud/docs/data/data-lineage.md) on Cloud has Functional flow, lifecycle transitions, cost estimates; Enterprise still ships raw IAM JSON blocks.
- **Data Explorer** — [data/data-explorer.md](platform-cloud/docs/data/data-explorer.md) on Cloud documents data-repo removal, file-preview types + 10MB limit, lineage view, S3-compatible provider limitations.
- **Launch form fields** — [getting-started/quickstart-demo/launch-pipelines.md](platform-cloud/docs/getting-started/quickstart-demo/launch-pipelines.md) on Cloud documents **Version name**, **Version ID**, **Main script**, and **Schema** (3 sub-options). Enterprise launch-form docs lack these — **this is a real coverage gap** even if the fields are Cloud-only.
- **Data privacy / Studios connectivity** — Cloud [data-privacy/overview.md](platform-cloud/docs/data-privacy/overview.md) adds 1-hour token expiry + stale-token risk + manual stop/start mitigation. Enterprise admins arguably need this too.
- **AWS Secrets Manager `ListSecrets` IAM warning** — Cloud-only in [secrets/overview.md](platform-cloud/docs/secrets/overview.md); workflow-stuck bug that Enterprise admins arguably need *more*.
- **Userdata script error detection** — Cloud's [compute-envs/azure-cloud.md](platform-cloud/docs/compute-envs/azure-cloud.md) and [google-cloud.md](platform-cloud/docs/compute-envs/google-cloud.md) have a new subsection + required IAM permissions Enterprise doesn't have.
- **Azure resource-labels lifecycle accuracy** — Cloud [resource-labels/overview.md](platform-cloud/docs/resource-labels/overview.md) explains Pool metadata vs ARM tags, lifecycle table, Cost-Management caveat. Enterprise's section is shorter and less precise.

---

## "Trivial" divergences — re-examined

The initial pass bucketed ~60 files as trivial because each individual diff was small. That framing was wrong: the *patterns* across that bucket are themselves findings. What's actually in there:

### 1. Half-completed rebrands

- **RStudio → R-IDE**: Enterprise has been updated; Cloud still says "RStudio session" / "RShiny" in [troubleshooting_and_faqs/studios_troubleshooting.md](platform-cloud/docs/troubleshooting_and_faqs/studios_troubleshooting.md), [getting-started/quickstart-demo/studios.md](platform-cloud/docs/getting-started/quickstart-demo/studios.md), [getting-started/studios.md](platform-cloud/docs/getting-started/studios.md), [getting-started/rnaseq.md](platform-cloud/docs/getting-started/rnaseq.md). If R-IDE is the new product name, Cloud is shipping the old one in user-facing docs.
- **Tower → Seqera / tower.nf → cloud.seqera.io**: scattered across [getting-started/overview.md](platform-cloud/docs/getting-started/overview.md) and others — some Enterprise pages still reference `tower.nf`, a dead host for new users.
- **"Seqera UI" → "Platform"** in [reports/overview.md](platform-cloud/docs/reports/overview.md) (Cloud updated, Enterprise still says "Seqera UI").

### 2. UI-label drift

- **"Pipeline work directory" (Enterprise) vs "Work directory" (Cloud)** — across [getting-started/proteinfold.md](platform-enterprise_docs/getting-started/proteinfold.md), [rnaseq.md](platform-enterprise_docs/getting-started/rnaseq.md), [studios.md](platform-enterprise_docs/getting-started/studios.md). One of these matches the actual UI; the other is wrong.
- **"Revision number" (Enterprise) vs "Revision" (Cloud)** — same files. Same problem.
- **"web application" vs "web app"** in [getting-started/studios.md](platform-cloud/docs/getting-started/studios.md).
- **"Studio" vs "Studio session"** — terminology inconsistency in user-facing prose.

### 3. Missing visual content (Enterprise UX gap)

Cloud has GIF screenshots that Enterprise lacks in [getting-started/proteinfold.md](platform-cloud/docs/getting-started/proteinfold.md), [rnaseq.md](platform-cloud/docs/getting-started/rnaseq.md), [quickstart-demo/add-data.md](platform-cloud/docs/getting-started/quickstart-demo/add-data.md), [view-run-information.md](platform-cloud/docs/getting-started/quickstart-demo/view-run-information.md), [studios.md](platform-cloud/docs/getting-started/quickstart-demo/studios.md), [automation.md](platform-cloud/docs/getting-started/quickstart-demo/automation.md). Enterprise users get plain text where Cloud users get animated demos — a pattern across the whole quickstart-demo subtree.

### 4. Half-removed product caveats

- **[data/datasets.md](platform-enterprise_docs/data/datasets.md)** — Enterprise has the "Only available in organization workspaces" note; Cloud removed it. Either it's still true on both (Cloud is wrong) or no longer true (Enterprise is wrong). A real product-fact divergence the small-diff classification hid.
- **MDX `Tabs` imports** — Cloud removed them (Docusaurus no longer needs them); Enterprise still imports in [getting-started/proteinfold.md](platform-enterprise_docs/getting-started/proteinfold.md), [quickstart-demo/automation.md](platform-enterprise_docs/getting-started/quickstart-demo/automation.md). Dead imports in published files.
- **Compute-env links dropping `.md` suffix** in Cloud's [supported_software/fusion/overview.md](platform-cloud/docs/supported_software/fusion/overview.md) — Docusaurus tolerates both today, may not in future.

### 5. Co-Scientist "Learn more" footer split (consistent but a maintenance trap)

11 of the 21 co-scientist files differ *only* by swapping `Usage and cost` (Enterprise) for `Credits` (Cloud), and appending a Cloud-only Troubleshooting link. The split is intentional but means any future change to those footer links has to be made in 11 places per tree.

### 6. Container-registry credential pages (12-file consistent pattern)

All 12 pages under `credentials/*_registry_credentials.md` have **identical procedure bodies** but **different intro paragraphs and frontmatter dates**. Cloud got an SEO/voice rewrite of the intros that was never back-ported. Enterprise users land on older, less-polished landing copy.

### 7. House-style drift

- "visualise" → "visualize" ([reports/overview.md](platform-cloud/docs/reports/overview.md))
- "25MB" → "25 MB" (space before unit)
- Trailing blank lines, list-numbering style, em-dash bullets, italics on pipeline names
- `bash` → `groovy` code-fence language in [tutorials/retry-strategy.md](platform-cloud/docs/tutorials/retry-strategy.md)

Individually trivial; in aggregate they signal an editorial pass landed on one tree and not the other.

### 8. Files the first pass under-described — now cataloged

The deep-dive pass found these contain more than the first audit captured:

- **[launch/cache-resume.mdx](platform-cloud/docs/launch/cache-resume.mdx)** — UI-label drift only: Enterprise says "Pipeline to launch and **Revision number**", Cloud says "**Revision**". Same UI-label problem as proteinfold/rnaseq/studios.
- **[launch/launchpad.md](platform-cloud/docs/launch/launchpad.md)** — Broken `[pipeline-version]` reference key + duplicate Work directory bullet (promoted to concerning list #19) + stray comma in admonition.
- **[monitoring/cloud-costs.md](platform-cloud/docs/monitoring/cloud-costs.md)** — Frontmatter date schema drift + missing trailing period on description + one collapsed blank line. Genuinely cosmetic.
- **[pipeline-actions/overview.md](platform-cloud/docs/pipeline-actions/overview.md)** — UI-label drift in two places: "Revision number" → "Revision".
- **[pipelines/revision.md](platform-cloud/docs/pipelines/revision.md)** — One product-fact rewording: Enterprise says "regardless of future changes to the repository branch or tag", Cloud says "regardless of upstream repository changes." Equivalent meaning; just shorter on Cloud.
- **[seqerakit/commands.md](platform-cloud/docs/seqerakit/commands.md)** — One link label rewrite ("Define your YAML file using CLI options" → "YAML configuration options"). Link target unchanged.
- **[supported_software/dragen/overview.md](platform-cloud/docs/supported_software/dragen/overview.md)** — Cross-link to AWS Batch automatic-configuration anchor stripped to plain text (promoted to concerning list #25).
- **[troubleshooting_and_faqs/resource-labels.md](platform-cloud/docs/troubleshooting_and_faqs/resource-labels.md)** — Genuinely trivial: one trailing comma + missing final newline.
- **[getting-started/workspace-setup.md](platform-cloud/docs/getting-started/workspace-setup.md)** — Substantial Cloud-side editorial rewrite: opening paragraph reworded, 9 bullet list items restructured from prose to "**Bold**: definition" format, teams heading changed ("Simplify" → "Manage"), final bullet sentence truncated on Cloud. No product-fact changes — pure tech-writing pass that landed only on Cloud.
- **[compute-envs/gke.md](platform-cloud/docs/compute-envs/gke.md)** — "pipeline work directory" → "work directory". Same UI-label drift pattern.
- **[compute-envs/hpc.md](platform-cloud/docs/compute-envs/hpc.md)** — Cloud adds cross-link to Nextflow install docs that Enterprise lacks.
- **[credentials/managed_identities.md](platform-cloud/docs/credentials/managed_identities.md)** + **[credentials/ssh_credentials.md](platform-cloud/docs/credentials/ssh_credentials.md)** — Frontmatter-only diffs (date schema change, no body changes).
- **[credentials/{aws,azure,docker_hub,google,quay}_registry_credentials.md](platform-cloud/docs/credentials/)** — Intro paragraph swap from generic "From version 22.3, Seqera Platform supports..." preamble to registry-specific value-prop copy. Procedure bodies identical.
- **[credentials/{gitea,github,gitlab,quay}_registry_credentials.md](platform-cloud/docs/credentials/)** — Same intro-paragraph swap, PLUS body sentences merged into the new intro (so the body shrinks on Cloud). A future reconciliation must decide whether the consolidated single paragraph or the Enterprise two-paragraph form is canonical.
- **[credentials/gitea_registry_credentials.md](platform-enterprise_docs/credentials/gitea_registry_credentials.md)** — Frontmatter description says "GitHub container registry credentials" (in a **Gitea** file) on both sides. Pre-existing bug, not divergence.

### Files byte-identical after whitespace normalization (genuinely no-op)

`co-scientist/reference/cli.md`, `reference/index.md`, `sessions.md`, `quickstart-demo/add-pipelines.md`, `monitor-runs.md`, `pipeline-optimization.md`, `monitoring/dashboard.md`, `pipeline-optimization/overview.md`, `troubleshooting_and_faqs/api_and_cli.md`, `aws_troubleshooting.md`, `datasets_troubleshooting.md`, `workspaces_troubleshooting.md`, `seqerakit/installation.md`, `templates.mdx`, `yaml-configuration.md`, `studios/custom-envs.md`, `example-studios.md`.

---

## Recommended next moves

1. **Open issues for the top 5 drift bugs** (`studio:execute` role, Bitbucket app-password staleness, broken pipeline-schema anchor, RStudio→R-IDE on Cloud studios troubleshooting, missing launch-form fields on Enterprise).
2. **Decide if Studios SSH is intentionally Enterprise-only.** If yes, leave; if no, port to Cloud. The `[custom-container]` duplicate-link bug in Cloud's `add-studio.md` also needs fixing either way.
3. **Diff the `compute-envs/aws-batch.{md,mdx}` and `eks.{md,mdx}` pairs separately** — this audit excluded them because the file extensions differ. The anchor drift across `proteinfold.md`/`rnaseq.md`/`studios.md` suggests they've diverged significantly.
4. **Sync the [functionality_matrix/overview.md](platform-enterprise_docs/functionality_matrix/overview.md) version table** — Enterprise is one row behind.
5. **Consider whether Cloud-only ops warnings** (Secrets Manager `ListSecrets`, Studios token expiry) genuinely don't apply to Enterprise or are just under-shared.
6. **Fix the Cloud-side date-created typos** in 6 credential pages (#26 above) before they propagate further.
7. **Decide canonical token-placeholder strings** for `agent_credentials.md` (`<YOUR TOKEN>` vs `<TOKEN_NAME>`) and `automation.md` (`<your_access_token>` vs `<ACCESS_TOKEN>`) and align both trees.
8. **Pick canonical UI labels** ("Revision" vs "Revision number"; "Work directory" vs "Pipeline work directory") and reconcile across all affected files in one sweep.
9. **Pick canonical "Agent" capitalization** and reconcile `supported_software/agent/overview.md`.

---

## Appendix: per-file concrete catalog (deep-dive pass)

This appendix lists every observable change in the 43 file pairs the first audit classified as trivial-only, excluding the 17 byte-identical pairs. Findings are grouped by directory.

### co-scientist/ (footer-link drift only)

All 11 files diverge solely in their "Related" / "See also" footer link list. Two patterns:

- **Pricing-page swap** in 4 files (`command-approval.md`, `configuration.md`, `modes.md`, `nextflow-lsp.md`): Enterprise `- [Usage and cost](./usage-and-cost.md): Co-Scientist usage in Enterprise deployments` → Cloud `- [Credits](./credits.md): Co-Scientist credits and how to request more`.
- **Troubleshooting link addition** in 8 files (`command-approval.md`, `index.md`, `skill-claude-code.md`, `skill-codex.md`, `skill-github-copilot.md`, `skill-other-agents.md`, `skills.md`, `use-cases.md`): Cloud appends `- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors`; Enterprise omits.

No body content, prose, code samples, or product facts differ. `command-approval.md` is the only file with both patterns.

### compute-envs/ trivial-only

- **gke.md** — `pipeline work directory` → `work directory` (UI-label drift).
- **hpc.md** — Cloud adds `[installed on the cluster](https://docs.seqera.io/nextflow/install)` cross-link.

### credentials/ trivial-only (13 files)

All 12 registry/credential pages share a consistent migration pattern: (a) `description` rewritten from "Instructions to create X..." to "Create X..."; (b) single `date: "21 Apr 2023"` becomes two-key `date created` + `last updated: "2025-10-21"`; (c) Enterprise's "From version 22.3, Seqera Platform supports..." Wave preamble replaced by registry-specific value-prop copy.

Per-file specifics:

- **agent_credentials.md** — Token placeholder: Enterprise `<YOUR TOKEN>` → Cloud `<TOKEN_NAME>` (product-fact, see #21).
- **aws_registry_credentials.md** — Intro swap (no body change beyond intro).
- **azure_registry_credentials.md** — Intro swap.
- **docker_hub_registry_credentials.md** — Intro swap + Cloud `date created: "2025-10-21"` typo.
- **gitea_registry_credentials.md** — Intro swap + Cloud `date created: "2025-12-15"` typo + body sentence collapsed into intro. (Pre-existing bug: description says "GitHub" in a Gitea file on both sides.)
- **github_registry_credentials.md** — Intro swap + Cloud `date created: "2025-12-15"` typo + body sentence collapsed.
- **gitlab_registry_credentials.md** — Intro swap + Cloud `date created: "2025-12-15"` typo + body sentence collapsed.
- **google_registry_credentials.md** — Intro swap.
- **managed_identities.md** — Frontmatter date-schema only; no body change.
- **quay_registry_credentials.md** — Intro swap + Cloud `date created: "2025-04-21"` typo + body recommendation sentence about robot accounts deleted from body (now in intro).
- **ssh_credentials.md** — Frontmatter date-schema only; Cloud `date created: "2025-04-21"` typo.

### data/ trivial-only

- **datasets.md** — "Only available in organization workspaces" `:::note` removed by Cloud (product-fact, see top section #4 of "trivial re-examined"); `"sample sheets"` → `"samplesheets"` (3 occurrences); Cloud regression `"a uploaded dataset"` (#23); 6 H2/H3 headings change from imperative to gerund (`"Add a dataset"` → `"Adding a dataset"`); list numbering style changes (explicit `1.2.3.` → lazy `1.1.1.`); 1 trailing period removed; 1 quoting-style change (`**bold**` → `"quoted"`).

### getting-started/ trivial-only

- **quickstart-demo/add-data.md** — Frontmatter date-schema drift; MDX `Tabs`/`TabItem` imports removed on Cloud; 4 new GIFs added on Cloud; `*nf-core/rnaseq*` italics dropped in Enterprise but kept in Cloud (in one place) and added as a `[link](../../quickstart.md#nf-corernaseq)` in another.
- **quickstart-demo/automation.md** — MDX imports removed on Cloud (CONFIRMED); 1 GIF added on Cloud; token placeholder `<your_access_token>` → `<ACCESS_TOKEN>` (#22).
- **quickstart-demo/studios.md** — Frontmatter date-schema drift + `tags` double-space typo on Cloud; R-IDE plain text → `[R-IDE](https://github.com/seqeralabs/r-ide)` link on Cloud; 4 new GIFs/images added on Cloud; "Studio session" → "Studio" wording on Cloud; **"web app" → "RShiny app/application"** swap in 4 places (product-fact, #24); "showcase workspace" → "Community Showcase workspace"; 4 bullet punctuation style changes (`:` → ` — `).
- **quickstart-demo/view-run-information.md** — Frontmatter date-schema drift; 1 GIF added on Cloud; `*nf-core/rnaseq*` italics dropped in 3 places on Cloud; `MULTIQC` code-fencing dropped on Cloud.
- **workspace-setup.md** — Cloud-side editorial rewrite: description verb-first; `last updated: "2026-06-04"`; opening paragraph reworded; intro lead-in reworded; "See... for more information" reordered; 9 list items restructured from prose to "**Bold**: definition"; "first **Owner** of the organizations that you create" → "first **Owner** of each organization you create"; "You are redirected to..." → "Your new workspace is listed in..."; teams heading "Simplify" → "Manage"; teams intro reworded; "Create a new team" → "Create a team"; final bullet trailing sentence dropped on Cloud. No product-fact changes.

### labels/ + launch/ + monitoring/ + pipeline-actions/ + pipelines/ trivial-only

- **labels/overview.md** — Cloud frontmatter description still says "Nextflow Tower" (#20); date-schema drift (Enterprise has two fields, Cloud has one).
- **launch/cache-resume.mdx** — Single UI-label drift: "Revision number" → "Revision".
- **launch/launchpad.md** — Broken `[pipeline-version]` reference key (Cloud uses singular on one line, plural everywhere else) (#19); stray comma in admonition; duplicate **Work directory** bullet inserted on Cloud right after **Compute environment**.
- **monitoring/cloud-costs.md** — Trailing period on description removed on Cloud; date-schema drift; one blank-line collapse.
- **pipeline-actions/overview.md** — UI-label drift "Revision number" → "Revision" in 2 places.
- **pipelines/revision.md** — One product-fact rewording ("regardless of future changes to the repository branch or tag" → "regardless of upstream repository changes"); 1 table-separator width difference (renders identically).
- **pipelines/versioning.md** — See #18. ~13 distinct changes including anchor rename (`#building-pipeline-schema-files` → `#define-pipeline-schema`, valid in each tree), removed `:::tip` admonition, rewritten JSON example (Enterprise truncated, Cloud complete), 3 stripped role links to `roles.md`, dropped "during pipeline edit or launch" qualifier, heading depth change (`###` → `####`), reordered hash-benefit bullets with periods removed, deletion-scope wording change.

### reports/ + seqerakit/ trivial-only

- **reports/overview.md** — Date-schema drift + expanded tags on Cloud; `visualise` → `visualize`; `25MB` → `25 MB`; `Seqera UI` → `Platform` (2 places); `your Seqera workspace primary compute environment` → `your workspace's primary compute environment`; `candidate files for Seqera reports` → `candidate files for reports`; 1 blank-line collapse.
- **seqerakit/commands.md** — One link-label rewrite ("Define your YAML file using CLI options" → "YAML configuration options"); link target unchanged.

### supported_software/ + troubleshooting_and_faqs/ trivial-only

- **agent/overview.md** — 5 lowercase `agent` → `Agent` swaps (#27); `$PATH` un-fenced → backtick-fenced on Cloud.
- **dragen/overview.md** — Date-schema mismatch (`date created` differs between trees: `2023-08-24` Enterprise / `2023-04-24` Cloud — Enterprise's looks suspect); cross-link to `compute-envs/aws-batch#automatic-configuration-of-batch-resources` stripped to plain text on Cloud (#25).
- **fusion/overview.md** — `.md` suffix stripped from 5 cross-links on Cloud (`aws-batch`, `eks`, `azure-batch`, `google-cloud-batch`, `gke`).
- **troubleshooting_and_faqs/resource-labels.md** — Trailing comma removed; final newline missing on Cloud.

---

## Decision log

This section records every change applied on the `enterprise-cloud-divergence-audit` branch and the rationale. Treat it as the canonical decision record — the PR description deliberately stays brief and links here.

### 1. Drift-bug fixes (clear, no judgment needed)

Twenty discrete fixes across 16 files. No product input required — these were typos, broken cross-references, regressions, and dead links surfaced by the audit.

| Fix | Files |
|---|---|
| `"a uploaded dataset"` → `"an uploaded dataset"` (grammar regression) | `platform-cloud/.../data/datasets.md` |
| Broken `[pipeline-version]` reference key → `[pipeline-versioning]` | `platform-cloud/.../launch/launchpad.md` |
| Removed duplicate `**Work directory**` bullet | `platform-cloud/.../launch/launchpad.md` |
| Removed stray comma after `**Pull latest**,` | `platform-cloud/.../launch/launchpad.md` |
| Frontmatter description `"Nextflow Tower"` → `"Seqera Platform"` (reverse-rebrand bug) | `platform-cloud/.../labels/overview.md` |
| Removed duplicate `[custom-container]` link reference | `platform-cloud/.../studios/add-studio.md` |
| Connect example `0.9` / `0.9.0` → `0.10` / `0.10.0` (Cloud was stale) | `platform-cloud/.../studios/container-images.md` |
| Removed stray `` `` `` block above "Add a new participant" | `platform-cloud/.../orgs-and-teams/workspace-management.md` |
| Moved orphaned "This command revokes…" sentence under **Log out** | `platform-cloud/.../co-scientist/authentication.md` |
| Renumbered procedure from `2-9` to `1-8` (artifact of removed user policy section) | `platform-cloud/.../enterprise/advanced-topics/manual-aws-batch-setup.mdx` |
| `visualise` → `visualize`; `25MB` → `25 MB` | `platform-enterprise_docs/reports/overview.md` |
| Restored `date created` from 2025 to 2023 across 6 credential pages (date-typo regression) | `platform-cloud/.../credentials/{docker_hub,gitea,github,gitlab,quay,ssh}*.md` |
| Added 26.1.2 row, bumped `last updated` | `platform-enterprise_docs/functionality_matrix/overview.md` |
| Removed Enterprise's duplicate "Disable compute environment" section | `platform-enterprise_docs/compute-envs/overview.md` |

### 2. Product-direction decisions (your calls)

For these items the audit surfaced divergence but the canonical value required product context. Decisions captured below verbatim.

| Decision | What you said | Applied to |
|---|---|---|
| **R-IDE not RStudio** | "It is R-IDE now, not RStudio." | Replaced "RStudio" → "R-IDE" in `studios_troubleshooting.md` (both trees), `getting-started/rnaseq.md` (both), `getting-started/proteinfold.md` (both), `getting-started/studios.md` Enterprise frontmatter. Kept "RStudio" in changelogs (`studios/connect.md`), Posit-product reference (`studios/managing.md` "RStudio Professional Server"), `tags:` fields, and historical announcement (`cloud_latest.md`). |
| **"web app" not "RShiny app"** | "It deploys RShiny but we call it a web app." | Cloud `quickstart-demo/studios.md`: 7 instances of `RShiny app` / `RShiny application` in user-facing prose and image alt-text → `web app`. Kept the actual asset filenames (`rnaseq-diffab-run-rshiny-app.png` etc.). |
| **"Revision"** UI label | "It's 'Revision' in the UI." | Replaced `Revision number` → `Revision` in Enterprise's `launchpad.md`, `cache-resume.mdx`, `pipeline-actions/overview.md` (×2), `getting-started/proteinfold.md` + `rnaseq.md`, `git/overview.md`. Also fixed the URL query params table on both trees' `launchpad.md`. |
| **"Work directory"** UI label | "It's 'Work directory' in the UI." | Swept 14 files for `Pipeline work directory` (capital) and `pipeline work directory` (lowercase) → `Work directory` / `work directory`. Excluded `cloud/changelog.md` (historical). |
| **lowercase "agent"** | "It should be 'agent' no matter what the case." | Cloud `supported_software/agent/overview.md`: 6 instances of generic `the Agent` / `The Agent` → lowercase. Kept "Tower Agent" (compound proper noun) and `_Agent Connection ID_` (UI label). Enterprise also got `$PATH` backticks added to match Cloud's formatting. |
| **`studio:execute` Launch = ❌** | "studio execute for launch is a 'X' (false) so should both be false" | `roles.md` Enterprise — Launch column flipped from ✅ to ❌. |
| **Token placeholder = `<ACCESS_TOKEN>`** | "What do the other placeholders in the docs look like? Match that." | Investigated convention; `<UPPER_UNDERSCORE>` style dominates (`<PLATFORM_ACCESS_TOKEN>`, `<ACCESS_TOKEN>` are most common). Standardized on `<ACCESS_TOKEN>` across `credentials/agent_credentials.md` (both: was `<YOUR TOKEN>` / `<TOKEN_NAME>`), `quickstart-demo/automation.md` Enterprise (was `<your_access_token>`), `supported_software/agent/overview.md` (both: was `<YOUR TOKEN>`). |
| **Functionality matrix `j21-26.04`** | "The default launcher is j21-26.04 from 26.1.0 for cloud and enterprise. The format has changed." | Enterprise `functionality_matrix/overview.md` 26.1.0 row: `j21-25.10.2` → `j21-26.04`. (26.1.2 row already added in round 1.) |

### 3. Content ports

#### Ported from Cloud → Enterprise

- **Bitbucket API tokens content** — `platform-enterprise_docs/git/overview.md` entire Bitbucket section replaced. Now documents API tokens, includes the `:::warning` about app-password deprecation (September 9, 2025 / June 9, 2026), Username field clarified to `(account email)`, Password field renamed to **Token**. Preserved Enterprise's prose style (`_BitBucket_` underscore italics, bold "Create BitBucket credentials" header).
- **Antigravity/Gemini skill** — Copied [platform-cloud/docs/co-scientist/skill-antigravity.md](platform-cloud/docs/co-scientist/skill-antigravity.md) → [platform-enterprise_docs/co-scientist/skill-antigravity.md](platform-enterprise_docs/co-scientist/skill-antigravity.md) verbatim (skill content is platform-agnostic). Added the Antigravity bullet to Enterprise's `coding-agents.md` supported-agents list.
- **AWS Secrets Manager `ListSecrets` warning** — Added the `:::note` warning admonition to Enterprise's `secrets/overview.md`, identical text to Cloud's. The warning explains that scoping down the IAM policy without keeping `ListSecrets` on `*` causes secret-deletion failures and stuck workflows — a real operational gotcha Enterprise admins arguably need *more* than Cloud customers.
- **Launch form fields** — Added **Version name**, **Version ID**, **Main script**, and **Schema** (with 3 sub-options: Repository default, Repository path, Seqera Platform schema) to Enterprise's `getting-started/quickstart-demo/launch-pipelines.md`. Also dropped `(*Optional*)` prefixes on Config profiles/Labels to align with Cloud's tutorial style. (Note: the canonical launchpad reference page already documents all these fields on both trees — this port closes the gap in the *quickstart tutorial* specifically.)

#### Ported from Enterprise → Cloud

- **`/migrate-from-wdl` and `/write-nf-test` skills** — Added 2 rows to Cloud's `co-scientist/reference/skills-reference.md` (same position as Enterprise: after `/convert-r-script`, before `/fix-strict-syntax`). The audit initially had this flipped — Enterprise had them, Cloud didn't.

#### `pipelines/versioning.md` reconciliation (partial port)

Enterprise's `versioning.md` adopted three Cloud improvements:
- Truncated JSON example `{ "track_changes": false }` replaced with Cloud's complete `"my_parameter": { ... }` example
- Heading depth `### Manage pipeline versions` → `#### Manage pipeline versions` (was an orphan h3 sandwiched between h4s)
- Deletion-scope wording → Cloud's more precise "Individual *draft* versions cannot be deleted"

Deliberately KEPT Enterprise-only content (Enterprise's version is better here):
- Role permission links `[Maintain or higher](../orgs-and-teams/roles.md)` in 3 places
- `:::tip` admonition about commit ID pinning for reproducibility
- `"during pipeline edit or launch"` qualifier
- Anchor `#building-pipeline-schema-files` (valid in Enterprise's own schema page; renaming would break the cross-link)
- Hash-benefit bullet order (Provenance first, with trailing periods — Enterprise house style)

### 4. Frontmatter date normalization

**Goal:** every `.md` / `.mdx` file in `platform-enterprise_docs/` and `platform-cloud/docs/` follows the format:

```yaml
date created: "YYYY-MM-DD"
last updated: "YYYY-MM-DD"
```

**Pre-normalization state:** 108 Enterprise files had a single `date:` field in various formats (`"21 Apr 2023"`, `"26 August 2024"`, `"2023-04-21"`, etc.); 3 Cloud files had non-ISO `date created`; 2 Cloud files had non-ISO `last updated`.

**Method:** [/tmp/normalize_frontmatter_dates.py](/tmp/normalize_frontmatter_dates.py) (one-shot script, not preserved in repo). Logic:
- Single `date: X` → split into `date created: "<iso>"` + `last updated: "<iso>"` (mirrored — no false "updated today" claim).
- Non-ISO `date created` or `last updated` → reformatted to `YYYY-MM-DD`.
- Files with one of the two fields but not the other → missing field added, mirroring the present one.

**Result:** 164 files modified (108 splits + 56 format/missing-field cleanups). Re-scanned after: 0 non-conforming files in either tree.

### 5. New tooling — prevent future drift

To stop `last updated:` from going stale silently, added:

1. **[/.github/scripts/bump-last-updated.py](.github/scripts/bump-last-updated.py)** — pre-commit fixer hook. Bumps `last updated:` to today on changed `.md` / `.mdx` files. Inserts the field if `date created:` exists but `last updated:` doesn't. Skips files without `date created:` (changelog entries, partials). Idempotent.
2. **[/.pre-commit-config.yaml](.pre-commit-config.yaml)** — registered the hook as `bump-last-updated`. Excludes `platform-enterprise_versioned_docs/` (frozen snapshots — `last updated` should reflect snapshot date, not edit date) and `changelog/` (entries don't follow the convention).
3. **[/.github/workflows/pre-commit-fix.yaml](.github/workflows/pre-commit-fix.yaml)** — extended to trigger on `pull_request: opened/synchronize/reopened` events (same-repo only) in addition to the existing `fix formatting` comment route. Fork PRs still use the comment route since they have read-only tokens. The auto-trigger excludes runs where the PR author is `seqera-docs-bot` to avoid infinite loops.

**Coverage matrix:**

| Contributor flow | What happens |
|---|---|
| Local dev with pre-commit installed | `git commit` → hook bumps date → file re-staged → commit proceeds |
| Local dev without pre-commit | PR opened/updated → CI runs prek → bot commits fix back to PR branch |
| External fork contributor | CI workflow skipped for forks; reviewer comments `fix formatting` to run the existing comment route |
| Bot pushing its own commits | Workflow excludes `seqera-docs-bot`-authored PRs (no infinite loop) |

### 6. Documentation updates for the new tooling

- **[README.md](README.md)** — "Install pre-commit" section: replaced generic "basic standard hooks" paragraph with full bullet list of all 5 hook categories. Workflows summary table: updated `pre-commit-fix.yaml` row to reflect dual triggers. "Quality gates that block PR merges": updated `pre-commit-check.yaml` and `pre-commit-fix.yaml` descriptions to mention `bump-last-updated` and the auto-trigger. "Cross-workflow dependencies" diagram: added the `PR opened/synchronize` row above the comment-trigger row.
- **[.github/scripts/README.md](.github/scripts/README.md)** — added a `bump-last-updated.py` section covering invocation, behavior, exit codes, and scope/exclusions. Added a preamble linking to the README workflows audit.

### 7. Audit corrections (the original audit was wrong on these)

1. **"Disable compute environment" was claimed to be missing from Cloud** — false. Cloud has it at `platform-cloud/docs/compute-envs/overview.md:69-81`. The duplicate ON ENTERPRISE was the real bug (now fixed in Round 1).
2. **"`/migrate-from-wdl` and `/write-nf-test` are Cloud-only"** — flipped. Enterprise's `co-scientist/reference/skills-reference.md` had them; Cloud's didn't. Cloud got them ported in Round 5.
3. **"Enterprise `pipelines/versioning.md` link to `#building-pipeline-schema-files` is broken"** — false. That anchor exists in Enterprise's own `pipeline-schema/overview.md`. The two trees use different anchor names but each link points to a valid anchor in its own tree.
4. **"`pipelines/versioning.md` is trivial-only divergence"** — misclassified. Deep-dive found ~13 distinct changes including a broken JSON example, removed admonition, softened permissions language. Promoted to substantive in Round 2.

### Deliberately untouched (per your instructions)

- **Studios SSH content** on Cloud — your call: "not needed yet, not in Cloud product"
- **Azure Batch dual-pool + GCP WIF** on Cloud — your call: "not yet in Cloud"
- The "`rstudio`" lowercase tags in `tags:` fields — left alone since tags function as search terms
- Connect/server changelog entries mentioning "RStudio" — historical record
- `studios/managing.md` "RStudio Professional Server" reference — third-party Posit product name
- `cloud_latest.md` historical announcement — historical record

### Final state

- **209 files modified** across both `platform-enterprise_docs/` and `platform-cloud/docs/`
- **3 new files**:
  - [enterprise-cloud-divergence-audit.md](enterprise-cloud-divergence-audit.md) (this doc)
  - [platform-enterprise_docs/co-scientist/skill-antigravity.md](platform-enterprise_docs/co-scientist/skill-antigravity.md) (Antigravity port)
  - [.github/scripts/bump-last-updated.py](.github/scripts/bump-last-updated.py) (new tooling)
- **2 config/workflow files modified**: `.pre-commit-config.yaml`, `.github/workflows/pre-commit-fix.yaml`
- **2 doc-of-docs files updated**: `README.md`, `.github/scripts/README.md`
