---
title: WePROXA 3.6.0 Release Notes
date: 2026-07-29
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.6.0 adds saved Advanced Filters, guided AI client connections, privacy-safe MCP traffic tools, a fully localized native macOS chrome, and new navigation shortcuts.
---

WePROXA **3.6.0** makes your filters reusable, connects AI clients to captured traffic without leaking secrets, and finishes the native macOS experience with localized menus and theme-aware window chrome.

## New Features

- **Saved Advanced Filters** - Save the current query-builder rules as a named filter, then reapply, clone, rename, or update it from the new Filters folder in Explorer (Pro).
- **Guided AI connections** - Generate a ready-to-paste MCP configuration for VS Code, Cursor, Codex, Claude Code, or JetBrains at user or workspace scope, then confirm the live connection status from Settings (Pro).
- **Captured traffic for AI clients** - Connected MCP clients can list, filter, and page through captured requests and read bounded request and response bodies.
- **Sensitive data redaction** - Passwords, authentication tokens, cookies, and payment card numbers are redacted from MCP tool output by default, controlled by a persistent Hide sensitive data setting.
- **Workspace and Scenario MCP tools** - Create, rename, duplicate, activate, and delete Workspaces and Scenarios from an AI client, including a preview of what an activation would change.
- **Localized native chrome** - The macOS menu bar, system tray, and window titles now follow the language selected in Settings and are already correct on the first frame after launch.
- **Theme-aware window chrome** - The macOS vibrancy backdrop and traffic lights follow the app theme instead of the system appearance, across the main window and every detached tool, Settings, and editor window.
- **New keyboard shortcuts** - Toggle the Advanced Filter and jump straight to Explorer, Workspaces, Certificates, Network Conditioning, and Scripting.

## Fixes & Improvements

- **New default ports** - Fresh installs now listen on 4545 and serve certificates on 7676, avoiding the crowded 8080 and 8888 defaults; a port you already configured is preserved.
- **Reliable Map Local toggles** - Disabled rules stay compiled, so re-enabling a rule takes effect immediately instead of needing a restart.
- **Stable Map Local precedence** - Overlapping rules keep a consistent oldest-rule-wins order after edits, so results no longer change based on the order you saved them.
- **Deep links at launch** - A `weproxa://` link that starts WePROXA is now handled, not just links opened while the app is already running.
- **Aligned window controls** - The macOS traffic lights stay centered in the title bar as you change the UI font size.
- **Cleaner request details** - The Scenario badge no longer crowds the request details header.

---

Thanks to everyone helping shape faster, safer, and more repeatable debugging workflows in WePROXA.
