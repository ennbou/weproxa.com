---
title: Map Local
description: Replace remote resources with local files for rapid development.
---

Map Local lets you serve local files in place of remote resources — without changing your server or application code.

## How It Works

When a request matches a Map Local rule, WePROXA intercepts it and responds with the contents of a local file instead of forwarding the request to the remote server. The request never reaches the origin — the response is served entirely from disk.

If the local file is not found, the request falls through and is forwarded to the origin server as normal.

## Creating a Map Local Rule

1. Open the **Map Local** tool from the toolbar
2. Click **Add Rule**
3. Fill in the rule details:
   - **Name** — a descriptive label for the rule
   - **URL Pattern** — a glob pattern to match URLs (e.g., `https://api.example.com/v1/*`)
   - **Method** — optionally restrict to a specific HTTP method (GET, POST, PUT, etc.), or leave as "Any" to match all methods
4. Choose the local file to serve:
   - **Browse** to select an existing file
   - **Create File** to generate a new mock file (saved to `~/.weproxa/tools/mocks/`)
5. Enable the rule

    ![WePROXA Map Local window](@assets/guide/features/maplocal/maplocal_window.png)

:::tip
You can also create a Map Local rule by **right-clicking a request** in the request list and selecting **Map Local**. The URL pattern and response content will be pre-filled from the selected request.
![Map Local from requests list](@assets/guide/features/maplocal/maplocal_from_request.png)
:::

### Managing Rules

- **Toggle individual rules** on or off using the toggle switch next to each rule
- **Toggle all rules** at once using the global enable/disable button
- **Sort rules** by name, creation date, or last updated date
- **Edit** or **delete** rules at any time

:::note
Free accounts are limited to **5 Map Local rules**. Upgrade to Pro for unlimited rules.
:::

### Exporting & Importing Rules

:::note
Export & Import is a **Pro feature**. Free users will see a prompt to upgrade when clicking export or import.
:::

You can export and import Map Local rules to share configurations across devices or with your team.

- **Export** — click the download icon on any rule card to save it as a `.weproxa-map-local.json` file. The export includes the rule settings (name, URL pattern, method) and the full response file content.
- **Import** — click the **Import** button in the toolbar to load a previously exported rule file. WePROXA recreates the rule and its mock file automatically.

This is useful for:
- Sharing API mocks with teammates
- Backing up your rules before switching machines
- Distributing pre-configured mock setups for a project

## Pattern Matching

Map Local rules support flexible URL matching with glob patterns:

- **Exact URLs** — `https://api.example.com/data.json`
- **Glob patterns** — `https://api.example.com/v1/*`
- **Host-only** — `*api.example.com*` to match all requests to a specific domain

## Response File Format

The local file can be a **plain file** or a **full HTTP response** with custom status code and headers.

### Plain File

If the file contains just the response body, WePROXA serves it with a `200` status code and a default `Content-Type` of `application/octet-stream`:

```json
{ "message": "Hello from local file" }
```

### HTTP Response Format

To control the status code and headers, write the file in HTTP response format:

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-Custom-Header: my-value

{ "message": "Hello with custom headers" }
```

![HTTP response format](@assets/guide/features/maplocal/maplocal_editor_response_format.png)

The status line (`HTTP/1.1 NNN`) and headers are parsed automatically. Everything after the blank line is the response body.

This lets you simulate error responses, redirects, or custom headers without any server changes:

```http
HTTP/1.1 503 Service Unavailable
Content-Type: application/json
Retry-After: 30

{ "error": "Service temporarily unavailable" }
```

The editor supports **autocompletion for HTTP headers** — just start typing a header name and press **Ctrl+Space** to see suggestions based on common headers and the headers from the original response.

![Editor autocomplete for headers](@assets/guide/features/maplocal/maplocal_editor_autocomplete.png)

## Editing Response Files

The Map Local panel includes a built-in **Monaco editor** with syntax highlighting for editing your response files directly. The editor auto-detects the language (JSON, HTML, etc.) from the file content.

Press **Cmd+S** (macOS) or **Ctrl+S** (Windows/Linux) to save changes to the file.

## File Watching

WePROXA **automatically watches** your local files for changes. When you edit a mapped file in an external editor, the updated content is picked up immediately — no need to restart or reload rules.

## Use Cases

- **Frontend development** — serve local JS/CSS while using a production API
- **API mocking** — return local JSON files with custom status codes and headers
- **Testing** — simulate error responses (404, 500, 503) without changing server code
- **Offline development** — work without network access by serving cached responses
