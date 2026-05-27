---
title: "Edit local project files"
description: "Make AI-assisted edits to files in your working directory with Co-Scientist"
date created: "2026-05-27"
tags: [seqera-ai, co-scientist, cli, local-files, use cases]
---

Co-Scientist can interact with files in your current working directory. The examples below are prompts you can adapt to your own project.

## Start from your project folder

```bash
cd /path/to/your/project
seqera ai
```

## Ask for help with local tasks

```
> Show me the structure of main.nf
```

```
> Add a new process to handle quality control
```

:::note
Local file operations are controlled by [approval modes](../command-approval.md#approval-modes). By default, Co-Scientist asks for your approval before making changes outside your working directory or running potentially dangerous commands.
:::

## Learn more

- [Use cases](../use-cases.md): More Co-Scientist use cases
- [Command approval](../command-approval.md): Control which commands run automatically
- [Develop and debug Nextflow pipelines](./nextflow.md): AI-assisted pipeline development
- [Skills reference](../skills-reference.md): Built-in skills, slash commands, and session limits
