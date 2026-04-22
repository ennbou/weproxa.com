---
title: WePROXA 2.1.0 Release Notes
date: 2026-04-20
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 2.1.0 brings faster HTTPS connections with Happy Eyeballs, auto-start options, a query string filter, and several UI refinements.
---

WePROXA **2.1.0** focuses on faster connections, better proxy ergonomics, and a more polished request list and details view.

## New Features

- **Happy Eyeballs (RFC 8305)** — proxy now races DNS-resolved addresses in parallel for faster, more reliable HTTPS connections.
- **Auto-start options** — optionally start the proxy and enable LAN access automatically on launch.
- **SSL enable banner** — Details panel surfaces a one-click prompt to enable HTTPS decryption for the current host.
- **Query string filter** — filter the request list by URL query parameters.
- **Split request/response sizes** — the request list now shows request and response sizes as separate columns.
- **Appearance settings** — font size controls are consolidated into a unified Appearance section.

## Fixes & Improvements

- Fixed an infinite re-render loop in the Details panel.
- Proxy now tries every DNS-resolved address before failing a connection.
- Gracefully handle stale or missing keys in persisted request list column order.

---

Thanks to everyone who reported issues and shared feedback. Download WePROXA 2.1.0 and let us know what you think!
