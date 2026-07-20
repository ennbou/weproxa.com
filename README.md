# 🌐 WePROXA

**The native macOS and Windows HTTP/HTTPS proxy debugger**

WePROXA is a native macOS and Windows proxy debugger for inspecting, intercepting, and replaying HTTP and HTTPS traffic. It gives you a fast, focused way to understand requests and responses, test edge cases, swap remote assets with local files, and capture traffic from browsers, apps, simulators, and real devices.

---

## 🚀 Install from Terminal

On macOS, download and install the latest WePROXA release in one command:

```sh
curl -fsSL https://weproxa.com/i | bash
```

## 💻 System Requirements

- **macOS** 11.0 (Big Sur) or later
- **Architecture**: Apple Silicon (M1/M2/M3) or Intel Mac
- **Windows** 10 or 11, installed from the [Microsoft Store](https://apps.microsoft.com/detail/9p9npx1zvrjs)

## ✨ Why WePROXA?

WePROXA combines a native desktop interface with a **Rust backend** through Tauri, so the app stays responsive even when you're inspecting larger sessions or working across multiple tools. It is built for day-to-day API debugging, local development, QA verification, mobile testing, and troubleshooting traffic from real devices.

It's especially useful for:

- 🐞 API debugging
-  Local development
-  QA validation
- 📱 Mobile and simulator traffic inspection

## 🛠️ Main Features

- 🔎 **Deep inspection**: See request and response headers, bodies, status, timing, and connection details in one focused interface.
-  **Breakpoints and interception**: Pause traffic before it reaches the server or client, then edit requests and responses in place.
-  **Request replay**: Resend captured requests immediately or open them in the repeat editor to test variations safely.
-  **HTTPS inspection**: Generate and trust a local certificate on macOS or Windows so encrypted traffic can be inspected when needed.
-  **Map Local**: Replace remote resources with local files to prototype UI changes, mock assets, or test fixes without touching the backend.
-  **Workspaces**: Keep Map Local, Breakpoints, Block List, Network Conditioning, and Scripting rules isolated by project or test scenario.
-  **Scenarios**: Activate and share the exact Workspace rules and tool states for one acceptance criterion.
-  **Scripting**: Automate matching request and response changes with reusable Rhai rules and runtime diagnostics.
-  **Block List and Network Conditioning**: Block matching traffic or add request and response delays to reproduce failure and latency conditions.
-  **WebSocket inspection**: Follow upgraded connections frame by frame, including readable compressed messages.
-  **Advanced filtering**: Narrow large traffic sessions by method, host, path, status code, headers, or body content.
-  **Network performance metrics**: Inspect detailed timing phases and waterfalls for captured requests.
-  **Side-by-side diff**: Compare two requests or responses to quickly spot changes in payloads, headers, or behavior.
-  **Remote device capture**: Inspect traffic from phones, tablets, simulators, and other devices on your local network.
-  **MCP integration**: Let compatible AI clients manage proxy state, tool rules, SSL hosts, and tool enabled states.

## ⚡ Quick Start

1. **Install** WePROXA using the macOS terminal command above or from the [Microsoft Store](https://apps.microsoft.com/detail/9p9npx1zvrjs) on Windows.
2. **Launch** the app from your Applications folder or Start menu.
3. **Start** the proxy by clicking the toolbar play button or pressing `⌘ + P` on macOS or `Ctrl + P` on Windows.
4. **Enable** the system proxy via the network button in the toolbar.
5. **Trust** the WePROXA root certificate if you want to inspect HTTPS traffic.
6. **Intercept** by adding a target host to the SSL interception list, then use your browser or app normally.
7. **Inspect** any captured request to review its headers, body, timing, and response details.

## 📚 Documentation

If you want the full setup guide, screenshots, and feature walkthroughs, start here:

- 🏠 [**Home**](https://weproxa.com)
-  [Installation macOS](https://weproxa.com/guide/getting-started/installation/)
-  [Installation Windows](https://weproxa.com/guide/getting-started/installation-windows/)
-  [Microsoft Store](https://apps.microsoft.com/detail/9p9npx1zvrjs)
-  [Quick Start](https://weproxa.com/guide/getting-started/quick-start/)
-  [Inspect Requests](https://weproxa.com/guide/features/inspect-requests/)
-  [Workspaces](https://weproxa.com/guide/features/workspaces/)
-  [Scenarios](https://weproxa.com/guide/features/scenarios/)
-  [WebSocket Inspection](https://weproxa.com/guide/features/websocket-inspection/)
-  [Breakpoints](https://weproxa.com/guide/features/breakpoints/)
-  [Map Local](https://weproxa.com/guide/features/map-local/)
-  [Block List](https://weproxa.com/guide/features/block-list/)
-  [Network Conditioning](https://weproxa.com/guide/features/network-conditioning/)
-  [Scripting](https://weproxa.com/guide/features/scripting/)
-  [Repeat Requests](https://weproxa.com/guide/features/repeat-requests/)
-  [Advanced Filtering](https://weproxa.com/guide/features/advanced-filtering/)
-  [Network Performance Metrics](https://weproxa.com/guide/features/network-performance-metrics/)
-  [Diff Requests](https://weproxa.com/guide/features/diff-requests/)
-  [Remote Devices](https://weproxa.com/guide/guides/remote-devices/)
-  [MCP Integration](https://weproxa.com/guide/guides/mcp-integration/)

## 💡 Typical Use Cases

- **Frontend and mobile development**: Trace API calls in real time while building screens, flows, and integrations.
- **Edge-case testing**: Modify headers, payloads, and responses to simulate failures or unusual server behavior.
- **UI iteration**: Replace CDN or backend assets with local files to preview changes without redeploying anything.
- **Cross-device inspection**: Monitor HTTPS traffic from iOS simulators, Android emulators, and physical devices.
- **Regression hunting**: Compare similar requests to understand why behavior changed between two runs.

## 📌 Notes

- **HTTPS inspection** requires trusting the auto-generated WePROXA root certificate in your operating system trust store.
- **Custom proxy settings** may still be needed for apps or CLI tools that do not use the system proxy.
- For screenshots, detailed setup help, and guided walkthroughs, visit the [official documentation](https://weproxa.com).
