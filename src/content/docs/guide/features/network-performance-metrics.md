---
title: Network Performance Metrics
description: Analyze request timing with detailed performance breakdowns.
---

Network Performance Metrics gives you a detailed timing breakdown for every intercepted request, helping you identify exactly where latency is introduced in the network stack.

:::note
Network Performance Metrics is a **Pro feature**. Free users can see the Timing tab but the data is blurred — upgrade to Pro to unlock full access.
:::

## How It Works

When Weproxa intercepts a request, it measures each phase of the network lifecycle and records precise timing data. This data is displayed as an interactive waterfall chart inside the request details panel.

The following phases are measured:

| Phase | Description |
|-------|-------------|
| **DNS Resolution** | Time to resolve the hostname to an IP address |
| **TCP Connect** | Time to establish a TCP connection to the server |
| **TLS Handshake** | Time to complete the TLS/SSL handshake (HTTPS only) |
| **TTFB** | Time to First Byte — time from sending the request to receiving the first byte of the response |

## Viewing Timing Data

1. Select a completed request in the request list
2. In the response section of the details panel, click the **Timing** tab
3. You'll see:
   - A **waterfall bar** showing the relative duration of each phase, color-coded for quick identification
   - A **detail table** listing each phase with its exact duration

Hover over any segment in the waterfall bar to see the phase name and exact timing.

## Reading the Waterfall

The waterfall bar visualizes how time is distributed across the network phases:

- 🟢 **Teal** — DNS Resolution
- 🟠 **Orange** — TCP Connect
- 🟣 **Purple** — TLS Handshake
- 🔵 **Blue** — TTFB

The total time displayed is the sum of all measured phases. Phases that don't apply (e.g., TLS Handshake for plain HTTP requests) are automatically omitted.

## Use Cases

### Diagnosing Slow Requests

If a request feels slow, the timing breakdown helps you pinpoint the bottleneck:

- **High DNS Resolution** — DNS server may be slow or the hostname isn't cached. Consider using a faster DNS resolver.
- **High TCP Connect** — The server may be geographically distant or experiencing connection issues.
- **High TLS Handshake** — Certificate chain verification or key exchange may be slow. Check if the server supports TLS session resumption.
- **High TTFB** — The server is taking a long time to generate the response. This usually points to backend processing delays.

### Comparing Endpoints

Select different requests to compare their timing profiles. This is useful for:

- Identifying which API endpoints are slowest
- Verifying that caching is reducing response times
- Checking whether a CDN is improving latency

### Before and After Testing

Use timing data alongside [Network Conditioning](/guide/features/network-conditioning/) to validate how your application handles different latency profiles, then measure the real performance to compare.
