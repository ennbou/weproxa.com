---
title: JSON Tools
description: Format, explore, query, and derive schemas from JSON documents in a dedicated workbench.
---

JSON Tools is a standalone workbench for understanding API payloads without leaving WePROXA. Paste a document, open a local file, or send a captured response directly from the request list, then switch between five views of the same JSON.

## Open JSON Tools

Open the workbench in any of these ways:

- Choose **Tools → JSON Tools** from the application menu.
- Press `⌘ ⇧ J` on macOS or `Ctrl + Shift + J` on Windows.
- Open **JSON Tools** from the tray menu.
- Add **JSON Tools** to the main toolbar from **Settings → Appearance → Toolbar Tools**.
- Right-click a captured request and choose **Tools → Inspect JSON**.
- Open a response body in the details panel and select the **Inspect JSON** button.

Opening a captured response replaces the current document in the workbench. The action is available regardless of the response content type, so it can also explain why a payload that should be JSON does not parse. Responses with no body are not opened.

## Load and Prepare a Document

Paste or edit JSON in the **Document** pane, or choose **Open file** to load a `.json`, `.jsonl`, or `.txt` file. The editor marks invalid JSON as you type.

Use **Beautify** to rewrite the document with the current indentation settings. **Clear** removes the input and its result. JSON Tools remembers the active view, query expressions, and formatting preferences between window opens; documents larger than 256 KiB are not retained in local storage.

## Choose a View

All five tabs work from the same input document:

- **Format** — pretty-print or minify the document and show counts for values, keys, objects, arrays, and nesting depth.
- **Tree** — browse a collapsible, virtualized tree and copy the normalized path to any value.
- **Schema** — infer a JSON Schema Draft 2020-12 description from the sample. Arrays merge the shapes of their elements, and fields missing from some object samples are not marked as required.
- **jq** — run a jq-style filter and inspect each emitted result separately.
- **JSONPath** — select values with JSONPath expressions and see the normalized source path beside every match.

The jq and JSONPath tabs include ready-made example expressions. Query errors point to the relevant character when a position is available, and JSON parse errors include their line and column.

## Format and Copy Results

The controls along the bottom apply consistently to formatted output, generated schemas, and query results:

- **Minify** removes insignificant whitespace.
- **Sort keys** writes object keys alphabetically.
- **Indent** selects two, four, or eight spaces, or tabs.

Use **Copy output** for formatted documents and schemas. Query views let you copy one result or every result; JSONPath results also retain the path that produced each value.

## Limits and Long-Running Queries

JSON Tools accepts documents up to **16 MiB** and **256 levels** of nesting. The tree view shows up to 100,000 values, while jq and JSONPath return up to 10,000 results per query. When a result is truncated, the workbench says so instead of presenting the partial output as complete.

jq filters run with a time limit. If a filter contains an endless generator or otherwise fails to finish, narrow or correct the expression before retrying. Earlier timed-out jq runs are isolated from proxy processing, but several still-running queries can temporarily make the jq view report that it is busy.

## Example Workflow

1. Capture the API request you want to investigate.
2. Right-click it and choose **Tools → Inspect JSON**.
3. Use **Tree** to locate the field and copy its path.
4. Switch to **jq** or **JSONPath** and narrow the payload to the values you need.
5. Copy the result, or use **Schema** to generate a starting point for validation or client types.

See [Inspect Requests](/guide/features/inspect-requests/) for the other actions available from captured traffic.
