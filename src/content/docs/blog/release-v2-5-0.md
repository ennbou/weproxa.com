---
title: WePROXA 2.5.0 Release Notes
date: 2026-05-13
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 2.5.0 adds cookie inspection, richer repeat responses, readable compressed WebSocket frames, and easier terminal proxy setup.
---

WePROXA **2.5.0** is here with sharper request inspection, better replay feedback, and smoother workflows for traffic from browsers, apps, and terminal tools.

## New Features

- **Cookies tab** - Inspect request cookies and response `Set-Cookie` values in dedicated details tabs.
- **Inline repeat responses** - View repeat status, duration, headers, body, and raw response directly inside the repeat editor.
- **HTTP/2 repeat support** - Replayed HTTPS requests can use negotiated HTTP/2 upstream connections while preserving WebSocket upgrade compatibility.
- **Readable compressed WebSockets** - `permessage-deflate` WebSocket messages are decompressed for frame previews when the extension is negotiated.
- **Terminal proxy setup** - Open a macOS Terminal session with WePROXA proxy variables configured, or copy the export commands from Proxy Config.

## Fixes & Improvements

- **Cookie-heavy traffic** - HTTP/2 split cookies are forwarded correctly to HTTP/1 origins, and larger HTTP/2 header sets are accepted for real browser sessions.
- **System proxy reset** - macOS proxy cleanup now disables proxy state before and after clearing stale host and port values.
- **Detached windows** - Reopening an existing tool, settings, SSL, repeat, or breakpoint window now focuses it without counting or replaying a fresh open.

---

Thanks to everyone who shared protocol traces and workflow feedback. Download WePROXA 2.5.0 and let us know what you think!