---
title: Settings
description: Every section of the WePROXA Settings window, plus updates, deep links, and where WePROXA stores its data.
---

Open Settings with `⌘ ,` on macOS or `Ctrl + ,` on Windows, from the app menu, or from the tray. Settings opens in its own window, and a [`weproxa://` link](#deep-links) can open it on a specific section.

| Section | What it holds | Read more |
|---|---|---|
| **Appearance** | Tray icon, style, brightness, font size, language, toolbar buttons | [Appearance](#appearance) |
| **Proxy Config** | Port, auto-start, terminal setup, TLS passthrough hosts | [Proxy Config](#proxy-config) |
| **Network health** | Health checks and alerts | [Network Health Monitoring](/guide/features/network-health/) |
| **CA Certificate** | Certificate details, install, download, regenerate, remove | [CA Certificate](#ca-certificate) |
| **Remote Access** | LAN proxy address, certificate setup page, PAC URL | [Remote Devices](/guide/guides/remote-devices/) |
| **MCP Server** (Pro) | AI client connections and privacy | [MCP Integration](/guide/guides/mcp-integration/) |
| **License** | Activate, revalidate, or deactivate a Pro license | [License](#license) |
| **Keyboard Shortcuts** | The most common shortcuts | [Keyboard Shortcuts](/guide/guides/keyboard-shortcuts/) |
| **About** | Version, build, and links | [About](#about) |
| **Reset** | Factory reset | [Reset](#reset) |

## Appearance

- **Show tray icon** keeps WePROXA in the menu bar on macOS or the notification area on Windows. See [Show or Hide the Tray Icon](/guide/guides/tray-and-toolbar/#show-or-hide-the-tray-icon).
- **Style** picks the color palette. **Colorized** is the default. **Blueprint** is a Pro style. Without an active Pro license its button is locked, and a saved Blueprint choice shows as Colorized until the license is active again.
- **Brightness** is **Light**, **Dark**, or **System**. It also sets the native window chrome. See [Theme and Native Window Chrome](/guide/guides/tray-and-toolbar/#theme-and-native-window-chrome).
- **Font Size** is **Small** (12 px), **Medium** (14 px, the default), or **Large** (16 px). `⌘ +` and `⌘ -` (`Ctrl +` and `Ctrl -` on Windows) step through the same three sizes.
- **Language** is **English** or **Français**. It also covers the menu bar, the tray, and window titles. See [Appearance and Language](/guide/guides/tray-and-toolbar/#appearance-and-language).
- **Toolbar Tools** chooses which tool buttons the toolbar shows. Hidden tools stay in the app menu. See [Customize Visible Tool Buttons](/guide/guides/tray-and-toolbar/#customize-visible-tool-buttons).
- **Show workspace and scenario switcher** adds the active Workspace and Scenario to the toolbar. See [Show the Workspace and Scenario Switcher](/guide/guides/tray-and-toolbar/#show-the-workspace-and-scenario-switcher).

## Proxy Config

![WePROXA Proxy Config settings](@assets/generated/screenshots/settings/proxy.png)

- **Status** and **Address** show whether the proxy is running and where clients should send traffic.
- **Port** accepts any value from `1024` to `65535`. Stop the proxy before you change it. WePROXA saves the port and uses it on the next start.
- **Auto-start proxy on launch** starts capture when WePROXA opens. See [Auto-start Behavior](/guide/getting-started/quick-start/#auto-start-behavior).
- **Terminal** opens a terminal with the proxy variables already set, or copies them for your current shell. See [Terminal Proxy Setup](/guide/getting-started/quick-start/#terminal-proxy-setup).
- **TLS passthrough hosts** stay tunneled even when SSL interception covers a whole app. See [TLS Passthrough Hosts](/guide/guides/ssl-interception/#tls-passthrough-hosts).

## CA Certificate

![WePROXA CA Certificate settings](@assets/generated/screenshots/settings/certificate.png)

The top of the section shows the **Certificate Path** with a copy button, and the dates the certificate was generated and stays valid until. On macOS it also shows the **Trust status**.

The buttons depend on your platform:

| Button | Platform | What it does |
|---|---|---|
| **Download certificate** | macOS, Windows | Saves a copy of the CA certificate where you choose |
| **Open Location** | macOS | Shows the certificate file in Finder |
| **Install to macOS** | macOS | Installs and trusts the certificate in the System keychain. See [Certificate Trust](/guide/guides/certificate-trust/) |
| **Install to iOS Simulator** | macOS | Installs the certificate on booted iOS simulators. See [iOS Simulator](/guide/guides/ios-simulator/) |
| **Learn More** | Windows | Opens [Windows HTTPS Certificate Setup](/guide/guides/windows-https-certificate-setup/) |

**Certificate lifecycle** holds **Generate certificate** (or **Regenerate certificate** when one exists) and **Remove local certificate**. Stop the proxy before you use either one. A regenerated certificate is a new identity, so you must install and trust it again on every device. See [Managing the Certificate Lifecycle](/guide/guides/certificate-trust/#managing-the-certificate-lifecycle).

## License

Paste a key into **License Key** and click **Activate**. An active license shows its details and two buttons:

- **Revalidate** checks the license again with the license server.
- **Deactivate** frees this machine's activation, for example before you move the license to another computer.

See [What license details does WePROXA show?](/guide/faq/#what-license-details-does-weproxa-show) and [Pricing](/pricing/).

## About

![WePROXA About settings](@assets/generated/screenshots/settings/about.png)

About shows your version and the exact build commit next to it. Include both when you report a problem. It also links to WePROXA for the other platform (the Microsoft Store from macOS, the macOS install guide from Windows), and to WePROXA on LinkedIn and X.

## Reset

**Reset all settings** returns WePROXA to its factory defaults and restarts the app. Your license, CA certificate, and saved requests stay. Everything else is deleted, including every Workspace rule. See [Reset WePROXA to Defaults](/guide/guides/troubleshooting/#reset-weproxa-to-defaults).

## Updates

On macOS, WePROXA checks for a new version each time it starts. When one is available, an **Update Available** dialog shows the new version, its release date, and its release notes.

- **Install & Restart** downloads and installs the update, then restarts WePROXA.
- **Later** closes the dialog. WePROXA asks again the next time it starts.
- A required update has no **Later** button. Install it to keep using WePROXA.

If the download or install fails, the dialog shows an error and the button lets you try again.

On Windows, the Microsoft Store installs updates. See [Installation Windows](/guide/getting-started/installation-windows/).

## Deep Links

WePROXA registers the `weproxa://` URL scheme. Open one of these links in a browser, a chat message, or a terminal (`open 'weproxa://settings/license'` on macOS), and WePROXA comes to the front and acts on it. If WePROXA is not running, the link starts it first.

| Link | What it does |
|---|---|
| `weproxa://settings` | Opens Settings |
| `weproxa://settings/<section>` | Opens Settings on one section |
| `weproxa://settings?section=<section>` | Same as above |
| `weproxa://activate?key=<license-key>` | Activates a Pro license. If activation fails, WePROXA opens **License** so you can see the error and retry |
| `weproxa://activate/<license-key>` | Same as above |
| `weproxa://mcp/connect?client=<client>` | Opens **MCP Server** with an AI client's setup selected |
| `weproxa://mcp/connect?client=<client>&scope=<scope>` | Same, with the configuration scope selected |

Section names are `theme` (Appearance), `proxy`, `networkHealth`, `certificate`, `remoteAccess`, `mcpServer`, `license`, `shortcuts`, `about`, and `reset`.

For `mcp/connect`, `client` is one of `vscode`, `cursor`, `codex`, `claude-code`, or `jetbrains`, and `scope` is `user` or `workspace`. The link only selects the setup to show. It never starts the MCP server or writes a configuration, and WePROXA ignores a link that carries any other field. See [Generate the configuration inside WePROXA](/guide/guides/mcp-integration/#generate-the-configuration-inside-weproxa).

## Where WePROXA Stores Its Data

WePROXA keeps its settings, rules, Workspaces, saved requests, license file, and CA certificate files in its data folder:

| Platform | Data folder |
|---|---|
| macOS | `~/Library/Application Support/com.ennbou.weproxa` |
| Windows | `%APPDATA%\com.ennbou.weproxa` |

On macOS, WePROXA also keeps cached data in `~/Library/Caches/com.ennbou.weproxa`, window and layout preferences in `~/Library/WebKit/com.ennbou.weproxa`, and a small `~/Library/Preferences/com.ennbou.weproxa.plist` file. On Windows, the window and layout preferences live in `%LOCALAPPDATA%\com.ennbou.weproxa`.

Uninstalling WePROXA does not delete these folders, on either platform. Keep them private. They hold the CA private key, which can decrypt any traffic your devices send through WePROXA. To remove them, see [Uninstall on macOS](/guide/getting-started/installation/#uninstall) or [Uninstall on Windows](/guide/getting-started/installation-windows/#uninstall).
