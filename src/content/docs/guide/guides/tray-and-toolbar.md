---
title: Toolbar & Tray
description: Customize the WePROXA toolbar, menus, tray, and appearance controls.
---

The toolbar, app menus, and tray give you quick access to capture controls, tool windows, SSL settings, and app appearance options without opening extra panels first.

## Toolbar Controls

The main toolbar includes:

- **Clear** - remove the requests currently shown in the list. When a filter is active, Clear removes only the displayed matches and leaves the rest of the session intact; with no filter it clears every captured request. The button's tooltip reflects which of the two it will do.
- **Remote capture / LAN access** - use the device button to choose whether the proxy listens only on `127.0.0.1` or on your local network address.
- **Start / stop proxy** - toggle capture on the configured proxy port.
- **Tool buttons** - open Map Local, Breakpoints, Block List, Network Conditioning, Scripting, and Diff.
- **Certificate menu** - manage SSL host and app rules and open certificate setup.
- **Settings** - open WePROXA settings.
- **Workspace and scenario switcher** - optional, hidden by default. See [Show the Workspace and Scenario Switcher](#show-the-workspace-and-scenario-switcher).

Clicking a tool button opens the tool. Holding `Command` on macOS or `Ctrl` on Windows while clicking a toggleable tool button enables or disables that tool without opening it.

When space is tight, the toolbar automatically switches to a compact icon layout while keeping counts and status indicators visible.

## Detached Window Behavior

Tool, Settings, SSL Manager, Repeat, and Breakpoint windows are single-purpose workspaces. If one of those windows is already open, triggering the same action again focuses the existing window instead of creating a duplicate.

For tool windows, this also avoids replaying prefilled rule data over in-progress edits. Settings navigation is the exception: opening Settings for a specific section focuses the existing Settings window and switches it to that section.

WePROXA remembers the size, position, and maximized state of the main window and detached Tool, Settings, SSL Manager, Repeater, and Breakpoint windows. Reopening a window restores its last usable layout; if a display was disconnected, WePROXA keeps the restored window on an available screen.

## Customize Visible Tool Buttons

Use toolbar customization when you want a quieter workspace or only use a subset of tools day to day.

1. Open **Settings**.
2. Go to **Appearance**.
3. In **Toolbar Tools**, check the tools you want shown in the toolbar.

On a fresh install, **Map Local**, **Breakpoints**, and **Diff** are visible; **Block List**, **Network Conditioning**, and **Scripting** remain available from the application menu until you add them. Your selection is saved automatically and synced across WePROXA windows. Existing installations keep their saved toolbar layout during upgrades.

## Show the Workspace and Scenario Switcher

The toolbar can display the active workspace and scenario as two dropdowns. It is hidden by default because the same switch is always available from the **Workspaces** sidebar, the **Workspaces** application menu, and the tray.

1. Open **Settings**.
2. Go to **Appearance**.
3. Toggle **Show workspace and scenario switcher**.

The choice is saved between launches and synced across WePROXA windows. Switching a scenario from the toolbar shows the same activation summary as the sidebar before applying the change.

## Appearance and Language

Use Appearance settings to keep the app comfortable across all windows:

1. Open **Settings**.
2. Go to **Appearance**.
3. Choose your preferred language, **English** or **French**.

The language choice is saved automatically and applied across the main window and detached tool windows. It also covers native app chrome: the macOS menu bar, the tray menu, and the titles WePROXA gives its windows. Because that chrome is built before any window content loads, the saved language is restored at launch, so menus and tray entries are already translated on the first frame instead of switching from English a moment later.

### Theme and Native Window Chrome

The theme selector applies to more than the app's own interface. On macOS the window backdrop and the traffic-light buttons are drawn by the system and normally follow the macOS appearance, which used to leave them mismatched when the app theme differed.

- **Light** or **Dark** pins the native window chrome to your choice across the main window and every detached tool, Settings, SSL Manager, Repeater, and Breakpoint window.
- **System** removes the override and hands the windows back to macOS, so they follow your System Settings appearance again.

The selected mode is saved between launches and applied before a window is shown, so windows never appear briefly in the wrong theme at startup.

The macOS traffic lights also stay vertically centered in the title bar as you change the UI font size with `⌘ +` and `⌘ -`.

## Certificate and SSL Shortcuts

The lock button opens the certificate menu for quick SSL rule management. From there you can add host rules, review enabled host and app rules, and open certificate settings.

For a larger SSL workspace, open the standalone [SSL Manager](/guide/guides/ssl-interception/#ssl-manager-window). It is better suited for longer rule lists because it includes search and host/app filters.

## Platform Menus and Window Chrome

WePROXA follows platform conventions for top-level app controls:

- **macOS** — the app uses the macOS menu bar, native window controls, and macOS keyboard shortcuts such as `⌘ P`.
- **Windows** — the app uses themed Windows chrome with standard minimize, maximize, and close controls. Its custom menu exposes platform-appropriate app, edit, view, tool, window, help, Workspace, and Scenario actions with `Ctrl` shortcuts. The same integrated header is used by detached windows.

Some actions only appear on the platform where they apply. For example, macOS certificate installation targets Keychain, while Windows shows a Learn More link for HTTPS certificate trust information.

## Tray Menu

The tray menu works even when the main window is closed or hidden. On macOS it appears in the menu bar; on Windows it appears in the notification area when enabled. Use it to:

- Show the main WePROXA window.
- Start or stop the proxy.
- Open any tool window.
- Toggle Map Local, Breakpoints, Block List, Network Conditioning, and Scripting.
- Switch the active workspace or acceptance-criteria setup from the **Workspaces** submenu, which groups **Switch Workspace** and **Switch Scenario**.
- Open Settings.
- Quit WePROXA.

The **Workspaces** menu also appears in the macOS menu bar with the same two submenus, each marking the active choice with a checkmark. See [Workspaces](/guide/features/workspaces/) and [Scenarios](/guide/features/scenarios/) for details.

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
