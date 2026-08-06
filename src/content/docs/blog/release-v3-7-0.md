---
title: WePROXA 3.7.0 Release Notes
date: 2026-08-06
authors:
  - weproxa
tags:
  - release
  - changelog
excerpt: WePROXA 3.7.0 turns Map Local into a full fixture engine with inline bodies and request conditions, adds portable Scenario bundles with rule precedence, and lets AI clients author rules, replay requests, and control paused breakpoints.
---

WePROXA **3.7.0** is about mocking with confidence. Map Local rules can now state a whole response inline and answer only the requests you choose, Scenarios travel between machines as a single committable file, and connected AI clients can author, reconcile, and verify all of it without touching the UI.

## New Features

- **Inline response fixtures** - Map Local rules can serve a body written directly on the rule, with no file on disk, plus status code and response header overrides for local, remote, and inline sources.
- **Request match conditions** - A Map Local rule can require specific query parameters, headers, body text, or body JSON paths, so one endpoint can carry several fixtures for different inputs.
- **Rule priority** - Overlapping rules now resolve in one predictable order everywhere they are listed, and an explicit priority (set from an AI client) promotes a narrow fixture above a catch-all without recreating either.
- **Portable Scenario bundles** - Export a Scenario and its rules to a single file and import it on another machine, with a preview that reports what will be created, which free-tier limits it would cross, and which rules are missing SSL coverage (export is Pro; import is not).
- **Shadowed rule detection** - Activation and import previews report rules that can never answer because an earlier rule always wins.
- **Rule hit counters** - Every rule tracks how many times it actually answered, so a fixture with zero hits after a run is visibly dead or shadowed.
- **Capture sessions** - Name a run, then read a summary of exactly the traffic captured during it, instead of clearing the request list between runs.
- **Pass-Through containment** - Seal the proxy from an AI client so requests no Map Local rule answered are denied instead of reaching the network, and let a Scenario declare that containment as part of what it activates.
- **Answering rule attribution** - Request details now name the Map Local rule that produced a mocked response, by external key when you gave it one.
- **Rule authoring from AI clients** - Connected MCP clients can create rules in atomic batches, target any Workspace without activating it, reconcile repeat runs by external key, and tag, annotate, and filter rules across every tool.
- **Request replay from AI clients** - Replay a captured request or state a new one outright, through the same execution path the Repeat editor uses, so the result is logged and attributed identically.
- **Paused breakpoint control from AI clients** - List pending breakpoint hits with their deadlines, then patch headers, body, URL, or status and resume, or cancel the request outright.
- **Saved request snapshots for AI clients** - Save, list, read, and remove captured exchanges, with the same redaction applied to live traffic.
- **Unmatched endpoint discovery** - Ask which captured endpoints no rule answered, so gaps in a fixture set surface without reading the whole request list.
- **Certificate tools for AI clients** - Read CA details and install the certificate into a booted iOS Simulator without leaving the client.
- **Resizable request list columns** - Drag any column border to resize it; widths persist across restarts.
- **Replace filters with a modifier click** - Hold ⌘ (Ctrl on Windows) while picking a filter from the request context menu to replace the current query instead of extending it.
- **Richer About section** - Settings now shows the exact build commit alongside the version, plus links to the Microsoft Store listing and LinkedIn.

## Fixes & Improvements

- **No hang on quit** - Quitting WePROXA while the proxy is running no longer waits on teardown, and open CONNECT tunnels are closed instead of holding the shutdown deadline open.
- **Reliable proxy stop and restart** - Stopping the proxy now waits for the listener to be released, so an immediate restart cannot race the old socket.
- **Crash-safe settings and rules** - Every rule and state file is written atomically and in order, so a crash or two racing saves can no longer leave a truncated or out-of-date file on disk.
- **Recoverable corrupt state** - A malformed state file is moved aside with its bytes preserved instead of being silently overwritten, and the app starts cleanly rather than failing to parse it on every launch.
- **Stronger redaction** - Authorization and Digest credentials are now redacted from plain-text body dumps, not just from structured header lists, using one shared vocabulary across every rendering.
- **Safer Scenario import** - Imports commit against the live rules rather than a stale on-disk snapshot, and a reused external key is rejected instead of creating a second owner.
- **MCP token rotation** - A regenerated MCP token is persisted before it takes effect, so a failed write cannot leave the server rejecting the token still shown in Settings.
- **Rule state across Workspace switches** - Editing rules or switching Workspaces no longer disturbs unrelated Scenario membership or resets counters for a run in progress.

---

Thanks to everyone pushing WePROXA toward mocking that is repeatable, reviewable, and committable next to the code it stands in for.
