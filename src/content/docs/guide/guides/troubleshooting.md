---
title: Troubleshooting
description: Diagnose and fix common issues with WePROXA — proxy setup, HTTPS inspection, certificates, and performance.
---

This page collects the most common issues reported by WePROXA users and how to resolve them. If you're stuck after trying the fixes below, please open an issue on [GitHub](https://github.com/ennbou/weproxa.com/issues).

## Proxy Not Capturing Requests

**Symptoms**: the request list stays empty even though you're browsing.

Try in order:

1. **Is the proxy running?** Look for the green indicator in the toolbar. Toggle with `⌘ P` if needed.
2. **Is the system proxy enabled?** Click the network icon in the toolbar — WePROXA should show the system proxy as active.
3. **Does the browser respect the system proxy?** Safari always does. Firefox has its own proxy settings (set them to "Use system proxy settings"). Chrome uses system settings on macOS.
4. **Is an app using its own proxy / DNS?** Some CLIs (`curl`, `git`) respect environment variables (`HTTP_PROXY`, `HTTPS_PROXY`). In **Settings** → **Proxy Config**, click **Open Configured Terminal** to start a Terminal session with those variables set, or copy the export commands into your current shell.
5. **Is another tool already on the proxy port?** WePROXA will log a port-in-use error. Change the port in **Settings** → **Proxy**.

## HTTPS Requests Show as `CONNECT` Tunnels

When a host isn't in the SSL Interception list, WePROXA forwards the raw encrypted tunnel — you'll see a single `CONNECT` entry but no decrypted traffic.

**Fix**: add the host to SSL Interception Hosts (lock icon in the toolbar) or right-click the `CONNECT` request and choose **Enable SSL for {host}**. See [SSL Interception](/guide/guides/ssl-interception/).

## Browser or App Shows Certificate Errors

The device doesn't trust WePROXA's root CA.

- **On this Mac**: open **Settings** → **Certificates** → **Install to macOS Keychain** in WePROXA, or follow [Certificate Trust](/guide/guides/certificate-trust/) to trust it manually.
- **On a remote device**: see [Remote Devices](/guide/guides/remote-devices/) to install and trust the certificate over QR code.
- **Firefox**: uses its own certificate store. Enable `security.enterprise_roots.enabled` in `about:config`, or import the CA manually from **Settings** → **Privacy & Security** → **Certificates**.

## Some Apps Still Reject the Certificate (Certificate Pinning)

Apps that hard-code certificate fingerprints (pinning) will refuse WePROXA's dynamically generated certificates. This is by design — it's the security feature working as intended. Options:

- Test against a **staging build** that has pinning disabled.
- Use an **iOS Simulator** or rooted Android device with pinning-bypass tooling.
- Work on **non-pinned** endpoints where possible.

## System Proxy Not Restored After Quitting

WePROXA restores your previous macOS proxy settings on exit. If it was force-killed (e.g., the process crashed), the system proxy may still point to WePROXA.

Current versions disable the macOS proxy state, clear stale host and port fields, then disable it again so the system is left in a usable state even if cleanup is interrupted.

**Fix**: reopen WePROXA and quit normally, or disable the proxy manually in **System Settings** → **Network** → your connection → **Details** → **Proxies**. If you see old WePROXA host or port values but the proxy toggles are off, networking should still work; you can clear the stale values from the same macOS Proxies screen.

## Request List Feels Slow

WePROXA keeps up to 10,000 requests in memory. Large payload buffers plus thousands of rows can impact scrolling.

- Click **Clear** (`⌘ K`) to drop old entries.
- Use the [advanced filter](/guide/features/advanced-filtering/) to narrow the list to the traffic you care about.
- Collapse the details panel (`⌘ J`) when not needed.

## Remote Device Can't Reach the Mac

See [Remote Devices → Troubleshooting](/guide/guides/remote-devices/#troubleshooting). Most commonly:

- LAN access is disabled in **Settings** → **Remote Access**.
- macOS firewall is blocking incoming connections to WePROXA.
- Mac and the device are on different networks (e.g., the Mac on Wi-Fi, the phone on cellular).

## MCP Server Won't Start

- **Not on Pro** — starting the MCP server requires a Pro license. See [Pricing](/pricing/).
- **Port already in use** — change the port in **Settings** → **MCP**.
- **Wrong bearer token in the client** — copy the token from WePROXA again; it rotates when the server is restarted.

## Map Local Rule Doesn't Fire

- The rule is disabled. Toggle it on.
- The URL pattern doesn't match — patterns are glob-style (`*`), not regex. `https://api.example.com/users` won't match `api.example.com/users` (add `*` or the scheme).
- Another enabled rule matches first. The oldest rule wins when multiple patterns match.

## Breakpoint Never Fires

- The rule is disabled, or the global breakpoints toggle is off.
- The URL pattern is too narrow. Try a broader glob like `*example.com*`.
- You chose **response only** but the request didn't complete (e.g., it was blocked by a Block List rule).

## Still Stuck?

Include the following when opening a [GitHub issue](https://github.com/ennbou/weproxa.com/issues):

- WePROXA version (**Settings** → **About**)
- macOS version and chip (Apple Silicon / Intel)
- A short description of what you expected and what happened
- Steps to reproduce — ideally with a public URL, a mock server, or the command you're running
