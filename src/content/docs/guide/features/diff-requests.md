---
title: Diff Requests
description: Compare two captured HTTP requests side by side to spot differences in headers, bodies, and responses.
---

Diff Requests lets you compare two captured requests side by side. It's the fastest way to pinpoint why a request succeeded in one environment but failed in another, or why a retry behaved differently from the original.

## How It Works

Each side of the diff holds one captured request. WePROXA pairs the two and renders a four-part diff:

- **Request headers** — added, removed, and changed headers
- **Request body** — payload differences (JSON is pretty-printed automatically)
- **Response headers** — differences in the server's response metadata
- **Response body** — differences in the response payload

The diff editor uses the same engine as Monaco, with side-by-side rendering, syntax highlighting, and the ability to collapse any section you don't care about.

## Selecting Requests to Compare

1. **Right-click** a request in the request list
2. Select **Add to Diff...**
3. Repeat for the second request
4. Open the **Diff** tool from the toolbar (or press `⌘ ⇧ D`)

The Diff panel can be used inline (as a detail view) or opened in its own window — useful for comparing on a second monitor while you keep capturing traffic.

Use the **swap** button to flip left and right, or the trash icon to clear either side.

## Content Handling

- **JSON** bodies are pretty-printed before diffing, so re-ordered or re-indented JSON does not show spurious changes.
- **Binary** bodies (images, fonts, WASM, etc.) are represented as `(binary data: N bytes)` so the diff remains readable.
- Decompressed response bodies are diffed — you compare the logical payload, not the gzip/brotli envelope.
- The language for syntax highlighting is inferred from `Content-Type` when available.

## Use Cases

- Reproduce a regression by diffing a known-good request against the failing one.
- Compare staging and production responses for the same endpoint.
- Audit what changed after you edited a request with [Breakpoints](/guide/features/breakpoints/) or re-sent it with [Repeat Requests](/guide/features/repeat-requests/).
- Verify that a [Map Local](/guide/features/map-local/) rule produced the exact response you expected.

## Tips

- Requests can come from any source — live capture, repeated requests, or even different apps — as long as they appear in the request list.
- Collapse sections you're not interested in to focus the diff on headers or bodies only.
- Combine Diff with the [Advanced Filtering](/guide/features/advanced-filtering/) query builder to quickly locate the two requests you want to compare among thousands of captured entries.
