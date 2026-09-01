---
title: Troubleshooting
description: Diagnose and fix common issues with WePROXA — proxy setup, HTTPS inspection, certificates, and performance.
---

This page collects the most common issues reported by WePROXA users and how to resolve them. If you're stuck after trying the fixes below, please open an issue on [GitHub](https://github.com/ennbou/weproxa.com/issues).

## Proxy Not Capturing Requests

**Symptoms**: the request list stays empty even though you're browsing.

Try in order:

1. **Is the proxy running?** Look for the green indicator in the toolbar. Toggle with `⌘ P` on macOS or `Ctrl + P` on Windows if needed.
2. **Was the system proxy configured?** Stop and restart capture with the toolbar play button — WePROXA configures the system proxy automatically when the proxy starts.
3. **Does the browser respect the system proxy?** Safari uses system settings on macOS, and Chrome and Edge use system settings on both macOS and Windows. Firefox has its own proxy settings unless you set it to "Use system proxy settings".
4. **Is an app using its own proxy / DNS?** Some CLIs (`curl`, `git`) respect environment variables (`HTTP_PROXY`, `HTTPS_PROXY`). In **Settings** → **Proxy Config**, open a configured terminal where available, or copy the terminal proxy commands into your current shell.
5. **Is another tool already on the proxy port?** WePROXA will log a port-in-use error. Change the port in **Settings** → **Proxy Config**.

## HTTPS Requests Show as `CONNECT` Tunnels

When a host isn't in the SSL Interception list, WePROXA forwards the raw encrypted tunnel — you'll see a single `CONNECT` entry but no decrypted traffic.

**Fix**: add the host to SSL Interception Hosts (lock icon in the toolbar) or right-click the `CONNECT` request and choose **Enable SSL for {host}**. See [SSL Interception](/guide/guides/ssl-interception/).

## Browser or App Shows Certificate Errors

The device doesn't trust WePROXA's root CA.

- **On macOS**: open **Settings** → **CA Certificate** and install the WePROXA Root CA, or follow [Certificate Trust](/guide/guides/certificate-trust/) to trust it manually.
- **On Windows**: open **Settings** → **CA Certificate** and choose **Learn More**, or read [Windows HTTPS Certificate Setup](/guide/guides/windows-https-certificate-setup/) before deciding whether to trust a local CA.
- **On a remote device**: see [Remote Devices](/guide/guides/remote-devices/) to install and trust the certificate over QR code.
- **Firefox**: uses its own certificate store. Enable `security.enterprise_roots.enabled` in `about:config`, or import the CA manually from **Settings** → **Privacy & Security** → **Certificates**.

## Some Apps Still Reject the Certificate (Certificate Pinning)

Apps that hard-code certificate fingerprints (pinning) will refuse WePROXA's dynamically generated certificates. This is by design — it's the security feature working as intended. Options:

- Test against a **staging build** that has pinning disabled.
- Use an **iOS Simulator** or rooted Android device with pinning-bypass tooling.
- Work on **non-pinned** endpoints where possible.

## System Proxy Not Restored After Quitting

WePROXA restores your previous system proxy settings on exit. If it was force-killed (e.g., the process crashed), the system proxy may still point to WePROXA.

Current versions reset proxy state in platform-specific ways so the system is left in a usable state even if cleanup is interrupted.

**Fix**: reopen WePROXA and quit normally. On macOS, you can also disable the proxy manually in **System Settings** → **Network** → your connection → **Details** → **Proxies**. On Windows, open **Settings** → **Network & internet** → **Proxy** and turn off manual proxy setup, or clear the stale WePROXA host and port.

## Window Flashes While Resizing

WePROXA synchronizes the macOS window backdrop during size changes and reapplies the measured title-bar alignment after native move, resize, and fullscreen events. If you still see rendering flashes or the red, yellow, and green traffic-light controls drift vertically, update to the latest build and include your macOS version, display scale, and whether the window was maximized when reporting the issue.

## Request List Feels Slow

WePROXA keeps up to 10,000 requests in memory. Large payload buffers plus thousands of rows can impact scrolling.

- Click **Clear** (`⌘ K`) to drop old entries.
- Use the [advanced filter](/guide/features/advanced-filtering/) to narrow the list to the traffic you care about.
- Collapse the details panel (`⌘ J`) when not needed.

## Requests Return 503 or 504 Under Tunnel Load

WePROXA bounds long-lived CONNECT, WebSocket, and upgraded tunnels from the process capacity available at startup. If that global budget is full, a new tunnel is refused with `503 Service Unavailable` and a message naming the concurrent-tunnel limit instead of waiting indefinitely or exhausting resources for every connection.

Close unused browser tabs, WebSockets, emulators, or devices that are holding tunnels open, then let the client retry. Repeated overload warnings are rate-limited, so one warning can represent several refusals during the same busy interval.

A `504 Gateway Timeout` instead means DNS resolution, a direct TCP connection, or a parent-proxy dial exceeded its bounded deadline. Check the destination hostname, network reachability, VPN, and parent proxy. The timeout closes the pending dial so stalled upstreams do not permanently consume tunnel capacity.

## Remote Device Can't Reach This Computer

See [Remote Devices → Troubleshooting](/guide/guides/remote-devices/#troubleshooting). Most commonly:

- LAN access is disabled in **Settings** → **Remote Access**.
- The firewall is blocking incoming connections to WePROXA.
- The computer and the device are on different networks (e.g., the computer on Wi-Fi, the phone on cellular).

## macOS Local Network Permission Prompt

macOS asks apps for permission before they access the local network. WePROXA only triggers this prompt when it actually needs LAN access — for example, when you enable **Allow LAN access** in **Settings** → **Remote Access**. If you only capture traffic from the local machine, WePROXA avoids the prompt entirely. If you previously denied it and now want remote-device capture, allow WePROXA under **System Settings** → **Privacy & Security** → **Local Network**.

## Upstream (Origin) Server Certificate Errors

If a decrypted host fails with a certificate error that isn't about the WePROXA Root CA, WePROXA could not verify the **origin server's** certificate. Current versions mirror the origin's trust, hostname, or validity failure so the client shows its normal certificate warning instead of receiving a generic proxy error.

On macOS, verification uses the system trust store. Add a private or internal CA to macOS system trust when you administer and trust it. If a user or client explicitly proceeds past a warning, WePROXA accepts only that exact origin certificate; a changed invalid certificate must be reviewed again. See [SSL Interception → How WePROXA Trusts Upstream Servers](/guide/guides/ssl-interception/#how-weproxa-trusts-upstream-servers).

## MCP Server Won't Start

- **Not on Pro** — starting the MCP server requires a Pro license. See [Pricing](/pricing/).
- **Bundled helper unavailable** — use an installed build that includes `weproxa-mcp`. Development or incomplete packaging builds may not provide a command WePROXA can advertise.
- **Stale client command** — moving or replacing the app can invalidate an older machine-specific helper path. Start the server, then copy a fresh stdio configuration from **Settings → MCP Server → AI Connections**.
- **Old HTTP configuration** — remove `url`, `headers`, and bearer-token settings left from versions before 3.8.0. The current transport launches the local helper command and uses no TCP port or token.

## Map Local Rule Doesn't Fire

- The rule is disabled. Toggle it on.
- The URL pattern doesn't match — patterns are glob-style (`*`), not regex. `https://api.example.com/users` won't match `api.example.com/users` (add `*` or the scheme).
- Another enabled rule matches first. Higher [priority](/guide/features/map-local/#rule-precedence) wins, and within one priority band the oldest rule wins. The rule listed first in the panel is the one that will answer.
- The rule has [request match conditions](/guide/features/map-local/#request-match-conditions) that don't all hold. Every condition must match, and a request body that isn't valid JSON satisfies no JSON path condition — including `absent`.
- The rule sits under a tool the active Scenario switched off. Activation reports these as warnings.
- The host isn't decrypted, so there is nothing to match against. A `CONNECT` entry with no decrypted traffic can never match a rule — see above.

Check the response's **Answering rule** in the details panel to see which rule actually replied, and the rule's hit count (via `weproxa_rules_list`) to confirm whether it ever fired at all.

## Every Request Returns 403

If requests fail with a `403` carrying an `X-WePROXA-Passthrough` header, [Pass-Through containment](/guide/features/pass-through/) is sealing the proxy — WePROXA refused to forward the request rather than an origin rejecting it.

- Read the current mode with `weproxa_passthrough_getMode` and set it back to `allow` when the run is over.
- Under `denyUnmatched`, a **disabled Map Local tool** means no rule can match, so every request is denied.
- Containment never survives a restart. If it is active, something in this session set it.

## A Settings or Rules File Was Corrupted

If a state file cannot be parsed at startup — after a crash, a full disk, or an external edit — WePROXA moves it aside instead of silently overwriting it, and starts with that file's defaults.

The original bytes are preserved next to the file with a `.corrupt-<timestamp>` suffix, in the app data directory. Recover values from it by hand if you need them; WePROXA never reads a quarantined file again, and it is safe to delete once you are done. The failure is also logged with both paths.

State files are written atomically — to a temporary sibling that is then renamed over the target — so an interrupted write leaves either the whole old file or the whole new one, never a half-written mix.

## Breakpoint Never Fires

- The rule is disabled, or the global breakpoints toggle is off.
- The URL pattern is too narrow. Try a broader glob like `*example.com*`.
- You chose **response only** but the request didn't complete (e.g., it was blocked by a Block List rule).

## Reset WePROXA to Defaults

If WePROXA ends up in a confusing state, you can start fresh. Open **Settings** → **Reset** and choose **Reset all settings**. This clears every setting, preference, and workspace rule — theme, language, layout, proxy config, SSL hosts, MCP server state, breakpoints, Map Local, block list, throttling, and scripts — then restarts the app.

Your **license**, **installed certificate**, and **saved requests** are preserved. The reset cannot be undone, so WePROXA asks you to confirm first.

## Still Stuck?

You can find your build details and check for updates in **Settings** → **About**. The same panel links Windows users to the macOS installation guide and links users on other platforms to WePROXA in the Microsoft Store.

![WePROXA About settings](@assets/generated/screenshots/settings/about.png)

Include the following when opening a [GitHub issue](https://github.com/ennbou/weproxa.com/issues):

- WePROXA version and the build commit shown next to it (**Settings** → **About**)
- Operating system version and hardware details (macOS Apple Silicon / Intel, or Windows version)
- A short description of what you expected and what happened
- Steps to reproduce — ideally with a public URL, a mock server, or the command you're running
