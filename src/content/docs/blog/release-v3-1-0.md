---
title: WePROXA 3.1.0 Release Notes
date: 2026-07-01
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.1.0 adds isolated workspaces, live scripting diagnostics, expanded MCP controls, and safer Map Local workflows.
---

WePROXA **3.1.0** makes complex debugging setups easier to organize, automate, and troubleshoot while tightening several everyday workflows across platforms.

## New Features

- **Workspaces** - Organize tool rules into named scenarios and switch between isolated rule sets, with existing rules migrated into a Default workspace automatically.
- **Scripting console** - View live `print()` and `debug()` output alongside runtime warnings and errors, with controls to filter, pause, and clear captured logs.
- **Expanded MCP controls** - MCP clients can now create, update, list, remove, and enable Network Conditioning and Scripting rules.

## Fixes & Improvements

- **Independent Map Local duplicates** - Duplicated managed rules now receive their own response files, so editing or deleting one copy no longer affects the other.
- **Scripting workspace** - The script editor now fills the available panel height and keeps rule controls in a more compact header.
- **Windows Store reliability** - MSIX builds can once again write proxy settings and certificate files, with clearer guidance for trusting the HTTPS certificate.
- **Proxy auto-start** - Persisted proxy and LAN auto-start settings are now loaded before startup actions run, preventing cold-start races.

---

Thanks to everyone building repeatable debugging workflows and sharing the rough edges you find. Download WePROXA 3.1.0 and let us know what you think!
