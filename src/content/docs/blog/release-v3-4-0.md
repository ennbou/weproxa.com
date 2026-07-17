---
title: WePROXA 3.4.0 Release Notes
date: 2026-07-17
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.4.0 adds remote Map Local sources, weproxa:// deep links, live URL pattern validation, per-rule activation, and compressed request-body editing in the Repeater.
---

WePROXA **3.4.0** makes your rules faster to build and trust: Map Local can now pull from remote URLs, patterns are validated as you type, and you can flip individual rules on and off. It also introduces `weproxa://` deep links, compressed request-body editing in the Repeater, and a one-click factory reset.

## New Features

- **Map Local remote sources** - Point a Map Local rule at a remote HTTP/HTTPS URL and WePROXA fetches the asset on demand with a bounded in-memory cache, no need to save a local copy.
- **Deep links** - A new `weproxa://` URL scheme lets links activate a license key or jump straight to a Settings section from your browser or email.
- **Live URL pattern validation** - Rule panels now check your URL glob as you type and tell you immediately whether the pattern is valid.
- **Per-rule activation** - Activate or deactivate individual advanced-filter rules without deleting them, with a live active-rule count.
- **Edit compressed request bodies** - The Repeater now decodes gzip, deflate, brotli, and zstd request bodies for editing and re-encodes them on send.
- **Factory reset** - A new Settings action restores WePROXA to its defaults - clearing settings, preferences, and workspace rules while keeping your license, certificate, and saved requests - then restarts the app.

## Fixes & Improvements

- **Persistent source-tree groups** - The sources sidebar now remembers which groups you expanded or collapsed across sessions.
- **Repeat requests in source tools** - Replayed requests now appear in the source tools tree, and diff URLs display more clearly.
- **Advanced filters persist** - Advanced query filter rules are now saved and restored between sessions.

---

Thanks to everyone shaping WePROXA's rule and Repeater workflows. Download WePROXA 3.4.0 and let us know what you think!
