---
title: Repeat Requests
description: Replay captured HTTP requests with optional modifications.
---

The Repeat feature lets you resend any captured request — exactly as-is or with modifications — making it easy to test APIs and debug edge cases.

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

:::note
The `Host` and `Content-Length` headers are managed automatically — you don't need to set them manually.
:::

## Viewing Results

The repeat editor shows a brief success or error message after each send, along with the new request ID. To inspect the full response, find the repeated request in the **main request list** and open it in the **Details Panel** — repeated requests are logged just like any other captured traffic.

You can click **Send** multiple times from the same editor window to resend the request repeatedly, for example when testing different header values or body payloads.

## Use Cases

- **API testing** — quickly test different payloads against an endpoint
- **Debugging** — replay a failed request to reproduce an issue
- **Exploration** — modify parameters to understand API behavior
- **Authentication testing** — resend requests with different auth tokens
