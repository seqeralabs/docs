---
title: "Command approval"
description: "Control which local commands require user approval in Seqera AI"
date: "15 Dec 2025"
tags: [seqera-ai, cli, approval, security]
---

:::caution Seqera AI CLI is in beta
Seqera AI CLI is currently in beta. Features and commands may change as we continue to improve the product.
:::

:::note
Seqera Cloud users receive $20 in free credits to get started with Seqera AI. [Contact us](https://seqera.io/platform/seqera-ai/request-credits/) for additional credits.
:::

Seqera AI can execute local commands and edit files in your environment. This page explains approval modes that control which operations run automatically versus which require your permission, including dangerous commands, workspace boundaries, and best practices.

## Approval prompts

When a command requires approval, you will see a prompt similar to:

```
APPROVAL REQUIRED (default mode)
Command: rm -rf ./build/

[1] Yes, approve this command
[2] Always approve this session
[3] No, reject

Press 1, 2, or 3 to choose
```

You can:

- **1**: Run the command once (or press Enter)
- **2**: Run the command and auto-approve all commands for the rest of the session
- **3**: Reject the command (or press Escape)

## Approval modes

Approval modes control which local commands Seqera AI can execute automatically and which require your explicit approval. This provides a balance between convenience and safety when working with local files and commands.

There are three approval modes:

| Mode | Description | Best for |
|------|-------------|----------|
| **basic** | Only safe, read-only commands run automatically | Maximum security |
| **default** | Safe commands and workspace file edits run automatically | Typical development |
| **full** | Everything except dangerous commands runs automatically | Experienced users |

You can set the approval mode when starting the CLI:

```bash
seqera ai --approval-mode full
```

Or change it during a session using the `/approval` TUI command:

```
/approval basic
```

### Basic

**Rule**: Only safe, read-only commands run automatically. Everything else requires approval.

This is the most restrictive mode. The assistant can only auto-execute commands that view information without making changes.

**Auto-executes**:

- `cat` - View file contents
- `ls` - List directory contents
- `pwd` - Show current directory
- `head` - View file beginning
- `tail` - View file end
- `tree` - Display directory tree
- `echo` - Print text (without file redirection)
- `date` - Show current date/time
- `whoami` - Show current user
- `env` - Display environment variables
- `printenv` - Print environment variables
- `stat` - Show file status
- `uptime` - Show system uptime

**Requires approval**: All other commands, including file edits, directory creation, and any other command execution. Safe commands that include file redirections (e.g., `echo "hello" > file.txt`) also require approval.

**Use when**: You want maximum control and visibility over every action the assistant takes.

**Examples**:

```
> Create a new file called test.txt with "hello world"

APPROVAL REQUIRED (basic mode)
Command: Write ./test.txt

[1] Yes, approve this command
[2] Always approve this session
[3] No, reject
```

### Default

**Rule**: Safe commands and file operations within your workspace run automatically. All other commands require approval.

This is the recommended mode for most users. It allows productive workflow while protecting system files and preventing destructive operations.

**Auto-executes**:
- All safe commands from basic mode (without file redirections)
- File edits **within your current workspace**:
  - Creating files (`touch`, file creation)
  - Editing files (text modifications)
  - Creating directories (`mkdir`)
  - Copying files (`cp` within workspace)
  - Moving files (`mv` within workspace)

**Requires approval**:
- File operations **outside your workspace**
- All dangerous commands (see below)
- Commands with file redirects to paths outside workspace
- All other commands (e.g., `curl`, `wget`, `git`, `npm`, `python`, etc.)

**Use when**: You're doing typical development work and want convenience without compromising safety.

**Examples**:

```
> Create a new file called test.txt with "hello world"

Created ./test.txt
```

File creation in the workspace runs automatically.

```
> Edit /etc/hosts

APPROVAL REQUIRED (default mode)
Command: Edit /etc/hosts

[1] Yes, approve this command
[2] Always approve this session
[3] No, reject
```

Editing outside the workspace requires approval.


### Full

**Rule**: Everything runs automatically except explicitly dangerous commands.

This is the most permissive mode. Use it when you fully trust the assistant's actions and want minimal interruption.

**Auto-executes**: All commands except those on the dangerous list.

**Requires approval**: Only dangerous commands (see below).

**Use when**: You're an experienced user comfortable with automated command execution, or when working in an isolated/disposable environment.

## Dangerous commands

These commands **always require approval** in any mode:

| Command | Risk |
|---------|------|
| `rm` | Delete files/directories |
| `chmod` | Change file permissions |
| `chown` | Change file ownership |
| `kill` | Terminate processes |
| `killall` | Terminate multiple processes |
| `pkill` | Kill processes by name |
| `sudo` | Execute as superuser |
| `dd` | Low-level data operations |
| `mount` | Mount filesystems |
| `umount` | Unmount filesystems |
| `mkfs` | Create filesystems |
| `reboot` | Restart system |
| `shutdown` | Power off system |

**Examples**:

```
> Create files and directories as needed

Created ./src/utils.py
Created ./tests/test_utils.py
Created ./config/settings.json
```

Most operations run without prompts.

```
> Delete the build directory

APPROVAL REQUIRED (full mode)
Command: rm -rf ./build/

[1] Yes, approve this command
[2] Always approve this session
[3] No, reject
```

Dangerous commands still require approval.

## Workspace boundaries

In **default** mode, the "workspace" is your current working directory and its subdirectories. File operations are evaluated as:

- **Inside workspace**: `/path/to/workspace/src/file.txt` - auto-executes
- **Outside workspace**: `/etc/config` or `~/other-project/file.txt` - requires approval

The workspace is set to your current directory when you start the CLI:

```bash
# Workspace is /home/user/my-project
cd /home/user/my-project
seqera ai
```

## Best practices

- **Start with default mode**: It provides a good balance for most workflows
- **Use basic mode for unfamiliar projects**: When exploring new codebases
- **Reserve full mode for trusted contexts**: Disposable environments or well-understood tasks
- **Review dangerous command prompts carefully**: These commands can have significant impact

## Learn more

- [Seqera AI CLI](index.md): Seqera AI CLI overview
- [Installation](./installation): Detailed installation instructions
- [Authentication](./authentication): Log in, log out, and session management
- [Use cases](./use-cases.md): Seqera AI use cases
- [Troubleshooting](../troubleshooting_and_faqs/seqera-ai.md): Troubleshoot common errors
