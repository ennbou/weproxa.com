---
title: Block List
description: Block specific requests from reaching their destination.
---

The Block List feature lets you prevent specific requests from being sent to the server — useful for testing how your app handles missing resources or blocked APIs.

## How It Works

When a request matches a Block List rule, WePROXA intercepts it and returns an **HTTP 403 Forbidden** response instead of forwarding the request to the server. The blocked request still appears in the request list, marked with a "blocked" status, so you can see exactly which requests were caught.

![Blocked request in request list](@assets/guide/features/block-list/blocked_request.png)

## Creating a Block Rule

1. Open the **Block List** tool from the toolbar
2. Click **Add Rule**
3. Fill in the rule details:
   - **Name** — a descriptive label for the rule (e.g., "Block Analytics")
   - **URL Pattern** — a glob pattern to match URLs (e.g., `**/ads/**`, `*tracking.example.com*`)
   - **Method** — optionally restrict to a specific HTTP method (GET, POST, PUT, etc.), or leave as "Any" to match all methods
4. Enable the rule

    ![WePROXA Block List window](@assets/generated/screenshots/features/block-list/window.png)

:::tip
You can also create a Block rule by **right-clicking a request** in the request list and selecting **Add Block Rule**. The URL pattern will be pre-filled from the selected request.
![Add Block Rule from requests list](@assets/guide/features/block-list/block_from_request.png)
:::

### Managing Rules

- **Toggle individual rules** on or off using the toggle switch next to each rule
- **Toggle all rules** at once using the global enable/disable button
- **Sort rules** by name, creation date, or last updated date
- **Edit** or **delete** rules at any time

When multiple rules match the same request, the oldest rule (earliest creation date) takes priority.

:::note
Free accounts are limited to **10 Block List rules**. Upgrade to Pro for unlimited rules.
:::

## Pattern Matching

Block List rules support glob patterns for flexible URL matching:

- **Wildcard paths** — `**/ads/**` matches any URL containing `/ads/`
- **Domain-wide** — `*tracking.example.com*` blocks all requests to a domain
- **Exact URLs** — `https://api.example.com/v1/telemetry` blocks a specific endpoint

## Use Cases

- **Test error handling** — see how your app behaves when an API returns 403
- **Block analytics/tracking** — prevent analytics requests during development
- **Isolate dependencies** — block third-party services to test in isolation
- **Simulate outages** — test resilience against service failures
