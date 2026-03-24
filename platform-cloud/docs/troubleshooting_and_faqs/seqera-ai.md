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

1. Verify the installation location:

   ```bash
   which seqera
   ```

1. Ensure the npm global bin directory is in your PATH:

   ```bash
   # Check npm global bin directory
   npm bin -g

   # Restart your terminal or run
   source ~/.bashrc  # or ~/.zshrc
   ```

1. If you installed the standalone binary, verify it is in a directory on your PATH:

   ```bash
   echo $PATH
   ```

##### npm permission errors

If you encounter permission errors during installation:

1. Use the npm prefix option to install to a user-writable directory:

   ```bash
   npm install -g seqera --prefix ~/.npm-global
   ```

1. Add the directory to your PATH:

   ```bash
   export PATH="$HOME/.npm-global/bin:$PATH"
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

If you see errors related to credential storage:

1. Check that you have write permissions to `~/.config/seqera-ai/`

   ```bash
   ls -la ~/.config/seqera-ai/
   ```

1. If the directory doesn't exist, create it:

   ```bash
   mkdir -p ~/.config/seqera-ai
   ```

##### Session expired

If your session has expired:

1. Log out and log in again:

   ```bash
   seqera logout
   seqera login
   ```
