---
title: WePROXA 3.8.0 Release Notes
date: 2026-08-30
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.8.0 adds private token-free MCP connections, client-aware blocking, safer Map Local fixture editing, and stronger proxy reliability.
---

WePROXA **3.8.0** makes local debugging workflows safer and more precise, whether you are driving them from the app or from a connected AI client.

## New Features

- **Private MCP connections** - AI clients now launch the bundled WePROXA helper over an OS-protected local transport, with no port or bearer token to configure.
- **More efficient MCP calls** - Connected clients can request compact listings, choose the response shape per call, fetch output schemas only when needed, and identify the WePROXA server version.
- **Scoped run analysis** - Capture-session and traffic summaries accept advanced filters and distinguish origin responses from WePROXA's own internal traffic.
- **Client-aware blocking** - Block List rules can target a specific local app or remote device, with persistent autocomplete from observed clients and coverage for undecrypted CONNECT tunnels.
- **Realistic connection failures** - Blocked traffic can return the default 403, close immediately, or pause before dropping so retry, timeout, and offline paths are easier to test.
- **Safe local fixture editing** - Map Local can read, preview, and atomically save local fixture files while surfacing actionable errors and bounded editor limits.

## Fixes & Improvements

- **Reliable containment access** - Pass-Through deny modes continue to allow WePROXA's active MCP and certificate services without opening access to unrelated local servers.
- **Bounded tunnel load** - Concurrent tunnels respect available process capacity, stalled DNS and TCP connections time out with a 504, and overload warnings are rate-limited.
- **Accurate origin certificate failures** - HTTPS interception preserves the origin certificate problem seen by the client and only reuses an explicitly accepted certificate.
- **Clearer MCP availability** - Connection setup reflects the helper transport that actually started and avoids offering configurations that cannot connect.
- **Stable macOS window controls** - Native traffic-light buttons keep their measured alignment while windows resize.
- **Cross-platform discovery** - Settings links Windows users to the macOS install guide and other platforms to the Microsoft Store listing.

Thanks to everyone helping make WePROXA a more dependable companion for local debugging and automated testing.
