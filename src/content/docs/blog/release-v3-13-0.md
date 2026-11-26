---
title: WePROXA 3.13.0 Release Notes
date: 2026-11-26
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.13.0 adds background app updates, imported CA certificates, per-device iOS Simulator traffic, and a tidier Explorer.
---

WePROXA **3.13.0** makes updates easier to live with, lets you sign HTTPS traffic with your own CA, and shows exactly which iOS Simulator sent each request.

## New Features

- **Background updates** - updates download while you keep working, show their progress in the toolbar, resume after a lost connection, and let you restart now or on the next launch.
- **Import a CA certificate** - sign decrypted hosts with your own CA from **Settings → CA Certificate**, so apps that trust or pin that CA can be inspected, and switch back to WePROXA's CA at any time with no new install.
- **Imported CA in headless runs** - `weproxa-cli headless --ca-cert` now reads PEM or DER files, with the private key in the same file or in `--ca-key`.
- **iOS Simulator devices** - a new **Simulators** group in Explorer lists each Simulator device that sent traffic, with its hosts and paths, so two Simulators running the same app stay apart.
- **Simulator in traffic views** - a new **Simulator** column in the request list (hidden by default) and a Simulator row in request details show which device sent a request.
- **Filter by Simulator** - filter requests by Simulator over MCP, record a Simulator selection into a session, and keep the device when you replay a request.
- **Show or hide Explorer groups** - hide the Explorer groups you do not use, and show them again from one menu.

## Fixes & Improvements

- **Sessions** - opening a session you just created or stopped shows the Sessions group again if you had hidden it.
- **Simulator certificate trust** - one Simulator that trusts the CA no longer hides certificate refusals from another Simulator running the same app.
- **Update errors** - clearer messages when a download fails, a signature check fails, or a password prompt is cancelled, with a **Try Again** button.

---

Thanks to everyone who reported issues and shared feedback!
