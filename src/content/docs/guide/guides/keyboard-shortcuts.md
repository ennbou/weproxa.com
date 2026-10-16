---
title: Keyboard Shortcuts
description: Full list of keyboard shortcuts available in WePROXA.
---

WePROXA ships with keyboard shortcuts for every common action so you can drive the app without leaving the keyboard. Shortcuts use `⌘` on macOS and `Ctrl` on Windows unless noted.

The **Settings** → **Keyboard Shortcuts** screen lists the most common shortcuts. This guide also includes tool and editor shortcuts that are not shown in that screen.

![WePROXA Keyboard Shortcuts settings](@assets/generated/screenshots/settings/shortcuts.png)

## Proxy & Capture

| Action | Shortcut |
|---|---|
| Start / stop the proxy | `⌘ P` / `Ctrl + P` |
| Clear captured requests | `⌘ K` / `Ctrl + K` |
| Focus the search / filter input | `⌘ F` / `Ctrl + F` |
| Show / hide the advanced filter panel | `⌘ ⇧ F` / `Ctrl + Shift + F` |

## Appearance

| Action | Shortcut |
|---|---|
| Increase font size | `⌘ +` / `Ctrl +` |
| Decrease font size | `⌘ -` / `Ctrl -` |

## Layout

| Action | Shortcut |
|---|---|
| Toggle the left (sources) panel | `⌘ B` / `Ctrl + B` |
| Toggle the details panel | `⌘ J` / `Ctrl + J` |
| Show the left panel on the Explorer tab | `⌘ ⇧ E` / `Ctrl + Shift + E` |
| Show the left panel on the Workspaces tab | `⌘ ⇧ W` / `Ctrl + Shift + W` |

The Explorer and Workspaces shortcuts expand the left panel first if it is collapsed, so they always land on the tab you asked for.

## Certificates

| Action | Shortcut |
|---|---|
| Open the SSL Manager window | `⌘ ⇧ C` / `Ctrl + Shift + C` |

## Tools

| Action | Shortcut |
|---|---|
| Open Map Local | `⌘ ⇧ M` / `Ctrl + Shift + M` |
| Open Breakpoints | `⌘ ⇧ B` / `Ctrl + Shift + B` |
| Open Block List | `⌘ ⇧ K` / `Ctrl + Shift + K` |
| Open Network Conditioning | `⌘ ⇧ N` / `Ctrl + Shift + N` |
| Open Scripting | `⌘ ⇧ S` / `Ctrl + Shift + S` |
| Open Diff | `⌘ ⇧ D` / `Ctrl + Shift + D` |
| Open JSON Tools | `⌘ ⇧ J` / `Ctrl + Shift + J` |

Tool shortcuts open the matching tool window. Use the toolbar, tray, or tool panel toggle to enable or disable a tool's rules. JSON Tools and Diff are standalone utilities, so opening them does not change traffic handling.

### Individual Rule Windows

On a focused rule card in Map Local, Breakpoints, Block List, Network Conditioning, or Scripting:

| Action | Shortcut |
|---|---|
| Edit inline | `Enter` or `Space` |
| Open the rule in its own window | `⌘ Enter` / `Ctrl + Enter` |

You can also `⌘`-click / `Ctrl`-click the card. Opening an already-open rule focuses its existing window. See [Detached Rule Editors](/guide/features/workspaces/#detached-rule-editors) for how the editor follows its Workspace.

## Tool Rule Forms

These shortcuts work while an add/edit form is open in Breakpoints, Block List, Network Conditioning, or Scripting:

| Action | Shortcut |
|---|---|
| Save the rule | `⌘ S` / `Ctrl + S` |
| Cancel and close the form | `Escape` |

After a rule saves successfully, the action button briefly changes to a saved confirmation so you can keep editing without losing track of the last save.

## Repeat and Breakpoint Editors

These shortcuts work anywhere in a Repeat editor or Breakpoint editor window, including while you type in the body editor:

| Action | Shortcut |
|---|---|
| Send the edited request (Repeat editor) | `⌘ Enter` / `Ctrl + Enter` |
| Continue the paused request or response (Breakpoint editor) | `⌘ Enter` / `Ctrl + Enter` |

The shortcut does nothing while the button is unavailable, for example while a Repeat request is still sending.

## Settings

| Action | Shortcut |
|---|---|
| Open Settings | `⌘ ,` / `Ctrl + ,` |

## Request List Navigation

| Action | Shortcut |
|---|---|
| Move selection up / down | `↑` / `↓` |
| Expand the details panel if collapsed | `Enter` |

With a [capture milestone badge](/guide/features/inspect-requests/#capture-milestones) focused, press `Delete` or `Backspace` to remove that milestone. `Enter` or `Space` activates the badge and jumps to its divider.

## Sidebar Navigation

These keys work on a focused row in the sidebar's Source View:

| Action | Shortcut |
|---|---|
| Move to the next / previous row | `↓` / `↑` |
| Expand / collapse a group | `→` / `←` |
| Select the row | `Enter` or `Space` |

## Modifier Clicks

`⌘` (macOS) or `Ctrl` (other platforms) is WePROXA's primary modifier. Holding it selects the *alternate* variant of a click:

| Click target | Plain click | With `⌘` / `Ctrl` |
|---|---|---|
| Content-type chip above the request list | Select only that type | Toggle multi-select |
| Tool rule card | Edit inline | Open the rule in its own window |
| Toolbar filter icon | Expand the query builder | Enable or disable the filter without clearing your rules |
| **Add to Filters** entry in the request context menu | Extend the current query | Replace the current query — see [Advanced Filtering](/guide/features/advanced-filtering/#extend-or-replace) |

## Tips

- Most shortcuts also appear in the app menu bar, so you can discover them contextually.
- Shortcuts are disabled while typing in editors, inputs, or dialogs — so the editor's own find shortcut still opens Monaco's find widget. The rule form and Repeat/Breakpoint editor shortcuts above are the exception: they work while you type.
