---
title: WePROXA 2.3.0 Release Notes
date: 2026-05-04
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 2.3.0 adds scripting, a standalone SSL manager, toolbar customization, richer Diff and Map Local workflows, and steadier proxy controls.
---

WePROXA **2.3.0** brings a new scripting workflow, more control over everyday tool surfaces, and a round of reliability improvements for proxy capture, SSL setup, and remote debugging.

## New Features

- **Scripting** - create Rhai rules that modify matching requests and responses before they continue through the proxy.
- **SSL Manager Window** - manage host and app SSL interception rules in a dedicated window with search, filters, and certificate access.
- **Custom Toolbar** - choose which tool buttons appear in the toolbar and let the layout compact itself in narrower windows.
- **Diff Request Pool** - collect requests for comparison, then click or drag them into the left and right diff slots.
- **Map Local Mock Workflow** - create request-derived mock responses faster with prefilled rules, editable generated files, and detached-window actions.
- **Tray Tool Controls** - open tools and toggle rule engines directly from the macOS tray, including the new Scripting tool.

## Fixes & Improvements

- **iOS Simulator App Icons** - detected Simulator apps can now show their bundle icons in the source list.
- **Tray Visibility Setting** - show or hide the macOS tray icon from Appearance settings, with the choice saved between launches.
- **Proxy Status Sync** - proxy start, stop, port, and LAN state now stay better synchronized across windows, shortcuts, and tray actions.
- **Certificate Server Reliability** - certificate sharing avoids port collisions and handles overlapping start requests more gracefully.
- **Remote Device Counts** - device and host counts in the source list now reflect the live captured requests.
- **Rule Update Reliability** - concurrent Map Local, scripting, and feature-limit updates are less likely to leave stale or conflicting rule state.
- **Map Local Prefill Fix** - creating a Map Local rule from a request no longer opens with empty form fields.

Thanks to everyone who reported issues and shared feedback. Download WePROXA 2.3.0 and let us know what you think!