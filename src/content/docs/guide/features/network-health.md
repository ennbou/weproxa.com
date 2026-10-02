---
title: Network Health Monitoring
description: Detect proxy and network changes that can interrupt capture, with configurable in-app and desktop alerts.
---

Network health monitoring watches the local conditions WePROXA depends on and alerts you when capture may have stopped working. It is opt-in, runs only while WePROXA is open, and never changes your proxy or network settings.

## Enable Monitoring

1. Open **Settings → Network health**.
2. Turn on **Monitor network health**.
3. Enable the checks that matter for your setup.
4. Optionally enable **Desktop notifications** and use **Test notification** to confirm operating-system delivery.

Monitoring is off by default. Your selected checks and notification preferences are saved between launches.

## Available Checks

| Check | What it watches |
|---|---|
| **Unexpected proxy stops** | Alerts when a proxy that WePROXA expected to keep running exits unexpectedly. Stopping capture yourself does not trigger it. |
| **Proxy not responding** | Sends an authenticated loopback request through the active local listener to confirm the proxy service answers. The probe is excluded from capture and rules. |
| **System proxy conflicts** | Detects HTTP or HTTPS proxy settings changed by another app, a VPN, a PAC file, or a network switch. It runs only when WePROXA was asked to configure the system proxy. |
| **Local IP address changes** | Reports when the address advertised for remote-device setup changes or disappears. |
| **Network route changes** | Reports changes to the default IPv4 interface or gateway, including some VPN transitions. A route change is informational and does not necessarily mean capture failed. |
| **Internet connectivity warnings** | Opt-in direct TCP checks to Cloudflare and Google endpoints on port 443. No HTTP payload, captured request, proxy rule, or Pass-Through policy is involved. |

The settings screen hides checks that the current platform cannot perform. System proxy conflict checks are available on macOS and Windows; default-route change detection is currently available on macOS.

:::note
Internet connectivity warnings test direct reachability, not every DNS, TLS, VPN, captive-portal, firewall, or upstream-server failure. A network that blocks the test endpoints can produce a warning even when other destinations remain reachable.
:::

## Confirmation and Alert Timing

Checks run about every 30 seconds. A failure, recovery, or network change must be observed twice, at least 20 seconds apart, before WePROXA reports it. This avoids alerting on brief transitions while Wi-Fi, a VPN, or the proxy is restarting.

An ongoing issue alerts once. Recurring alerts of the same type have a five-minute cooldown. Unknown results are shown as unavailable rather than treated as healthy, and an unavailable check does not silently clear an existing issue.

## In-App and Desktop Alerts

Confirmed events appear as in-app alerts and in **Current health checks**. The panel shows:

- active issues and the action suggested for each one;
- the time of the latest completed check;
- checks that could not be inspected;
- up to 20 recent events from the current app session.

Desktop notifications are optional. They can alert while the main window is closed or in the background, but WePROXA must still be running. Operating-system notification permissions, Focus, or Do Not Disturb can suppress delivery; in-app status and recent events remain available when that happens.

Enable **Notify when an issue clears** to receive a recovery alert after the same repeated-check confirmation. Use **Test notification** after granting permission to verify the native delivery path.

## What to Do When an Alert Appears

- **Proxy stopped** — return to WePROXA and restart capture. If it stops again, review the app logs and the action that preceded the exit.
- **Proxy not responding** — restart the proxy and confirm the configured port is not held by another process.
- **System proxy conflict** — decide which proxy or VPN should own the system settings, then restart capture or disable the conflicting configuration.
- **Local IP changed** — update the proxy address on remote devices and reopen the certificate setup URL if needed.
- **Network route changed** — verify that the intended Wi-Fi, Ethernet, or VPN route is active.
- **Internet unreachable** — check Wi-Fi, VPN, firewall, and captive-portal sign-in before treating an upstream API as down.

For capture-specific diagnostics, continue with [Troubleshooting](/guide/guides/troubleshooting/).
