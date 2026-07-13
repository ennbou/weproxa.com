---
title: Troubleshooting
description: Diagnose and fix common issues with WePROXA — proxy setup, HTTPS inspection, certificates, and performance.
---

This page collects the most common issues reported by WePROXA users and how to resolve them. If you're stuck after trying the fixes below, please open an issue on [GitHub](https://github.com/ennbou/weproxa.com/issues).

## Proxy Not Capturing Requests

**Symptoms**: the request list stays empty even though you're browsing.

Try in order:

1. **Is the proxy running?** Look for the green indicator in the toolbar. Toggle with `⌘ P` on macOS or `Ctrl + P` on Windows if needed.
2. **Is the system proxy enabled?** Click the network icon in the toolbar — WePROXA should show the system proxy as active.
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

WePROXA 3.0.0 improves macOS resize and maximize behavior by synchronizing the window backdrop during size changes. If you still see rendering flashes, update to the latest build and include your macOS version, display scale, and whether the window was maximized when reporting the issue.

## Request List Feels Slow

WePROXA keeps up to 10,000 requests in memory. Large payload buffers plus thousands of rows can impact scrolling.

- Click **Clear** (`⌘ K`) to drop old entries.
- Use the [advanced filter](/guide/features/advanced-filtering/) to narrow the list to the traffic you care about.
- Collapse the details panel (`⌘ J`) when not needed.

## Remote Device Can't Reach This Computer

See [Remote Devices → Troubleshooting](/guide/guides/remote-devices/#troubleshooting). Most commonly:

- LAN access is disabled in **Settings** → **Remote Access**.
- The firewall is blocking incoming connections to WePROXA.
- The computer and the device are on different networks (e.g., the computer on Wi-Fi, the phone on cellular).

## macOS Local Network Permission Prompt

macOS asks apps for permission before they access the local network. WePROXA only triggers this prompt when it actually needs LAN access — for example, when you enable **Allow LAN access** in **Settings** → **Remote Access**. If you only capture traffic from the local machine, WePROXA avoids the prompt entirely. If you previously denied it and now want remote-device capture, allow WePROXA under **System Settings** → **Privacy & Security** → **Local Network**.

## Upstream (Origin) Server Certificate Errors

If a decrypted host fails with a certificate error that isn't about the WePROXA Root CA, WePROXA could not verify the **origin server's** certificate. On macOS, this verification uses the system trust store, so add the server's private or internal CA to macOS system trust. See [SSL Interception → How WePROXA Trusts Upstream Servers](/guide/guides/ssl-interception/#how-weproxa-trusts-upstream-servers).

## MCP Server Won't Start

- **Not on Pro** — starting the MCP server requires a Pro license. See [Pricing](/pricing/).
- **Port range unavailable** — WePROXA starts at its preferred local port and automatically tries subsequent ports. Close conflicting local services, start the MCP server again, and use the exact **Endpoint URL** shown in **Settings** → **MCP Server**.
- **Wrong bearer token in the client** — copy the **Auth Token** from WePROXA again. The token persists across server restarts and changes only when you choose **Regenerate Token**.

## Map Local Rule Doesn't Fire

- The rule is disabled. Toggle it on.
- The URL pattern doesn't match — patterns are glob-style (`*`), not regex. `https://api.example.com/users` won't match `api.example.com/users` (add `*` or the scheme).
- Another enabled rule matches first. The oldest rule wins when multiple patterns match.

## Breakpoint Never Fires

- The rule is disabled, or the global breakpoints toggle is off.
- The URL pattern is too narrow. Try a broader glob like `*example.com*`.
- You chose **response only** but the request didn't complete (e.g., it was blocked by a Block List rule).

## Still Stuck?

You can find your build details and check for updates in **Settings** → **About**.

![WePROXA About settings](@assets/generated/screenshots/settings/about.png)

Include the following when opening a [GitHub issue](https://github.com/ennbou/weproxa.com/issues):

- WePROXA version (**Settings** → **About**)
- Operating system version and hardware details (macOS Apple Silicon / Intel, or Windows version)
- A short description of what you expected and what happened
- Steps to reproduce — ideally with a public URL, a mock server, or the command you're running
