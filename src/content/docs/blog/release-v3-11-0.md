---
title: WePROXA 3.11.0 Release Notes
date: 2026-10-26
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.11.0 adds a Linux preview, a global shortcut for milestones, MCP tools for traffic sessions and saved filters, and rule and filter match counts.
---

WePROXA **3.11.0** runs on Linux for the first time. You can also add a milestone without leaving the app you are testing, and AI agents can now work with your traffic sessions and saved filters.

## New Features

- **Linux preview** - install WePROXA from `.deb` or `.rpm` packages on x86_64 and ARM64, with system proxy setup for GNOME and KDE Plasma and in-app updates.
- **Linux certificate setup** - Install & Trust adds the WePROXA certificate to the system trust store and, when `certutil` is installed, to Chrome, Chromium, and Firefox, and Settings shows the trust status of each browser.
- **App names on Linux** - captured requests show the app that sent them, with the icon from its desktop entry.
- **Global milestone shortcut** - press ⌥⇧⌘M on macOS or Ctrl+Alt+Shift+M on Windows to add a milestone from any app, and change the combination in Settings.
- **Add Milestone in the tray** - the tray menu adds a milestone too, and a notification confirms it while WePROXA is in the background.
- **Traffic sessions over MCP** - AI agents can create, record, browse, and export traffic sessions as HAR files with the new `weproxa_trafficSessions_*` tools.
- **Saved filters over MCP** - agents can list, create, update, and remove request-list filters, and each change appears in the app right away.
- **Rule and filter counts** - the toolbar shows how many of each tool's rules are enabled, and saved filters show how many captured requests they match.
- **Submit from the keyboard** - press ⌘ Enter on macOS or Ctrl+Enter elsewhere to send a Repeat request or continue a paused breakpoint.

## Fixes & Improvements

- **Lower memory use** - only the main window receives live traffic now, and the code editor loads from inside the app on first use instead of downloading from the internet.
- **Diff snapshots** - each request in the Diff pool is a snapshot, so clearing the request list keeps your comparison. The pool holds up to 50 requests and empties when you quit WePROXA.
- **Contained scrolling** - scrolling a pane to its edge no longer scrolls the pane behind it.
- **Filter numbers and dates** - advanced filters that mix number or date conditions with a body or header search now match the same requests the request list shows.
- **Rule card layout** - long rule names and their badges wrap cleanly on rule cards in every tool.

Thanks to everyone who shared feedback and helped make WePROXA better!
