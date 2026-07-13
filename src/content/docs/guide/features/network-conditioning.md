---
title: Network Conditioning
description: Simulate slow network conditions for testing.
---

Network Conditioning lets you add artificial latency to specific requests, simulating real-world conditions like slow APIs, high-latency servers, or sluggish network connections.

## How It Works

Network Conditioning rules add configurable delays at two points in the request lifecycle:

- **Request delay** — pauses before the request is forwarded to the server, simulating slow upload or connection setup
- **Response delay** — pauses after the server response is received but before it's sent to the client, simulating slow download or server processing time

Both delays are additive: the total latency your app observes is `request delay + actual server time + response delay`.

Delays are applied per-rule based on URL pattern matching — you can target specific endpoints rather than throttling all traffic.

## Creating a Rule

1. Open the **Network Conditioning** tool from the toolbar
2. Click **Add Rule**
3. Fill in the rule details:
   - **Name** — a descriptive label (e.g., "Slow API")
   - **URL Pattern** — a glob pattern to match URLs (e.g., `https://api.example.com/*`)
   - **Method** — optionally restrict to a specific HTTP method (GET, POST, PUT, etc.), or leave as "Any" to match all methods
   - **Request Delay** — milliseconds to delay before sending the request (e.g., `500`)
   - **Response Delay** — milliseconds to delay before delivering the response (e.g., `500`)
4. Enable the rule

    ![Network conditioning window](@assets/generated/screenshots/features/network-conditioning/window.png)

:::tip
You can also create a rule by **right-clicking a request** in the request list and selecting the network conditioning option. The URL pattern will be pre-filled with a default of 500ms for each delay.
![Network Conditioning from requests list](@assets/guide/features/network-conditioning/network_conditioning_from_request.png)
:::

### Managing Rules

- **Toggle individual rules** on or off using the toggle switch next to each rule
- **Toggle all rules** at once using the global enable/disable button
- **Sort rules** by name, creation date, or last updated date
- **Edit** or **delete** rules at any time

When multiple rules match the same request, the oldest rule (earliest creation date) takes priority.

:::note
Free accounts are limited to **3 Network Conditioning rules**. Upgrade to Pro for unlimited rules.
:::

## Example Configurations

Here are some common delay values for simulating different conditions:

| Scenario | Request Delay | Response Delay |
|----------|--------------|----------------|
| Slow API response | 0 ms | 2000 ms |
| High-latency connection | 500 ms | 500 ms |
| Slow upload | 1000 ms | 0 ms |
| Very slow mobile | 1500 ms | 3000 ms |

## Use Cases

- **Performance testing** — verify your app loads acceptably when APIs are slow
- **Loading state testing** — ensure loading spinners and skeletons display correctly
- **Timeout testing** — verify timeout handling with high-latency conditions
- **Race condition debugging** — slow down specific requests to expose timing issues
- **Mobile simulation** — approximate slow mobile network conditions on desktop
