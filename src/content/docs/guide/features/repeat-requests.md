---
title: Repeat Requests
description: Replay captured HTTP requests with optional modifications.
---

The Repeat feature lets you resend any captured request — exactly as-is or with modifications — making it easy to test APIs and debug edge cases.

Repeated requests use the same upstream connection handling as captured traffic. HTTPS repeats can negotiate HTTP/2 when the origin supports it, while requests carrying upgrade headers use HTTP/1.1 semantics so WebSocket-style handshakes remain compatible.

## Quick Repeat

To instantly replay a request without changes:

1. **Right-click** on any request in the request list
2. Select **Repeat Now**

![Repeat Now from requests list](@assets/guide/features/repeat-request/repeat_now_from_request.png)

The request is resent immediately with the original method, URL, headers, and body. The repeated request appears in the main request list alongside your other captured traffic.

## Repeat with Editing

To modify a request before resending:

1. **Right-click** on any request in the request list
2. Select **Repeat with Edit...**
3. A separate editor window opens with the original request pre-filled
4. Modify the request as needed
5. Click **Send** to execute

![Repeat with Edit from requests list](@assets/guide/features/repeat-request/repeat_with_edit_from_request.png)

### What You Can Modify

- **Method** — switch between GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- **URL** — change the target endpoint
- **Headers** — add, edit, or remove request headers
- **Body** — edit the request payload with syntax highlighting (language auto-detected from `Content-Type`)

![Repeat editor window](@assets/guide/features/repeat-request/repeat_editor_window.png)

When you edit a JSON body, WePROXA validates it inline: a **Valid JSON** indicator confirms well-formed content, and a malformed body shows an **Invalid JSON** message with the parser error and a **Line _n_, Col _n_** link that jumps to the error.

:::note
The `Host` and `Content-Length` headers are managed automatically — you don't need to set them manually.
:::

## Viewing Results

After each send, the repeat editor shows the response inline so you can inspect the result without leaving the window. The response summary includes the status, reason phrase, duration, body size, and new request ID.

Use the response tabs to inspect:

- **Headers** — response headers returned by the server
- **Body** — decoded response body with syntax highlighting when the content type is recognized
- **Raw** — status line, headers, and body in one copy-friendly view

Large response bodies are summarized instead of rendered eagerly to keep the repeat editor responsive. Repeated requests still appear in the **main request list**, so you can save, diff, or inspect them later from the normal Details Panel.

You can click **Send** multiple times from the same editor window to resend the request repeatedly, for example when testing different header values or body payloads.

## Use Cases

- **API testing** — quickly test different payloads against an endpoint
- **Debugging** — replay a failed request to reproduce an issue
- **Exploration** — modify parameters to understand API behavior
- **Authentication testing** — resend requests with different auth tokens
