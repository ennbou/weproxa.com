---
title: WePROXA 3.10.0 Release Notes
date: 2026-10-09
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.10.0 adds persistent traffic sessions, HAR export, capture milestones, portable Workspaces, and detached rule editors.
---

WePROXA **3.10.0** makes it easier to keep useful captures, share debugging setups, and follow each stage of a test run.

## New Features

- **Traffic sessions** - save captured requests or record new traffic by app, host, or supported filters in named sessions that remain available after relaunch.
- **HAR export** - export sessions or currently shown live traffic as HAR files, with sensitive-data sanitization enabled by default.
- **Capture milestones** - add numbered, colored dividers to mark stages of a live capture and jump between them.
- **Portable Workspaces (Pro)** - export Scenarios, Shared Rules, Rule Library definitions, and Map Local fixtures together, then import them as an independent Workspace.
- **Detached rule editors** - open individual tool rules in their own windows with ⌘-click on macOS or Ctrl-click on Windows.
- **Certificate rejection diagnostics** - inspect connections that may have refused the WePROXA certificate in the traffic log, response pane, and MCP results.

## Fixes & Improvements

- **iOS Simulator certificate setup** - install the CA into every booted simulator at once, with feedback naming successful installs and individual failures.
- **Larger certificate QR code** - click the Remote Access QR code to enlarge it for easier scanning from a phone.
- **Simulator app identification** - distinguish Simulator copies of Apple services from their macOS counterparts with separate names and badges, plus more consistent app icons.
- **Standalone window feedback** - success and error messages now appear in detached Settings and SSL windows, including license activation feedback.
- **Cookie table readability** - long request-cookie names and values wrap within fixed column widths for easier inspection.

Thanks to everyone who shared feedback and helped make WePROXA better!
