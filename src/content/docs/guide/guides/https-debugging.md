---
title: HTTPS Debugging
description: How to debug HTTPS/SSL traffic with WePROXA.
---

WePROXA provides full HTTPS interception (MITM) so you can inspect encrypted traffic just like plain HTTP.

## How It Works

When HTTPS interception is enabled:

1. Your client connects to WePROXA's proxy
2. WePROXA establishes a secure connection with the real server
3. WePROXA dynamically generates a certificate for the target domain
4. Your client connects to WePROXA using that certificate
5. WePROXA decrypts, inspects, and re-encrypts all traffic

This is fully transparent — your app sees valid HTTPS responses as long as the WePROXA CA is trusted.

## HTTP/2 and WebSockets

Modern browsers and APIs often negotiate HTTP/2 over TLS. WePROXA advertises HTTP/2 and HTTP/1.1 to HTTPS clients, records the negotiated protocol in the request list, and uses HTTP/2 upstream connections when the origin supports them.

If the upstream server does not support HTTP/2, WePROXA falls back to HTTP/1.1 automatically. WebSocket-over-HTTP/2 handshakes are translated into the compatible upstream shape when needed, and successful WebSocket upgrades can be inspected in the [WebSocket Inspection](/guide/features/websocket-inspection/) Frames tab.

## Enabling HTTPS Interception

HTTPS interception works on a per-host basis. To start inspecting HTTPS traffic:

1. **Install the CA certificate** — see [Certificate Trust](/guide/guides/certificate-trust/) for setup instructions.
2. **Add SSL hosts** — add the hosts you want to inspect to the SSL Interception Hosts list. See [SSL Interception](/guide/guides/ssl-interception/) for the two ways to do this.

## Viewing HTTPS Traffic

HTTPS requests appear in the request list just like HTTP requests. You can:

- View full request and response headers
- Inspect decrypted request and response bodies
- See whether traffic used HTTP/1.1 or HTTP/2.0
- Inspect WebSocket frames for upgraded connections
- Set breakpoints on HTTPS requests
- Map HTTPS URLs to local files

## Troubleshooting

### Certificate errors in browser
Make sure the WePROXA CA certificate is trusted in your macOS Keychain. See [Certificate Trust](/guide/guides/certificate-trust/).

### Some apps ignore system proxy
Some applications use their own proxy settings or certificate stores. You may need to configure them manually to use the WePROXA proxy address.

### Certificate pinning
Apps with certificate pinning will reject WePROXA's generated certificates. This is a security feature of those apps and cannot be bypassed through WePROXA. If the pinned host is only being captured because of an app-wide SSL rule, add it to **TLS passthrough hosts** so the connection stays tunneled.
