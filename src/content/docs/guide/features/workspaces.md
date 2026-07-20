---
title: Workspaces
description: Organize projects and environments, then activate acceptance-criteria Scenarios within them.
---

Workspaces separate projects and environments. Each Workspace contains [Scenarios](/guide/features/scenarios/) for individual acceptance criteria, plus reusable Shared Rules and a Rule Library. Only one Workspace and one Scenario within it are active at a time.

## What a Workspace Contains

Each Workspace owns reusable rule definitions for these tools:

- [Map Local](/guide/features/map-local/)
- [Breakpoints](/guide/features/breakpoints/)
- [Block List](/guide/features/block-list/)
- [Network Conditioning](/guide/features/network-conditioning/)
- [Scripting](/guide/features/scripting/)

Scenarios reference these definitions and store their own tool-level enabled states. Captured requests, saved requests, proxy settings, and SSL interception rules are not Workspace-specific. Switching Workspaces restores that Workspace’s active Scenario without clearing traffic already shown in the request list.

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

Selecting a Workspace reveals its Scenarios, Shared Rules, and Rule Library. Select any Scenario to preview its effective rules without activating it, so you can prepare an acceptance criterion without disturbing live capture.

![Previewing an inactive workspace's rules without activating it](@assets/generated/screenshots/features/workspaces/preview.png)

Edits are saved immediately. New rules created from an inactive Scenario editor are assigned explicitly to that Scenario. Be aware that editing a definition referenced by the active Scenario or Shared Rules intentionally updates every place that reuses it; rule cards identify that propagation before you edit.

## Copying Rules Between Workspaces

Each rule has a **Copy to workspace** action (the folder-in icon next to the rule's other controls). Use it to clone a single rule into another workspace:

1. Select a rule's **Copy to workspace** action.
2. Pick a destination Workspace.
3. Pick its destination Scenario, Shared Rules, or Rule Library.

The rule is added to the destination as an **independent clone** — later edits or deletions in either workspace don't affect the other. For Map Local rules that serve a managed response file, the copy receives its own fresh managed file, so editing the copied response never changes the original.

The action is available only when more than one workspace exists (creating additional workspaces is a **Pro** feature).

## Existing Rules After Upgrading

The first time a version with workspace support starts, WePROXA creates a workspace named **Default** and moves your existing Map Local, Breakpoint, Block List, Network Conditioning, and Scripting rules into it. Your existing rules and tool enabled states remain available without manual migration.

## Free and Pro Limits

Free accounts include the Default Workspace with up to three Scenarios. Creating additional Workspaces is a **Pro** feature, and Pro accounts can create unlimited Workspaces and Scenarios.

## Example Workflows

- Keep development, staging, and production rules separate.
- Create one workspace for API failure simulations and another for normal capture.
- Isolate Map Local mocks for different projects.
- Pair Scripting and Network Conditioning rules for a repeatable test scenario.

When using the [MCP server](/guide/guides/mcp-integration/), new rules are assigned to the Scenario currently active in WePROXA.
