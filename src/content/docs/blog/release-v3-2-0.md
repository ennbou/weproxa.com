---
title: WePROXA 3.2.0 Release Notes
date: 2026-07-10
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.2.0 deepens workspace rule management, adds request-inspection and JSON validation tools, expands remote setup guidance, and surfaces richer license details.
---

WePROXA **3.2.0** focuses on making larger debugging setups easier to organize and inspect, with clearer cross-platform setup guidance and several quality-of-life fixes across the app.

## New Features

- **Workspace rule management** - Create, rename, delete, switch, and edit workspace-specific tool rules without activating every workspace first.
- **Cross-workspace rule copying** - Copy rules between workspaces as independent clones, including fresh managed files for Map Local rules.
- **Inline JSON validation** - Editable JSON bodies now show friendly validation errors with line and column navigation.
- **Query parameters tab** - Inspect decoded query parameters in a dedicated request details view.
- **Multi-platform remote setup** - Remote access guidance now covers iOS, Android, macOS, Windows, and Linux setup paths.
- **License details** - Active licenses now show subscription, expiration, customer email, activation usage, and validation timing.

## Fixes & Improvements

- **TLS compatibility** - Upstream certificate verification now delegates to macOS platform trust, matching system behavior and recovering more incomplete chains.
- **Editor completions** - HTTP status line autocomplete no longer duplicates the version, status code, or reason phrase.
- **Request inspector polish** - Method and status values are easier to scan with compact badges in the details panel.
- **Network permission polish** - WePROXA avoids unnecessary local network prompts when LAN access is not enabled.
- **Windows Store LAN capture** - MSIX builds now emit package-level firewall rules so remote-device capture works on the Store package.

---

Thanks to everyone pushing WePROXA into bigger, more repeatable debugging workflows. Download WePROXA 3.2.0 and let us know what you think!
