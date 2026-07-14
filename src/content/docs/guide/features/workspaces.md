---
title: Workspaces
description: Organize debugging rules into isolated, named scenarios.
---

Workspaces let you keep separate sets of debugging rules for different projects, environments, or test scenarios. Only one workspace is active at a time, so you can change an entire rule setup without enabling and disabling rules individually.

## What a Workspace Contains

Each workspace keeps its own rules and tool-level enabled state for these tools:

- [Map Local](/guide/features/map-local/)
- [Breakpoints](/guide/features/breakpoints/)
- [Block List](/guide/features/block-list/)
- [Network Conditioning](/guide/features/network-conditioning/)
- [Scripting](/guide/features/scripting/)

Captured requests, saved requests, proxy settings, and SSL interception rules are not workspace-specific. Switching workspaces changes the active tool rules without clearing the traffic already shown in the request list.

## The Workspaces Tab

The left sidebar has two tabs: **Explorer** (the traffic and source tree) and **Workspaces** (the workspace manager). Open the **Workspaces** tab to see every workspace, create new ones, and select any workspace to view and edit its rules.

![WePROXA Workspaces tab with the active workspace selected](@assets/generated/screenshots/features/workspaces/tab.png)

## Switching Workspaces

Only one workspace is active at a time, and only the active workspace's rules match live traffic.

1. Open the **Workspaces** tab.
2. Select the workspace you want to apply.
3. Choose **Set as active**.

WePROXA saves the workspace you are leaving and loads the selected workspace's rules and tool enabled states. If a request is paused at a breakpoint when you switch, WePROXA releases that breakpoint before loading the next workspace.

You can also switch without opening the sidebar. A native **Switch Workspace** submenu appears in the macOS menu bar and the tray menu, listing every workspace with the active one checked. Selecting a workspace there activates it immediately, and the list updates automatically as you create, rename, or delete workspaces.

## Creating and Managing Workspaces

From the **Workspaces** tab you can create, rename, delete, and set the active workspace.

- **Create** - Enter a name to create an empty workspace.
- **Rename** - Change the workspace name without affecting its rules.
- **Delete** - Remove a workspace and its saved rules. The last remaining workspace cannot be deleted.

Deleting the active workspace switches to another available workspace first. Managed Map Local response files owned by the deleted workspace are removed, while files you selected from elsewhere on your computer are left untouched.

:::caution
Deleting a workspace cannot be undone. Review its rules before confirming the deletion.
:::

## Editing Rules Without Activating

Selecting a workspace in the **Workspaces** tab opens its rules in the main area, grouped under each tool (Map Local, Breakpoints, Block List, Network Conditioning, and Scripting). You can add, edit, toggle, and remove rules for **any** workspace — including ones that are not active — so you can prepare a scenario ahead of time without disturbing live capture.

![Previewing an inactive workspace's rules without activating it](@assets/generated/screenshots/features/workspaces/preview.png)

A hint above the rules tells you which mode you're in:

- **This is the active workspace — changes affect live traffic.**
- **Previewing without activating — live traffic is unaffected.**

Edits to a non-active workspace are saved immediately and take effect the next time you set that workspace as active.

## Copying Rules Between Workspaces

Each rule has a **Copy to workspace** action (the folder-in icon next to the rule's other controls). Use it to clone a single rule into another workspace:

1. Select a rule's **Copy to workspace** action.
2. Pick a destination workspace from the menu.

The rule is added to the destination as an **independent clone** — later edits or deletions in either workspace don't affect the other. For Map Local rules that serve a managed response file, the copy receives its own fresh managed file, so editing the copied response never changes the original.

The action is available only when more than one workspace exists (creating additional workspaces is a **Pro** feature).

## Existing Rules After Upgrading

The first time a version with workspace support starts, WePROXA creates a workspace named **Default** and moves your existing Map Local, Breakpoint, Block List, Network Conditioning, and Scripting rules into it. Your existing rules and tool enabled states remain available without manual migration.

## Free and Pro Limits

Free accounts include the Default workspace. Creating additional workspaces is a **Pro** feature, and Pro accounts can create unlimited workspaces.

## Example Workflows

- Keep development, staging, and production rules separate.
- Create one workspace for API failure simulations and another for normal capture.
- Isolate Map Local mocks for different projects.
- Pair Scripting and Network Conditioning rules for a repeatable test scenario.

When using the [MCP server](/guide/guides/mcp-integration/), rule-management tools operate on the workspace that is currently active in WePROXA.
