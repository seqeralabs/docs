---
title: Seqera MCP
description: "Connect AI assistants to Seqera Platform using the Model Context Protocol"
date: "09 Dec 2024"
tags: [mcp, ai, integration]
---

Seqera MCP is a [Model Context Protocol](https://modelcontextprotocol.io/) server that enables AI assistants to interact with the Seqera ecosystem. It provides access to Seqera Platform, Wave containers, nf-core modules, and bioinformatics data resources.

## Features

- **Seqera Platform integration**: Launch, monitor, and manage Nextflow pipelines
- **Wave container service**: Create containerized environments with conda/pip packages
- **nf-core modules**: Search and execute 1000+ standardized bioinformatics modules
- **Data resources**: Access reference genomes, sequencing data, and scientific literature

## Remote server

The hosted Seqera MCP server is available at:

```console
https://mcp.seqera.io/mcp
```

## Authentication

Seqera MCP supports two authentication methods:

- **OAuth 2.1** (recommended): Interactive login through Seqera Platform. Your browser opens automatically to authenticate when connecting.
- **Personal Access Token**: Use your Seqera Platform [access token](https://docs.seqera.io/platform-cloud/credentials/overview) as a Bearer token. Useful for clients that don't support OAuth.

## Client setup

### Cursor

Create or edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "seqera": {
      "url": "https://mcp.seqera.io/mcp"
    }
  }
}
```

Restart Cursor to apply the configuration. On first use, your browser will open for authentication.

### VS Code

Create or edit `~/Library/Application Support/Code/User/mcp.json` (macOS) or `%APPDATA%\Code\User\mcp.json` (Windows):

```json
{
  "servers": {
    "seqera": {
      "url": "https://mcp.seqera.io/mcp",
      "type": "http"
    }
  }
}
```

### Windsurf

Create or edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "seqera": {
      "serverUrl": "https://mcp.seqera.io/mcp"
    }
  }
}
```

### Claude Code

```bash
claude mcp add seqera --url https://mcp.seqera.io/mcp
```

### Claude Desktop

1. Open Claude Desktop settings
2. Select **Add connectors**
3. Click **Add custom connector**
4. Enter the URL: `https://mcp.seqera.io/mcp`
5. Select **OAuth** as the authentication method

### OpenAI Codex

First, enable the MCP client feature in `~/.codex/config.toml`:

```toml
[features]
rmcp_client = true
```

Then add the Seqera MCP server and authenticate:

```bash
codex mcp add seqera --url https://mcp.seqera.io/mcp
codex mcp login seqera
```

### Using Personal Access Token

For clients that don't support OAuth, add your access token as a header:

```json
{
  "mcpServers": {
    "seqera": {
      "url": "https://mcp.seqera.io/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_ACCESS_TOKEN>"
      }
    }
  }
}
```

## Resources

- [Model Context Protocol specification](https://modelcontextprotocol.io/)
- [Seqera MCP repository](https://github.com/seqeralabs/seqera-mcp)
