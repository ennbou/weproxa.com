---
title: Toolbar & Tray
description: Customize the WePROXA toolbar, menus, tray, and appearance controls.
---

The toolbar, app menus, and tray give you quick access to capture controls, tool windows, SSL settings, and app appearance options without opening extra panels first.

## Toolbar Controls

The main toolbar includes:

- **Clear** - remove captured requests from the current session.
- **LAN access** - choose whether the proxy listens only on `127.0.0.1` or on your local network address.
- **Start / stop proxy** - toggle capture on the configured proxy port.
- **Tool buttons** - open Map Local, Breakpoints, Block List, Network Conditioning, Scripting, and Diff.
- **Certificate menu** - manage SSL host and app rules and open certificate setup.
- **Settings** - open WePROXA settings.

Clicking a tool button opens the tool. Holding `Command` on macOS or `Ctrl` on Windows while clicking a toggleable tool button enables or disables that tool without opening it.

When space is tight, the toolbar automatically switches to a compact icon layout while keeping counts and status indicators visible.

## Detached Window Behavior

Tool, Settings, SSL Manager, Repeat, and Breakpoint windows are single-purpose workspaces. If one of those windows is already open, triggering the same action again focuses the existing window instead of creating a duplicate.

For tool windows, this also avoids replaying prefilled rule data over in-progress edits. Settings navigation is the exception: opening Settings for a specific section focuses the existing Settings window and switches it to that section.

## Customize Visible Tool Buttons

Use toolbar customization when you want a quieter workspace or only use a subset of tools day to day.

1. Open **Settings**.
2. Go to **Appearance**.
3. In **Toolbar Tools**, check the tools you want shown in the toolbar.

Your selection is saved automatically and synced across WePROXA windows. Newly added tools remain visible by default after upgrades.

## Appearance and Language

Use Appearance settings to keep the app comfortable across all windows:

1. Open **Settings**.
2. Go to **Appearance**.
3. Choose your preferred language, **English** or **French**.

The language choice is saved automatically and applied across the main window and detached tool windows.

## Certificate and SSL Shortcuts

The lock button opens the certificate menu for quick SSL rule management. From there you can add host rules, review enabled host and app rules, and open certificate installation settings.

For a larger SSL workspace, open the standalone [SSL Manager](/guide/guides/ssl-interception/#ssl-manager-window). It is better suited for longer rule lists because it includes search and host/app filters.

## Platform Menus and Window Chrome

WePROXA follows platform conventions for top-level app controls:

- **macOS** — the app uses the macOS menu bar, native window controls, and macOS keyboard shortcuts such as `⌘ P`.
- **Windows** — the app uses themed Windows chrome with standard minimize, maximize, and close controls. The Windows menu exposes platform-appropriate app, edit, view, tool, window, and help actions with `Ctrl` shortcuts.

Some actions only appear on the platform where they apply. For example, macOS certificate installation targets Keychain, while Windows certificate installation targets the current user's trusted root certificate store.

## Tray Menu

The tray menu works even when the main window is closed or hidden. On macOS it appears in the menu bar; on Windows it appears in the notification area when enabled. Use it to:

- Show the main WePROXA window.
- Start or stop the proxy.
- Open any tool window.
- Toggle Map Local, Breakpoints, Block List, Network Conditioning, and Scripting.
- Open Settings.
- Quit WePROXA.

Tray tool toggles update the same backend state as toolbar toggles, so changes are reflected immediately in open windows.

## Show or Hide the Tray Icon

If you prefer a cleaner menu bar, you can hide the tray icon:

1. Open **Settings**.
2. Go to **Appearance**.
3. Toggle **Show tray icon**.

The setting is saved between launches. If you hide the tray icon, you can still use the app menu and toolbar from the main window.

## Tips

- Use the tray when you need to restart capture quickly while another app is frontmost.
- Hide toolbar buttons for tools you only open from the Tools menu or tray.
- Keep the Diff button visible if you compare requests often; its badge shows how many requests are waiting in the diff pool.
