---
title: "Installation"
description: "Install and configure Seqera AI CLI"
date: "15 Dec 2025"
tags: [seqera-ai, cli, installation]
---

:::caution Seqera AI CLI is in beta
Seqera AI CLI is currently in beta. Features and commands may change as we continue to improve the product.
:::

:::note
Seqera Cloud users receive $20 in free credits to get started with Seqera AI. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

## Requirements

- Python 3.13 or later
- macOS, Linux, or Windows with WSL
- A Seqera Platform account ([sign up for free](https://cloud.seqera.io))
- An internet connection

## Python Package Index

The Seqera AI CLI is distributed as a Python package through PyPI, making installation simple and straightforward using standard Python tools.

### Install

To install Seqera AI CLI from Python Package Index (PyPI):

1. Check your Python version:

   ```bash
   python --version
   # or
   python3 --version
   ```

   If you need to install or upgrade Python, see [python.org](https://www.python.org/downloads/) or use your system's package manager.


1. Install Seqera AI CLI:

   ```bash
   pip install seqera-ai
   ```

   :::tip
   Consider using a virtual environment to avoid conflicts with other Python packages:
   ```bash
   python -m venv seqera-env
   source seqera-env/bin/activate  # On Windows: seqera-env\Scripts\activate
   pip install seqera-ai
   ```
   :::

1. Verify your installation:

   ```bash
   seqera --version
   ```

   You will see output similar to:

   ```console
   seqera-ai 0.1.0
   ```

### Upgrade

To upgrade your version of Seqera AI CLI, run:

```bash
pip install --upgrade seqera-ai
```

### Uninstall

To uninstall your version of Seqera AI CLI, run:

```bash
pip uninstall seqera-ai
```

## Learn more

- [Seqera AI CLI](index.md): Seqera AI CLI overview
- [Authentication](./authentication.md): Login, logout, and session management
- [Command approval](./command-approval.md): Control which commands run automatically
- [Use cases](./use-cases.md): Seqera AI CLI use cases
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors
