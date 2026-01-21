---
title: "Seqera AI CLI"
description: "Seqera AI CLI troubleshooting."
date created: "2024-12-15"
last updated: "2025-12-15"
tags: [faq, help, seqera ai, troubleshooting]
---

## Installation

##### Command not found

If you see `seqera: command not found` after installation:

1. Ensure the Python scripts directory is in your PATH:

   ```bash
   # Restart your terminal or run
   source ~/.bashrc  # or ~/.zshrc
   ```

1. Verify your installation location:

   ```bash
   pip show seqera-ai
   ```

##### Python version errors

If you see errors about Python version:

1. Check you have Python 3.13+ installed:

   ```bash
   python3 --version
   ```

1. If using multiple Python versions, specify the correct one:

   ```bash
   python3.13 -m pip install seqera-ai
   ```

##### Permission errors

If you encounter permission errors during installation:

1. Use the `--user` flag with pip

   ```bash
   pip install --user seqera-ai
   ```

## Authentication

##### Browser doesn't open

If the browser doesn't open automatically:

1. Check the terminal output for a URL
1. Copy and paste the URL into your browser manually
1. Complete authentication in the browser

##### Login timeout

If authentication times out:

1. Ensure you have internet connectivity
1. Check that `https://seqera.io` is accessible
1. Log out and log in again

##### Token storage errors

If you see keychain-related errors:

1. Ensure your system keychain service is running
1. Check that you have permission to access the keychain

:::note
The CLI will automatically fall back to file-based storage.
:::

##### Session expired

If your session has expired:

1. Log out and log in again:

   ```bash
   seqera logout
   seqera login
   ```
