---
title: "WePROXA 2.2.0 Release Notes"
date: 2026-04-26
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: "WePROXA 2.2.0 adds saved request snapshots, response downloads, PAC setup, app-based SSL targeting, and major performance wins across the proxy and UI."
---

WePROXA **2.2.0** adds new ways to capture traffic, easier remote setup, and a noticeably faster inspection experience across both the proxy and the UI.

## New Features

- **Saved Requests** — save HTTPS requests as persistent snapshots and reopen them later from the dedicated sidebar section.
- **Response Downloads** — download response bodies directly from the Details panel into your Downloads folder.
- **App-Based SSL Targeting** — enable SSL interception for specific apps and browse matching traffic in the new **SSL Enabled Apps** tree.
- **PAC Setup** — generate a Proxy Auto-Config (PAC) URL for simpler Wi-Fi proxy configuration on other devices.

## Fixes & Improvements

- **Faster Large Payloads** — large response bodies now load lazily with lower IPC overhead, making heavy payloads much smoother to inspect.
- **Faster Proxy Pipeline** — keep-alive pooling and hot-path proxy optimizations reduce overhead during repeated upstream requests.
- **Snappier Backend Work** — rule matching, certificate caching, source list updates, reverse DNS, and request eviction are all more efficient.
- **More Reliable Streaming** — streamed response sizes are tracked correctly and response streaming now stays intact under network delays.
- **Better Settings Navigation** — the macOS About menu now opens the right settings section and section-aware navigation is more consistent.

Thanks to everyone who reported issues and shared feedback. Download WePROXA 2.2.0 and let us know what you think!