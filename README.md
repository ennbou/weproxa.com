# 🌐 WePROXA

**The native macOS HTTP/HTTPS proxy debugger**

WePROXA is a native macOS proxy debugger for inspecting, intercepting, and replaying HTTP and HTTPS traffic. It gives you a fast, focused way to understand requests and responses, test edge cases, swap remote assets with local files, and capture traffic from browsers, apps, simulators, and real devices.

---

## 🚀 Install from Terminal

Download and install the latest WePROXA release in one command:

```sh
curl -fsSL https://weproxa.com/i | bash
```

## 💻 System Requirements

- **macOS** 11.0 (Big Sur) or later
- **Architecture**: Apple Silicon (M1/M2/M3) or Intel Mac

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
-  **HTTPS inspection**: Generate and trust a local certificate on macOS so encrypted traffic can be inspected when needed.
-  **Map Local**: Replace remote resources with local files to prototype UI changes, mock assets, or test fixes without touching the backend.
-  **Advanced filtering**: Narrow large traffic sessions by method, host, path, status code, headers, or body content.
-  **Side-by-side diff**: Compare two requests or responses to quickly spot changes in payloads, headers, or behavior.
-  **Remote device capture**: Inspect traffic from phones, tablets, simulators, and other devices on your local network.

## ⚡ Quick Start

1. **Install** WePROXA using the terminal command above.
2. **Launch** the app from your Applications folder.
3. **Start** the proxy by clicking the toolbar play button or pressing `⌘ + P`.
4. **Enable** the system proxy via the network button in the toolbar.
5. **Trust** the WePROXA root certificate if you want to inspect HTTPS traffic.
6. **Intercept** by adding a target host to the SSL interception list, then use your browser or app normally.
7. **Inspect** any captured request to review its headers, body, timing, and response details.

## 📚 Documentation

If you want the full setup guide, screenshots, and feature walkthroughs, start here:

- 🏠 [**Home**](https://weproxa.com)
-  [Installation](https://weproxa.com/guide/getting-started/installation/)
-  [Quick Start](https://weproxa.com/guide/getting-started/quick-start/)
-  [Inspect Requests](https://weproxa.com/guide/features/inspect-requests/)
-  [Breakpoints](https://weproxa.com/guide/features/breakpoints/)
-  [Map Local](https://weproxa.com/guide/features/map-local/)
-  [Repeat Requests](https://weproxa.com/guide/features/repeat-requests/)
-  [Advanced Filtering](https://weproxa.com/guide/features/advanced-filtering/)
-  [Diff Requests](https://weproxa.com/guide/features/diff-requests/)

## 💡 Typical Use Cases

- **Frontend and mobile development**: Trace API calls in real time while building screens, flows, and integrations.
- **Edge-case testing**: Modify headers, payloads, and responses to simulate failures or unusual server behavior.
- **UI iteration**: Replace CDN or backend assets with local files to preview changes without redeploying anything.
- **Cross-device inspection**: Monitor HTTPS traffic from iOS simulators, Android emulators, and physical devices.
- **Regression hunting**: Compare similar requests to understand why behavior changed between two runs.

## 📌 Notes

- **HTTPS inspection** requires trusting the auto-generated WePROXA root certificate in your macOS Keychain.
- **Custom proxy settings** may still be needed for apps or CLI tools that do not use the macOS system proxy.
- For screenshots, detailed setup help, and guided walkthroughs, visit the [official documentation](https://weproxa.com).

