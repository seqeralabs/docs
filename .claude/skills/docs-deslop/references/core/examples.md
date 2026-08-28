# Before/after examples

Longer passages from each topic type, showing the rewrite end-to-end. Each example names its **topic type** in the change notes — classification drives most of the structural decisions, so you'll see it lead.

The "Changes" notes name the patterns from `phrases.md`, `structures.md`, `style-guide.md`, and `topic-types.md` that drove each edit.

The examples use Seqera Platform vocabulary (workspaces, pipelines, the Launchpad, compute environments, runs, credentials, the `tw` CLI). The same rules apply to any technical product; the product names are illustrative.

---

## Example 1 — Concept (README intro)

**Before** (titled `Getting Started with Seqera Platform`):

> Seqera Platform is a powerful, comprehensive solution that empowers scientific teams to seamlessly run their data analysis at scale. With Seqera Platform, you can leverage cutting-edge orchestration to deliver blazing fast results across any cloud. Whether you're a small lab or a large enterprise, Seqera Platform has you covered.
>
> In this guide, we'll explore how to get started with Seqera Platform and unlock its full potential.

**After** (now a Concept; the setup steps that were implied here belong in a separate Task):

> # Seqera Platform
>
> Seqera Platform runs Nextflow pipelines on cloud and HPC compute environments from a central interface. It provides a Launchpad for launching pre-configured pipelines, real-time run monitoring, and shared workspaces where teams reuse the same pipelines, compute environments, and credentials.

**Changes:**

- Classified as **Concept**. Renamed from `Getting Started with Seqera Platform` (the avoided title `Getting Started`) to `Seqera Platform` (noun, per Concept rules)
- Cut all marketing adjectives (powerful, comprehensive, cutting-edge, blazing fast)
- Cut sales-deck verbs (empowers, leverage, deliver, unlock)
- Cut the self-referential closer ("In this guide, we'll explore...")
- Removed the "whether you're..." sweeping promise — replaced with the concrete capabilities (Launchpad, run monitoring, shared workspaces)

---

## Example 2 — Task (split from a mistyped Concept)

**Before** (a "compute environment" section of a README, hovering between concept and task):

> ## Compute Environments
>
> Now that you've successfully created your workspace, let's dive into setting up a compute environment for your specific use case. Compute environments are quite flexible and offer a great deal of power. In order to run pipelines on AWS, you'll need to create an AWS Batch compute environment.
>
> Think of the compute environment as the engine of your workspace — it tells Seqera Platform where and how to run your pipelines.

**After** (now a clean Task):

> ## Add an AWS Batch compute environment
>
> Create an AWS Batch compute environment so the workspace can run pipelines on AWS. Seqera Platform uses it to provision instances and submit jobs.
>
> Prerequisites:
>
> - AWS credentials added to the workspace (see [Add AWS credentials](#))
> - An S3 bucket for the pipeline work directory
>
> To add an AWS Batch compute environment:
>
> 1. In the workspace, select **Compute Environments**, then **Add compute environment**.
> 2. Select **Amazon AWS Batch** as the platform.
> 3. Select your AWS credentials and the region.
> 4. Set the pipeline work directory to your S3 bucket path.
> 5. Select **Create**.
>
> For the full list of fields, see [AWS Batch compute environment settings](#).

**Changes:**

- Classified as **Task**. Renamed from `Compute Environments` (noun) to `Add an AWS Batch compute environment` (active verb + noun, per Task rules)
- Added a `Prerequisites:` list (was prose: "Now that you've successfully created your workspace...")
- Added numbered steps with imperative verbs ("Select...", "Set...") using the location-then-action pattern
- Linked to a separate **Reference** topic for the full settings table instead of describing every field inline
- Cut the engine metaphor (patronizing analogy)
- Cut "let's dive into" (pedagogical voice) and "in order to" (padding)

---

## Example 3 — Reference (with sales intro removed)

**Before** (titled `Compute Environment Options`):

> Our comprehensive set of compute environment options gives you the flexibility and power to run pipelines on any infrastructure. Whether you're optimizing for cost or speed, we've got you covered.
>
> The following options are available:
>
> - `region`: The AWS region.
> - `workDir`: The work directory.
> - `maxCpus`: The maximum CPUs.

**After:**

> # AWS Batch compute environment settings
>
> | Setting             | Type    | Default | Description                                                            |
> | ------------------- | ------- | ------- | ---------------------------------------------------------------------- |
> | `region`            | string  | —       | AWS region where Batch runs jobs, for example `us-east-1`.             |
> | `workDir`           | string  | —       | S3 bucket path for pipeline scratch and intermediate files.            |
> | `provisioningModel` | string  | `SPOT`  | EC2 provisioning model. One of `SPOT`, `EC2` (on-demand).              |
> | `maxCpus`           | integer | `256`   | Maximum vCPUs Batch provisions across all jobs in this environment.    |

**Changes:**

- Classified as **Reference**. Title kept as a noun (`AWS Batch compute environment settings`), sentence case
- Cut the marketing intro entirely (Reference rules: no narrative intro, lead with the table)
- Converted the bulleted list into a four-column table — the standard Reference shape (`Name | Type | Default | Description`)
- Each row is now self-contained — a reader who lands on `provisioningModel` can understand it without reading the others
- Specified the enum values for `provisioningModel` instead of "the AWS region"

---

## Example 4 — Troubleshooting reference

**Before** (titled `Launch Issues`):

> ## Launch Issues
>
> Sometimes you might run into problems when launching a pipeline. Don't worry — these things happen! If you see something like an access denied error, you can try a few things, including but not limited to checking your credentials, verifying the bucket exists, and so on.

**After:**

> ## Error: `AccessDenied (Service: S3, Status Code: 403)` when launching a run
>
> This error occurs when the compute environment's credentials do not have write access to the pipeline work directory bucket.
>
> To resolve:
>
> 1. Confirm the work directory points to a bucket you own: `tw compute-envs view --name <ce-name>`.
> 2. Verify the credentials' IAM policy allows `s3:PutObject` and `s3:GetObject` on that bucket.
> 3. Relaunch the run.

**Changes:**

- Classified as **Troubleshooting reference**. Moved the actual error message into the title with the `Error:` severity prefix, wrapped the message in backticks
- Cut the chatty opener ("Don't worry — these things happen!")
- Restructured body as symptom → cause → resolution (the Troubleshooting reference shape)
- Used the specific term **resolve** (Troubleshooting rules: use "workaround" for temporary, "resolve" for permanent)
- Cut "including but not limited to... and so on" — replaced with three concrete steps

---

## Example 5 — Task (runbook step)

**Before:**

> If the workspace is experiencing issues with pipeline submission, it's recommended that the on-call engineer should be paged. The on-call rotation can be found in PagerDuty. Once paged, the on-call engineer will dive deep into the logs to determine what might be the root cause. It's important to note that the logs may be located in multiple locations.

**After:**

> ## Page the on-call engineer
>
> Do this when pipeline runs fail to submit across the workspace for more than 5 minutes.
>
> To page the on-call:
>
> 1. Open the [PagerDuty rotation for seqera-prod](https://pagerduty.example.com/...).
> 2. Select **Trigger incident** and assign it to the on-call engineer.
> 3. In `#incident-response`, post the failure mode, what you're doing, and the ETA for the next update.

**Changes:**

- Classified as **Task** (this is a Troubleshooting page made of typed Task topics)
- Added an active-verb title (`Page the on-call engineer`)
- Replaced "If the workspace is experiencing issues" with a concrete trigger ("runs fail to submit for more than 5 minutes")
- Cut passive voice ("it's recommended that... should be") — used imperatives
- Cut "dive deep into" (slop verb)
- Replaced the vague "logs may be located in multiple locations" with the three concrete steps the responder actually takes

---

## Example 6 — Release note as Reference

**Before:**

> # Version 24.1
>
> ## What's New
>
> We're thrilled to announce the release of version 24.1, packed with exciting new features and improvements that will fundamentally transform how you work with Seqera Platform. This release represents a significant milestone in our journey to deliver the most powerful data orchestration solution available.
>
> Key highlights include:
>
> - **Performance Improvements**: We've made significant performance improvements across the board.
> - **Enhanced Security**: Security has been enhanced with new features.
> - **Better Developer Experience**: We've improved the developer experience.
>
> In conclusion, this release continues our commitment to building the best platform for scientific computing.

**After:**

> # Version 24.1
>
> - Added Azure Batch managed identity support, so compute environments authenticate without stored keys (#812)
> - Reduced Launchpad load time from 4s to under 1s for workspaces with more than 100 pipelines (#823)
> - Added `tw runs dump` to export a run's logs and metadata as a tarball for support tickets (#841)
>
> **Breaking change:** `tw` now requires `TOWER_ACCESS_TOKEN` to be set explicitly; the deprecated `--token` flag is removed. See the [migration notes](#).

**Changes:**

- Classified as **Reference** — each release note entry is a typed lookup item, so the page follows Reference rules
- Cut the marketing opener entirely ("thrilled... fundamentally transform... significant milestone")
- Replaced the vague bold-first bullets with the specific change, the magnitude, and the issue/PR number
- Cut the "In conclusion" closer (Reference doesn't get a wrap-up; signposted conclusions are out)
- Surfaced the breaking change as a call-out so it isn't buried

---

## Example 7 — Tutorial

**Before** (titled `Pipeline Guide`):

> # Pipeline Guide
>
> In today's rapidly evolving research landscape, scalable analysis is paramount. We've put together this comprehensive guide to walk you through everything you need to know about running pipelines with Seqera Platform.
>
> In this guide, we'll cover the basics, dive into advanced topics, and unlock the full potential of Seqera Platform.

**After:**

> # Tutorial: Launch nf-core/rnaseq on AWS Batch
>
> In this tutorial, you'll launch the nf-core/rnaseq pipeline on an AWS Batch compute environment, then monitor the run and view its results in Seqera Platform.
>
> ## Before you begin
>
> - A Seqera Platform account and a workspace
> - AWS credentials added to the workspace
> - An S3 bucket for the pipeline work directory
>
> ## Add an AWS Batch compute environment
>
> ...
>
> ## Add nf-core/rnaseq to the Launchpad
>
> ...
>
> ## Launch the run and monitor it
>
> ...

**Changes:**

- Classified as **Tutorial**. Retitled with the `Tutorial:` prefix and an active verb (`Launch nf-core/rnaseq on AWS Batch`)
- Replaced the vague "guide to walk you through everything" with a one-sentence outcome the reader can verify
- Replaced the "in today's rapidly evolving landscape" framing with a `Before you begin` section listing the actual prerequisites
- Renamed the planned section titles to active-verb form (`Add...`, `Launch...`)
- The friendlier tutorial tone is fine (light future tense, `In this tutorial, you'll...`), but no marketing puffery

---

## Example 8 — Already good, leave it alone

**Before:**

> The `tw launch --wait` option blocks until the run reaches the given status, for example `SUCCEEDED`. Use it in CI so the job fails when the run does not succeed.

**After (unchanged):**

> The `tw launch --wait` option blocks until the run reaches the given status, for example `SUCCEEDED`. Use it in CI so the job fails when the run does not succeed.

This is what we are trying to produce: a tight Reference entry with active voice, the imperative verb, and no fluff. Don't touch it.

---

## What the change summary should look like

After producing the rewrite, return a summary like this:

> **Changes:**
>
> - Classified as **Task** (input was titled `Compute Environments` and mixed concept + task content; split into a Concept above and the Task below)
> - Renamed title from `Compute Environments` to `Add an AWS Batch compute environment` (active verb + noun, per Task rules)
> - Added a `Prerequisites:` list (was buried in prose)
> - Cut 8 marketing adjectives (powerful, comprehensive, seamless, robust, blazing fast, game-changing, cutting-edge, world-class)
> - Cut self-referential intro ("In this guide, we'll walk you through...")
> - Replaced "leverage"/"utilize" with "use" (6 instances)
> - Cut the "In conclusion" paragraph (restated the doc)
> - Reduced length 42% (480 → 280 words)

The first bullet always names the topic type. That's how the reader knows the rewrite is anchored to the right rules.
