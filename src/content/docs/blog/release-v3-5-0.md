---
title: WePROXA 3.5.0 Release Notes
date: 2026-07-18
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.5.0 adds acceptance-criteria Scenarios, reusable Shared Rules, portable handoff files, and immutable request attribution.
---

WePROXA **3.5.0** adds Scenarios beneath Workspaces so developers and QA can activate the exact mocks, breakpoints, scripts, blocks, and network conditions required for one acceptance criterion.

## New Features

- **Acceptance-criteria Scenarios** - Keep multiple named setups in a Workspace, document their criteria and expected outcomes, preview them safely, and activate all rule membership and tool states atomically.
- **Shared Rules and Rule Library** - Reuse Workspace-owned definitions across Scenarios, see where each rule is used, and create an independent copy only when one Scenario must diverge.
- **Portable Scenario handoff** - Import and export validated `.weproxa-scenario.json` bundles with scripts and binary-safe embedded Map Local payloads. Captured traffic is never included.
- **Request attribution** - Requests and saved snapshots retain the Scenario that was active at capture time, even after a later switch.
- **Scenario switchers everywhere** - Switch from the sidebar, toolbar, native application menu, or tray while each Workspace remembers its active Scenario.

## Safety and Migration

- Existing Workspaces migrate automatically into an active **Current setup** Scenario without moving rule definitions.
- Scenario activation releases open breakpoints before applying the new prefiltered runtime snapshots.
- Imports validate the complete bundle and stage managed files before committing, preventing partial setups.
- Free includes three Scenarios per Workspace and import within existing limits. Pro unlocks unlimited Scenarios and export.

---

Thanks to the developers and QA teams testing real acceptance-criteria handoffs with WePROXA.
