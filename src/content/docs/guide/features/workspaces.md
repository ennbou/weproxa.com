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

## Switching Workspaces

Use the workspace selector at the top of the source sidebar:

1. Open the workspace selector.
2. Choose a workspace.
3. WePROXA saves the workspace you are leaving and loads the selected workspace's rules and tool enabled states.

Only rules from the active workspace can match traffic. If a request is paused at a breakpoint when you switch, WePROXA releases that breakpoint before loading the next workspace.

## Creating and Managing Workspaces

Open the workspace selector to create, rename, switch, or delete a workspace.

- **Create** - Enter a name to create an empty workspace and switch to it immediately.
- **Rename** - Change the workspace name without affecting its rules.
- **Delete** - Remove a workspace and its saved rules. The last remaining workspace cannot be deleted.

Deleting the active workspace switches to another available workspace first. Managed Map Local response files owned by the deleted workspace are removed, while files you selected from elsewhere on your computer are left untouched.

:::caution
Deleting a workspace cannot be undone. Review its rules before confirming the deletion.
:::

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
