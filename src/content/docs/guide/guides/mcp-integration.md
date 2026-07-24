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

## Scope of the tool surface

:::note
The current MCP tool surface does not expose captured requests, response bodies, headers, cookies, or saved-request contents. It manages proxy state and debugging configuration only.
:::

:::note
Rule-management tools operate on the Workspace currently active in WePROXA. Newly created rules are assigned atomically to its active Scenario. Switch the Workspace and Scenario in WePROXA before asking an MCP client to build a different acceptance-criteria setup.
:::

## Conventions

- **Names** are prefixed with `weproxa_` and grouped by feature (e.g., `weproxa_mapLocal_addRule`).
- **Parameters** and response fields use `camelCase`.
- **`urlPattern`** supports glob syntax (e.g., `**/api/*.json`). Invalid globs are rejected with an error.
- **`method`** is an optional HTTP method filter (`"GET"`, `"POST"`, …). When omitted, a rule matches all methods.
- Every response includes a boolean `success`. Tools that can fail validation also return an `error` string (omitted on success).
- Add tools return the new rule's `id` (a UUID), which you pass to the matching update/remove tools.

## Available Tools

### Proxy lifecycle

#### `weproxa_proxy_start`

Start the WePROXA HTTP/HTTPS proxy server.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `port` | number | No | Port to listen on. Defaults to `8080`. |
| `configureSystemProxy` | boolean | No | Set the macOS system proxy to WePROXA. Defaults to `true`. |

Example response:

```json
{ "success": true, "port": 8080 }
```

#### `weproxa_proxy_stop`

Stop the proxy server. Takes no parameters.

Example response:

```json
{ "success": true }
```

#### `weproxa_proxy_status`

Get the current proxy status. Takes no parameters.

Example response:

```json
{ "isRunning": true, "port": 8080, "allowLan": false }
```

---

### Map Local

Serve a local file or a remote HTTP(S) asset in place of a matching response.

#### `weproxa_mapLocal_addRule`

Add a Map Local rule.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | **Yes** | Human-readable rule name. |
| `urlPattern` | string | **Yes** | Glob pattern to match (e.g., `**/api/config.json`). |
| `sourceType` | `"localFile"` \| `"remoteUrl"` | No | Replacement source. Defaults to `localFile`. |
| `localPath` | string | No | Absolute path to the local file (used when `sourceType` is `localFile`). |
| `remoteUrl` | string | No | HTTP(S) asset URL to fetch (used when `sourceType` is `remoteUrl`). |
| `enabled` | boolean | No | Defaults to `true`. |
| `method` | string | No | HTTP method filter. |

Example response:

```json
{ "id": "8f3c2b1a-9d4e-4c7a-8b21-6f0a2c9e1d55", "success": true }
```

#### `weproxa_mapLocal_updateRule`

Update an existing Map Local rule. Required: `id`, `name`, `urlPattern`, `enabled`. The optional `sourceType`, `localPath`, `remoteUrl`, and `method` fields behave as in `addRule`. Fails if the `id` is not found.

Example response:

```json
{ "success": true }
```

#### `weproxa_mapLocal_removeRule`

Remove a Map Local rule. Required: `id`.

Example response:

```json
{ "success": true }
```

#### `weproxa_mapLocal_listRules`

List all Map Local rules. Takes no parameters.

Example response:

```json
{
  "rules": [
    {
      "id": "8f3c2b1a-9d4e-4c7a-8b21-6f0a2c9e1d55",
      "name": "Mock config",
      "urlPattern": "**/api/config.json",
      "sourceType": "localFile",
      "localPath": "/Users/me/mocks/config.json",
      "remoteUrl": null,
      "enabled": true,
      "method": null
    }
  ]
}
```

---

### Breakpoints

Pause matching requests and/or responses for inspection and editing.

#### `weproxa_breakpoints_addRule`

Add a Breakpoint rule.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | **Yes** | Human-readable rule name. |
| `urlPattern` | string | **Yes** | Glob pattern to match. |
| `breakRequest` | boolean | No | Pause on the request phase. Defaults to `true`. |
| `breakResponse` | boolean | No | Pause on the response phase. Defaults to `false`. |
| `enabled` | boolean | No | Defaults to `true`. |
| `method` | string | No | HTTP method filter. |

Example response:

```json
{ "id": "a1b2c3d4-e5f6-4711-9a8b-0c1d2e3f4a5b", "success": true }
```

#### `weproxa_breakpoints_updateRule`

Update an existing Breakpoint rule. Required: `id`, `name`, `urlPattern`, `breakRequest`, `breakResponse`, `enabled`. Optional: `method`. Returns an `error` if the `id` is not found.

Example response:

```json
{ "success": true }
```

#### `weproxa_breakpoints_removeRule`

Remove a Breakpoint rule. Required: `id`.

Example response:

```json
{ "success": true }
```

#### `weproxa_breakpoints_listRules`

List all Breakpoint rules. Takes no parameters.

Example response:

```json
{
  "rules": [
    {
      "id": "a1b2c3d4-e5f6-4711-9a8b-0c1d2e3f4a5b",
      "name": "Inspect login",
      "urlPattern": "**/auth/login",
      "breakRequest": true,
      "breakResponse": false,
      "enabled": true,
      "method": "POST"
    }
  ]
}
```

---

### Block List

Block matching requests before they reach the upstream server.

#### `weproxa_blockList_addRule`

Add a Block rule.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | **Yes** | Human-readable rule name. |
| `urlPattern` | string | **Yes** | Glob pattern to match. |
| `enabled` | boolean | No | Defaults to `true`. |
| `method` | string | No | HTTP method filter. |

Example response:

```json
{ "id": "c9e8d7f6-1234-4abc-9def-56789abcdef0", "success": true }
```

#### `weproxa_blockList_updateRule`

Update an existing Block rule. Required: `id`, `name`, `urlPattern`, `enabled`. Optional: `method`. Returns an `error` if the `id` is not found.

Example response:

```json
{ "success": true }
```

#### `weproxa_blockList_removeRule`

Remove a Block rule. Required: `id`.

Example response:

```json
{ "success": true }
```

#### `weproxa_blockList_listRules`

List all Block rules. Takes no parameters.

Example response:

```json
{
  "rules": [
    {
      "id": "c9e8d7f6-1234-4abc-9def-56789abcdef0",
      "name": "Block analytics",
      "urlPattern": "**/*.doubleclick.net/**",
      "enabled": true,
      "method": null
    }
  ]
}
```

---

### Network Conditioning

Inject artificial delays into matching requests and/or responses to emulate slow networks. Request and response delays are limited to **300,000 milliseconds (five minutes)** per rule.

#### `weproxa_networkConditioning_addRule`

Add a Network Conditioning rule.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | **Yes** | Human-readable rule name. |
| `urlPattern` | string | **Yes** | Glob pattern to match. |
| `requestDelayMs` | number | No | Delay added to requests, in ms. Defaults to `0`. |
| `responseDelayMs` | number | No | Delay added to responses, in ms. Defaults to `0`. |
| `enabled` | boolean | No | Defaults to `true`. |
| `method` | string | No | HTTP method filter. |

Example response:

```json
{ "id": "d4c3b2a1-7788-4991-a2b3-c4d5e6f70819", "success": true }
```

An invalid glob or an out-of-range delay returns:

```json
{ "id": "", "success": false, "error": "Throttle delay must not exceed 300000 ms (5 minutes)." }
```

#### `weproxa_networkConditioning_updateRule`

Update an existing rule. Required: `id`, `name`, `urlPattern`, `enabled`. Optional: `requestDelayMs`, `responseDelayMs`, `method`. Returns an `error` if the `id` is not found or validation fails.

Example response:

```json
{ "success": true }
```

#### `weproxa_networkConditioning_removeRule`

Remove a Network Conditioning rule. Required: `id`.

Example response:

```json
{ "success": true }
```

#### `weproxa_networkConditioning_listRules`

List all Network Conditioning rules. Takes no parameters.

Example response:

```json
{
  "rules": [
    {
      "id": "d4c3b2a1-7788-4991-a2b3-c4d5e6f70819",
      "name": "Slow uploads",
      "urlPattern": "**/upload",
      "enabled": true,
      "method": "POST",
      "requestDelayMs": 2000,
      "responseDelayMs": 500
    }
  ]
}
```

---

### Scripting

Run a [Rhai](https://rhai.rs/) script against matching requests and/or responses. A script may define `on_request(req)` and/or `on_response(res)` functions that mutate the passed map in place. The source is validated (and compiled) before the rule is saved; invalid Rhai returns an error.

#### `weproxa_scripting_addRule`

Add a Scripting rule.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | **Yes** | Human-readable rule name. |
| `urlPattern` | string | **Yes** | Glob pattern to match. |
| `script` | string | **Yes** | Rhai source. May define `on_request` and/or `on_response`. |
| `runOnRequest` | boolean | No | Run on the request phase. Defaults to `true`. |
| `runOnResponse` | boolean | No | Run on the response phase. Defaults to `false`. |
| `enabled` | boolean | No | Defaults to `true`. |
| `method` | string | No | HTTP method filter. |

Example response:

```json
{ "id": "e5f6a7b8-2233-4c5d-8899-aabbccddeeff", "success": true }
```

An invalid glob or Rhai source returns:

```json
{ "id": "", "success": false, "error": "Script compilation failed: ..." }
```

#### `weproxa_scripting_updateRule`

Update an existing Script rule. Required: `id`, `name`, `urlPattern`, `script`, `enabled`. Optional: `runOnRequest`, `runOnResponse`, `method`. Returns an `error` if the `id` is not found or validation fails.

Example response:

```json
{ "success": true }
```

#### `weproxa_scripting_removeRule`

Remove a Script rule. Required: `id`.

Example response:

```json
{ "success": true }
```

#### `weproxa_scripting_listRules`

List all Script rules. Takes no parameters.

Example response:

```json
{
  "rules": [
    {
      "id": "e5f6a7b8-2233-4c5d-8899-aabbccddeeff",
      "name": "Add auth header",
      "urlPattern": "**/api/**",
      "script": "fn on_request(req) { req.headers[\"x-debug\"] = \"1\"; }",
      "enabled": true,
      "runOnRequest": true,
      "runOnResponse": false,
      "method": null
    }
  ]
}
```

---

### SSL Hosts

Manage which hosts are decrypted via HTTPS interception. Interception also requires the WePROXA CA certificate to be trusted on the client.

#### `weproxa_ssl_addHost`

Add an SSL host.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `host` | string | **Yes** | Host pattern (e.g., `example.com` or `*.example.com`). |
| `enabled` | boolean | No | Defaults to `true`. |

Example response:

```json
{ "id": "f7a8b9c0-3344-4d5e-9900-112233445566", "success": true }
```

#### `weproxa_ssl_updateHost`

Update an existing SSL host. Required: `id`, `host`, `enabled`. Fails if the `id` is not found.

Example response:

```json
{ "success": true }
```

#### `weproxa_ssl_removeHost`

Remove an SSL host. Required: `id`.

Example response:

```json
{ "success": true }
```

#### `weproxa_ssl_listHosts`

List all SSL hosts. Takes no parameters.

Example response:

```json
{
  "hosts": [
    {
      "id": "f7a8b9c0-3344-4d5e-9900-112233445566",
      "host": "*.example.com",
      "enabled": true
    }
  ]
}
```

---

### Tool enable/disable

Inspect or toggle the enabled state of the rule-based tools in the active workspace.

#### `weproxa_tools_getEnabled`

Get the enabled state of all debugging tools. Takes no parameters.

Example response:

```json
{
  "mapLocalEnabled": true,
  "breakpointsEnabled": false,
  "blockListEnabled": true,
  "networkConditioningEnabled": false,
  "scriptingEnabled": true
}
```

#### `weproxa_tools_setEnabled`

Enable or disable a specific tool.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `tool` | string | **Yes** | One of `mapLocal`, `breakpoints`, `blockList`, `networkConditioning`, `scripting`. |
| `enabled` | boolean | **Yes** | Whether the tool should be enabled. |

Example response:

```json
{ "success": true }
```

An unknown tool name returns:

```json
{ "success": false, "error": "Invalid tool name 'foo'. Use 'mapLocal', 'breakpoints', 'blockList', 'networkConditioning', or 'scripting'." }
```

## Security

- The MCP server only listens on `127.0.0.1` (localhost)
- Bearer token authentication is required for all requests
- The server is disabled by default
