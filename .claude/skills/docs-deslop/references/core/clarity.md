# Clarity and readability

Rules that keep documentation scannable and understandable for its audience. These sit alongside the slop, structure, and style rules. A sentence can be free of slop and still be too long, too dense, or full of undefined jargon.

## Define terms on first use

Define a technical term the first time it appears on a page, then use it freely. Match the depth of the definition to the reader: a page for Nextflow developers doesn't need "channel" defined; a getting-started page does.

Watch especially for:

- **Domain terms:** pipeline, workflow, process, task, executor, scheduler, channel, operator
- **Infrastructure terms:** compute environment, instance, node, object or blob storage, IAM role, service account, VPC, subnet

Flag a term when it is:

- Used before it's defined
- Assumed but never defined
- An acronym with no expansion (see Abbreviations in `terminology.md`)

**Before:**

> The executor runs the pipeline tasks automatically.

**After:**

> The executor — the system that runs pipeline tasks, such as AWS Batch or Kubernetes — runs the tasks automatically.

Don't over-explain terms the audience already owns. The goal is the reader never hits a word they can't resolve, not that every word is glossed.

## Sentence length

Aim for most sentences under 25 words; rework anything over 30. Long sentences usually hide one of three things:

- Multiple ideas that should be separate sentences.
- Nested clauses that bury the subject and verb.
- A list smuggled into prose.

**Before** (42 words):

> When you configure a compute environment, you need to ensure that the credentials you're using have the appropriate permissions for the cloud provider, which typically means access to create and manage instances, storage, and networking resources.

**After:**

> When you configure a compute environment, make sure your credentials have the right cloud-provider permissions. These usually cover instances, storage, and networking.

**Fix:** Split at the conjunction, or pull the trailing list out into a bulleted list. Also watch for double negatives ("don't forget to not disable" → "keep it enabled").

## Glossary candidates

If a term recurs across a page or a doc set without a definition, suggest a glossary entry instead of redefining it inline each time:

> - **executor**: the system that runs pipeline tasks (for example, local, AWS Batch, or Kubernetes)
> - **compute environment**: a configured set of resources for running pipelines

---

### Attribution

Adapted from the `clarity` SME in the Seqera documentation review agents in the [seqeralabs/docs](https://github.com/seqeralabs/docs/tree/master/.claude/agents) repository.
