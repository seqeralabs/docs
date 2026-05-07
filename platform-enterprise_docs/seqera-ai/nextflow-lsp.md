---
title: "Language server"
description: "Use language-server code intelligence features in Co-Scientist"
date created: "2026-02-26"
tags: [seqera-ai, co-scientist, cli, lsp, code-intelligence]
---

When you ask Co-Scientist to help with code in your workspace, it uses language server (LSP) context to provide:

- Explanations for errors and warnings in your code.
- Context-aware completions and suggestions.
- Better navigation and understanding across project files.

For Nextflow projects, this includes diagnostics and code intelligence for scripts and config files.

### Language support

| LSP Server | Extensions | Requirements |
|------------|------------|--------------|
| Nextflow | `.nf`, `.config` | Java 17+ installed |
| Python (Pyright) | `.py`, `.pyi` | Auto-installs |
| R | `.r`, `.R`, `.rmd`, `.Rmd` | R runtime installed |

LSP servers automatically start when you work with files that match these extensions.

### Workspace detection

Co-Scientist detects the relevant language context from your active workspace and applies matching intelligence automatically.

This means you can move between Nextflow, Python, and R files in the same project and get language-aware assistance without manual setup.

See [Nextflow Language Server](https://github.com/nextflow-io/language-server) for advanced configuration details.

### Learn more

- [Seqera CLI](./index.md): Co-Scientist overview
- [Get started](./get-started.md): Start using Co-Scientist
- [Use cases](./use-cases.md): Seqera CLI use cases
- [Usage and cost](./usage-and-cost.md): Co-Scientist usage in Enterprise deployments
