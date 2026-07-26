---
title: WePROXA 3.5.0 Release Notes
date: 2026-07-26
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.5.0 adds acceptance-criteria Scenarios, reusable Shared Rules, portable handoffs, contextual filters, and a more polished workspace.
---

WePROXA **3.5.0** makes complex debugging setups easier to organize, share, and revisit, while refining the everyday request-filtering and window experience.

## New Features

- **Acceptance-criteria Scenarios** - Keep multiple named setups in a Workspace, document their criteria and expected outcomes, preview them safely, and activate all rule membership and tool states atomically.
- **Shared Rules and Rule Library** - Reuse Workspace-owned definitions across Scenarios, see where each rule is used, and create an independent copy only when one Scenario must diverge.
- **Portable Scenario handoff** - Import and export validated `.weproxa-scenario.json` bundles with scripts and binary-safe embedded Map Local payloads. Captured traffic is never included.
- **Request attribution** - Requests and saved snapshots retain the Scenario that was active at capture time, even after a later switch.
- **Contextual filter shortcuts** - Filter captured traffic by the same host, path, endpoint, method, or client directly from the request context menu.
- **Scenario switchers everywhere** - Switch from the sidebar, optional toolbar control, application menu, or tray while each Workspace remembers its active Scenario.

## Fixes & Improvements

- **Remembered window layouts** - Main, tool, Settings, SSL, Repeater, and Breakpoint windows now restore their saved size, position, and maximized state.
- **Refined app layout** - Floating panel surfaces, clearer resize gutters, a branded request empty state, and redesigned Settings navigation make the workspace easier to scan.
- **Stable workspace navigation** - Sidebar state now stays consistent when moving between Explorer, Workspace, Shared Rules, Rule Library, and Scenario views.
- **Cleaner toolbar controls** - More focused default tool visibility and clearer remote-capture controls reduce toolbar noise while keeping customization available.
- **More reliable Google push traffic** - Google MCS endpoints now bypass HTTPS interception so push messaging continues to work while the proxy is active.
- **Clearer certificate identity** - Newly generated CA certificates include their generation date, hostname, and serial in the Common Name for easier recognition.
- **Improved Windows chrome** - The custom menu now includes Workspace and Scenario switching, detached window headers integrate consistently, and startup flashing is reduced.

---

Thanks to everyone helping shape faster, more repeatable debugging workflows in WePROXA.
