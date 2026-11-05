---
title: WePROXA 3.12.0 Release Notes
date: 2026-11-05
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.12.0 brings headless proxy runs to CI, collapsible detail panes, and a more responsive capture view.
---

WePROXA **3.12.0** brings proxy debugging and repeatable scenarios to CI, along with improvements to the desktop capture experience.

## New Features

- **Headless CLI** - run the proxy without a window in CI jobs and scripts, with Scenario or Workspace bundles and optional MCP access.
- **CI reports and checks** - export captured traffic to HAR, inspect rule and traffic reports, and fail a run when configured checks detect problems.
- **CI proxy and certificates** - configure client proxy and trust variables with `weproxa-cli env` and create a reusable CA with `weproxa-cli ca create`.
- **CLI updates** - use `weproxa-cli update` to check for and install verified updates within the same major version.
- **Collapsible detail panes** - hide or restore the request and response panes independently to focus on the traffic you need.
- **Capture markers** - the numbered dividers formerly called milestones are now called markers throughout the app.
- **Single instance on Windows and Linux** - opening WePROXA again or following a WePROXA link brings the running app forward.

## Fixes & Improvements

- **Responsive filtering** - keep using the request list while filters and body searches run, with clearer progress and error messages.
- **SSL rules** - avoid duplicate rules for the same host or app and re-enable an existing rule when adding it again.
- **HTTPS certificates** - improve certificate validity handling and support for IP address targets.
- **Proxy connections** - start connecting sooner when one DNS address family responds before the other and close active connections more cleanly on shutdown.
- **Windows scrolling** - restore mouse-wheel scrolling over clipped elements.
- **MCP compatibility** - improve tool schema compatibility across AI clients.
- **License activation** - show clearer messages for common activation and connection problems.

---

Thanks to everyone who reported issues and shared feedback!
