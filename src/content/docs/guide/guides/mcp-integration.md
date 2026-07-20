---
title: MCP Integration
description: Use WePROXA's Model Context Protocol server for AI-powered debugging.
---

WePROXA includes an embedded [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that exposes proxy tools to external AI clients, enabling AI-assisted HTTP debugging.

:::note
Starting the MCP server is a **Pro** feature. Free accounts can view the configuration but cannot start the server.
:::

## What is MCP?

MCP is an open protocol that allows AI models to interact with tools and data sources. WePROXA's current MCP server exposes proxy lifecycle and debugging-configuration tools to compatible AI clients.

## Enabling the MCP Server

1. Open **Settings** in WePROXA
2. Navigate to **MCP Server**
3. Click **Start**
4. Copy the **Endpoint URL** and **Auth Token** displayed

![WePROXA MCP Server settings](@assets/generated/screenshots/settings/mcp-server.png)

## Connecting an AI Client

Configure your MCP-compatible AI client with:

- **Server URL** — the local HTTP endpoint (e.g., `http://127.0.0.1:<port>/mcp`)
- **Authentication** — Bearer token (shown in WePROXA settings)

## Available Tools

The MCP server exposes tools that let AI assistants:

- Start, stop, and inspect the proxy
- Add, update, remove, and list Map Local, Breakpoint, Block List, Network Conditioning, and Scripting rules
- Add, update, remove, and list SSL interception hosts
- Read and change the enabled state of rule-based tools

:::note
The current MCP tool surface does not expose captured requests, response bodies, headers, cookies, or saved-request contents. It manages proxy state and debugging configuration only.
:::

### Network Conditioning and Scripting

MCP clients can manage Network Conditioning rules with:

- `weproxa_networkConditioning_addRule`
- `weproxa_networkConditioning_updateRule`
- `weproxa_networkConditioning_removeRule`
- `weproxa_networkConditioning_listRules`

Request and response delays are limited to 300,000 milliseconds (five minutes) per rule.

MCP clients can manage Rhai Scripting rules with:

- `weproxa_scripting_addRule`
- `weproxa_scripting_updateRule`
- `weproxa_scripting_removeRule`
- `weproxa_scripting_listRules`

New or updated script source is validated before the rule is saved. Use `weproxa_tools_getEnabled` and `weproxa_tools_setEnabled` to inspect or change the tool-level enabled state for `networkConditioning`, `scripting`, and the other rule-based tools in the active workspace.

:::note
Rule-management tools operate on the Workspace currently active in WePROXA. Newly created rules are assigned atomically to its active Scenario. Switch the Workspace and Scenario in WePROXA before asking an MCP client to build a different acceptance-criteria setup.
:::

## Security

- The MCP server only listens on `127.0.0.1` (localhost)
- Bearer token authentication is required for all requests
- The server is disabled by default
