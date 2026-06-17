---
title: WePROXA 3.0.0 Release Notes
date: 2026-06-17
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.0.0 expands capture support to Windows, adds a persisted language selector, and improves TLS and window polish.
---

WePROXA **3.0.0** is here with a broader platform foundation, smoother settings, and a few targeted fixes that make everyday debugging feel more dependable.

## New Features

- **Windows capture support** - Configure and reset the Windows system proxy, trust the WePROXA CA certificate, and identify captured traffic by source application.
- **Windows app frame** - Windows builds now use themed window chrome with app menus, edit actions, tool shortcuts, and native window controls.
- **Language selector** - Switch between English and French from Appearance settings, with the choice persisted across WePROXA windows.

## Fixes & Improvements

- **TLS compatibility** - Bundled fallback trust roots help WePROXA connect to sites that have moved to newer Microsoft TLS roots before platform stores catch up.
- **macOS resize polish** - Window backdrop synchronization reduces flashes during resize and maximize animations.
- **Request list defaults** - New and migrated layouts now open with the source sidebar visible and the URL column shown by default.
- **Certificate setup** - The local CA is generated at startup so certificate installation is ready before the proxy starts.

---

Thanks to everyone who tested platform-specific workflows and reported sharp edges. Download WePROXA 3.0.0 and let us know what you think!
