---
title: MCP Integration
description: Use Weproxa's Model Context Protocol server for AI-powered debugging.
---

Weproxa includes an embedded [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that exposes proxy tools to external AI clients, enabling AI-assisted HTTP debugging.

:::note
Starting the MCP server is a **Pro** feature. Free accounts can view the configuration but cannot start the server.
:::

## What is MCP?

MCP is an open protocol that allows AI models to interact with tools and data sources. Weproxa's MCP server lets AI assistants access your captured HTTP traffic and proxy tools.

## Enabling the MCP Server

1. Open **Settings** in Weproxa
2. Navigate to the **MCP** section
3. Enable the MCP server
4. Note the **server URL** and **authentication token** displayed

## Connecting an AI Client

Configure your MCP-compatible AI client with:

- **Server URL** — the local HTTP endpoint (e.g., `http://127.0.0.1:<port>/mcp`)
- **Authentication** — Bearer token (shown in Weproxa settings)

## Available Tools

The MCP server exposes tools that let AI assistants:

- List captured requests
- Inspect request/response details
- Filter requests by various criteria
- Interact with proxy features

## Security

- The MCP server only listens on `127.0.0.1` (localhost)
- Bearer token authentication is required for all requests
- The server is disabled by default
