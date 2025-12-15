---
title: "Installation"
description: "Install and configure Seqera AI CLI"
date: "15 Dec 2025"
tags: [seqera-ai, cli, installation]
---

:::caution
Seqera AI is currently in beta. Features and commands may change as we continue to improve the product.
:::

## System requirements

- **Python**: 3.13 or later
- **Operating system**: macOS, Linux, or Windows with WSL
- **Network**: Internet connection for authentication and AI services

### Check your Python version

```bash
python --version
# or
python3 --version
```

If you need to install or upgrade Python, visit [python.org](https://www.python.org/downloads/) or use your system's package manager.

## Installation methods

### Using pipx (recommended)

[pipx](https://pipx.pypa.io/) installs Python applications in isolated environments, preventing dependency conflicts:

```bash
# Install pipx if you don't have it
pip install pipx
pipx ensurepath

# Install Seqera AI
pipx install seqera-ai
```

### Using pip

Install directly with pip:

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

## Verify installation

Confirm Seqera AI is installed correctly:

```bash
seqera --version
```

You should see output like:

```
seqera-ai 0.1.0
```

Check available commands:

```bash
seqera --help
```

## Upgrading

### With pipx

```bash
pipx upgrade seqera-ai
```

### With pip

```bash
pip install --upgrade seqera-ai
```

## Uninstalling

### With pipx

```bash
pipx uninstall seqera-ai
```

### With pip

```bash
pip uninstall seqera-ai
```

## Troubleshooting

### Command not found

If you see `seqera: command not found` after installation:

1. **Check PATH**: Ensure the Python scripts directory is in your PATH
   ```bash
   # For pipx
   pipx ensurepath

   # Then restart your terminal or run
   source ~/.bashrc  # or ~/.zshrc
   ```

2. **Verify installation location**:
   ```bash
   pip show seqera-ai
   ```

### Python version errors

If you see errors about Python version:

1. Check you have Python 3.13+:
   ```bash
   python3 --version
   ```

2. If using multiple Python versions, specify the correct one:
   ```bash
   python3.13 -m pip install seqera-ai
   ```

### Permission errors

If you encounter permission errors during installation:

```bash
# Use --user flag with pip
pip install --user seqera-ai

# Or use pipx (recommended)
pipx install seqera-ai
```

## Next steps

After installation:

1. [Authenticate](./authentication) with your Seqera Platform account
2. Start the [AI assistant](./getting-started#step-3-start-the-ai-assistant)
