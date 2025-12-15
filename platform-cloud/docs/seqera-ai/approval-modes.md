---
title: "Approval modes"
description: "Control which local commands require user approval in Seqera AI"
date: "15 Dec 2025"
tags: [seqera-ai, cli, approval, security]
---

:::caution
Seqera AI is currently in beta. Features and commands may change as we continue to improve the product.
:::

Approval modes control which local commands Seqera AI can execute automatically and which require your explicit approval. This provides a balance between convenience and safety when working with local files and commands.

## Understanding approval modes

When you ask Seqera AI to perform actions on your local machine (edit files, run commands), the approval mode determines whether the action runs immediately or prompts you for confirmation first.

There are three approval modes:

| Mode | Description | Best for |
|------|-------------|----------|
| **basic** | Only safe, read-only commands run automatically | Maximum security |
| **default** | Safe commands and workspace file edits run automatically | Typical development |
| **full** | Everything except dangerous commands runs automatically | Experienced users |

## Setting the approval mode

### At startup

Set the approval mode when starting the assistant:

```bash
# Use basic mode (most restrictive)
seqera ai -a basic

# Use default mode (balanced)
seqera ai -a default

# Use full mode (most permissive)
seqera ai -a full
```

### During a session

Change the approval mode at any time using the `/approval` command:

```
> /approval basic
Approval mode set to: basic

> /approval
Current approval mode: basic
```

## Mode details

### Basic mode

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

### Default mode

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

### Full mode

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

## Approval prompts

When a command requires approval, you'll see a prompt like:

```
The assistant wants to run:
  rm -rf ./build/

[A]pprove  [R]eject  [E]dit
```

- **Approve (A)**: Run the command as shown
- **Reject (R)**: Cancel the command
- **Edit (E)**: Modify the command before running

## Workspace boundaries

In **default** mode, the "workspace" is your current working directory and its subdirectories. File operations are evaluated as:

- **Inside workspace**: `/path/to/workspace/src/file.txt` - auto-executes
- **Outside workspace**: `/etc/config` or `~/other-project/file.txt` - requires approval

The workspace is set when you start the assistant:

```bash
# Workspace is /home/user/my-project
cd /home/user/my-project
seqera ai

# Or explicitly set the workspace
seqera ai -w /home/user/my-project
```

## Examples

### Basic mode example

```
> Create a new file called test.txt with "hello world"

The assistant wants to create file:
  ./test.txt

[A]pprove  [R]eject  [E]dit
```

Every file creation requires approval.

### Default mode example

```
> Create a new file called test.txt with "hello world"

Created ./test.txt
```

File creation in the workspace runs automatically.

```
> Edit /etc/hosts

The assistant wants to edit file:
  /etc/hosts

[A]pprove  [R]eject  [E]dit
```

Editing outside the workspace requires approval.

### Full mode example

```
> Create files and directories as needed

Created ./src/utils.py
Created ./tests/test_utils.py
Created ./config/settings.json
```

Most operations run without prompts.

```
> Delete the build directory

The assistant wants to run:
  rm -rf ./build/

[A]pprove  [R]eject  [E]dit
```

Dangerous commands still require approval.

## Best practices

1. **Start with default mode**: It provides a good balance for most workflows
2. **Use basic mode for unfamiliar projects**: When exploring new codebases
3. **Reserve full mode for trusted contexts**: Disposable environments or well-understood tasks
4. **Review dangerous command prompts carefully**: These commands can have significant impact

## Next steps

- [Getting started](./getting-started) - Learn the basics
- [Installation](./installation) - Detailed installation instructions
- [Authentication](./authentication) - Login and session management
