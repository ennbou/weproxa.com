---
title: WePROXA 2.4.0 Release Notes
date: 2026-05-10
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 2.4.0 adds WebSocket frame inspection, HTTP/2 interception, TLS passthrough hosts, and major proxy stability improvements.
---

WePROXA **2.4.0** is here with deeper protocol visibility and a faster, steadier proxy core for modern web traffic.

## New Features

- **WebSocket frame inspection** - Inspect WebSocket traffic in a dedicated Frames tab with live sent/received filtering, payload search, opcodes, sizes, and timestamps.
- **HTTP/2 interception** - Capture and inspect HTTP/2 HTTPS traffic through ALPN-based MITM support, including WebSocket-over-HTTP/2 handshakes.
- **TLS passthrough hosts** - Keep selected domains tunneled during app-wide SSL interception from the Proxy Status settings, with bare-domain and wildcard support.

## Fixes & Improvements

- **Proxy performance** - HTTP/2 upstream pooling, connection prewarming, TLS session reuse, idle reaping, and fresh-connect caps reduce latency and smooth high-concurrency captures.
- **Large body safety** - Request and response buffering now has bounded memory limits, with streaming paths used where full bodies are not required.
- **Scripting rewrites** - Request scripts that change URL schemes now remap default ports correctly, and response scripting avoids unbounded buffering on streaming responses.
- **Protocol clarity** - WebSocket requests display as `ws://` or `wss://`, HTTP versions are preserved in the request list, and tunnel byte counts replace empty upgrade bodies.
- **Rule form workflow** - Breakpoints, Block List, Network Conditioning, and Scripting forms now share Cmd/Ctrl+S save, Escape cancel, and visible saved feedback.
- **Request stability** - Streamed request bodies, tool attribution, and request context menus now preserve state more reliably as responses and tool updates arrive.

---

Thanks to everyone who shared edge cases and performance traces. Download WePROXA 2.4.0 and let us know what you think!