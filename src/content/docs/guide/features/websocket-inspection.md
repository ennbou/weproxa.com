---
title: WebSocket Inspection
description: Inspect WebSocket traffic frame by frame in WePROXA.
---

WePROXA captures WebSocket upgrades and shows their frames in the request details panel. Use this when an app communicates over live messages instead of one request/response body.

## Capture Requirements

WebSocket inspection works for proxied WebSocket traffic that completes a successful upgrade:

- Plain WebSocket traffic appears as `ws://`.
- Secure WebSocket traffic appears as `wss://` after HTTPS interception is enabled for the host or app.
- WebSocket-over-HTTP/2 handshakes are captured when HTTPS interception is enabled and the client uses HTTP/2.

If a secure WebSocket still appears as a CONNECT tunnel, enable SSL interception for the host or client app first. See [SSL Interception](/guide/guides/ssl-interception/) for setup steps.

## Open the Frames Tab

1. Select a WebSocket request in the request list.
2. Open the response side of the details panel.
3. Click **Frames**.

For successful WebSocket upgrades, WePROXA opens the Frames tab automatically because the normal response body is only the `101 Switching Protocols` handshake.

## What Each Frame Shows

Each frame row includes:

- **Direction** - Sent frames go from client to server; received frames go from server to client.
- **Opcode** - Text, binary, continuation, close, ping, pong, or other extension opcodes.
- **Size** - The on-wire payload size.
- **Preview** - Decoded text, control payload text, or a hex preview for binary data.
- **Fragment state** - Non-final fragments are marked so fragmented messages are easy to spot.
- **Timestamp** - The time WePROXA observed the frame.

Click a frame to open a larger payload preview. Large frame payloads are forwarded in full, but the UI keeps a bounded preview so chatty sockets cannot grow memory without limit.

## Filtering Frames

Use the filter buttons above the frame list to switch between:

- **All** - Every captured frame.
- **Sent** - Client-to-server frames.
- **Received** - Server-to-client frames.

The search field matches decoded payload previews and opcode names, so searches like `ping`, `error`, or a message identifier work without leaving the details panel.

## Compression and Limits

WebSocket bytes are forwarded unchanged, including masking, fragmentation, and negotiated extensions. When the connection negotiates `permessage-deflate`, WePROXA inflates complete compressed messages for the frame preview so text and JSON payloads remain readable.

If a compressed message cannot be inflated, WePROXA falls back to showing that the frame was compressed instead of rendering unreadable bytes as text. Large decompressed messages are still bounded to a preview so the UI stays responsive.

WePROXA keeps the most recent frames for each request and trims older entries after the frame log reaches its retention limit. Tunnel byte totals are still recorded when the upgraded connection closes, even if the message log has been trimmed.

## Related Docs

- [Inspect Requests](/guide/features/inspect-requests/)
- [HTTPS Debugging](/guide/guides/https-debugging/)
- [SSL Interception](/guide/guides/ssl-interception/)