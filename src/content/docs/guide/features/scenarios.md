---
title: Scenarios
description: Package the exact rules and tool states needed for one acceptance criterion.
---

Scenarios live inside a [Workspace](/guide/features/workspaces/). A Workspace remains the project or environment boundary; each Scenario describes one concrete setup, such as “checkout declines an expired card” or “profile request times out.” Exactly one Scenario is active in each Workspace.

## What a Scenario Contains

A Scenario stores:

- A name and optional acceptance criteria, expected outcome, and HTTP(S) ticket URL
- References to Workspace-owned Map Local, Breakpoint, Block List, Network Conditioning, and Scripting rules
- An enabled state for each of those five tools

Rules are reusable definitions. A Scenario references them instead of copying them, so two acceptance criteria can intentionally share the same mock or script. **Shared Rules** apply to every Scenario in the Workspace. The effective live setup is the active Scenario plus Shared Rules, filtered by each rule’s own enabled state and the Scenario’s tool states.

## Browse Without Activating

Open the **Workspaces** sidebar and expand a Workspace:

- Select a **Scenario** to preview and edit its effective rules.
- Select **Shared Rules** to manage rules that apply to every Scenario.
- Select **Rule Library** to see all Workspace-owned definitions, including unassigned rules.

Selecting an inactive Scenario does not change live traffic. Choose **Activate** when you are ready. WePROXA shows how many rules and tools will be enabled or disabled before applying the switch atomically. Any request paused at a breakpoint is released during the switch.

The toolbar, sidebar, native application menu, and tray all show the active Workspace and Scenario and provide quick switching.

## Reuse and Diverge Safely

Rule cards show whether a definition is Shared and how many Scenarios reference it. Editing a reused definition intentionally updates every referencing Scenario.

When one Scenario needs different behavior, choose **Make independent copy**. WePROXA creates a new rule, swaps only that Scenario’s reference, and independently clones managed Map Local payload files. Duplicating a whole Scenario copies its metadata and references without cloning physical rules.

Use **Add existing rule** to reference a definition from the Rule Library. Removing a rule from a Scenario removes only its reference; delete it from the Rule Library to remove the physical definition and every reference to it.

## Request Attribution

Every newly captured request records the active Scenario ID and name. That attribution remains unchanged if you switch Scenarios before the response arrives. It is shown in request details, available as an optional Request List column, and preserved in saved requests. Older saved requests remain valid with no Scenario attribution.

## Share a Portable Scenario

Scenario files use the `.weproxa-scenario.json` format. They include metadata, tool states, complete effective rule definitions, scripts, and embedded Map Local files. Captured traffic is never included.

1. Select a Scenario and choose **Export scenario**.
2. Review the privacy warning. Scripts and mock payloads can contain sensitive data.
3. On the receiving machine, choose **Import scenario** and review the validation preview.

Import always creates fresh Scenario and rule IDs and fresh managed Map Local files. Shared source rules become local references in the imported Scenario, so an import cannot change other target Scenarios. A missing or unreadable local file, a file larger than 32 MiB, or a bundle larger than 128 MiB is rejected before anything is changed.

Import is available on Free while the Workspace remains within its Scenario and physical-rule limits. Export requires Pro.

## Free and Pro Limits

Free includes up to **three Scenarios per Workspace**. Pro unlocks unlimited Scenarios and portable export. A Workspace always retains at least one Scenario; existing profiles are migrated automatically into an active **Current setup** Scenario without moving or deleting rule files.

:::note
Scenarios configure deterministic debugging setups. They do not run pass/fail assertions, synchronize through the cloud, or integrate directly with ticket providers.
:::
