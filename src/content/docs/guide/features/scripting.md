---
title: Scripting
description: Modify matching HTTP requests and responses with Rhai scripts.
---

Scripting lets you write small Rhai rules that change live traffic as it passes through WePROXA. Use it when a breakpoint would be too manual, or when you want the same request or response edit applied every time a URL matches.

## How It Works

A script rule combines a URL pattern, an optional HTTP method filter, and one or both script phases:

- **Request phase** - runs after request breakpoints and before Map Local matching or upstream forwarding.
- **Response phase** - runs on proxied upstream responses before they are sent back to the client.

If multiple enabled script rules match the same request, WePROXA runs them in creation order. Each rule receives the current request or response state, including changes made by earlier rules.

:::note
Free accounts are limited to **2 Scripting rules**. Upgrade to Pro for unlimited script rules.
:::

## Creating a Script Rule

1. Open the **Scripting** tool from the toolbar, Tools menu, or tray menu.
2. Click **Add Rule**.
3. Enter a rule name and URL pattern, such as `https://api.example.com/v1/*`.
4. Optionally choose an HTTP method.
5. Select **Run on request**, **Run on response**, or both.
6. Write the script and save the rule.

Each rule can be enabled or disabled individually, duplicated, edited, deleted, and sorted by name or date. The global Scripting toggle turns the whole rule engine on or off without deleting rules. The script editor expands to use the available panel height, including when Scripting is opened in a detached tool window.

## Console and Runtime Diagnostics

The console at the bottom of the Scripting panel shows output from matching script rules while traffic passes through the proxy. Expand it to see each invocation's time, rule name, request or response phase, URL, and log entries.

Use `print(...)` for ordinary output and `debug(...)` for diagnostic values:

```txt
fn on_request() {
    print("Matched request");
    debug(this.method);
}
```

Runtime warnings and errors appear in the same console, including a source line when Rhai provides one. A failing invocation does not stop capture; WePROXA keeps traffic moving with the last valid request or response state.

Console controls let you:

- Show only warnings and errors.
- Pause new console entries without disabling Scripting.
- Clear captured output.
- Filter output to the rule currently being edited.

Pausing the console affects log capture only. Matching scripts continue to run and modify traffic.

## Entry Points

Define `on_request` to modify requests and `on_response` to modify responses. The recommended style is to mutate `this`:

```txt
fn on_request() {
    this.headers["x-debug-client"] = "weproxa";
}

fn on_response() {
    if this.status == 200 {
        this.headers["x-served-through"] = "weproxa";
    }
}
```

You can also accept the request or response map as an argument, but you must return it:

```txt
fn on_request(req) {
    req.headers["x-debug-client"] = "weproxa";
    req
}
```

## Request Fields

Request scripts can read and update these fields:

| Field | Type | Notes |
|---|---|---|
| `url` | string | Full request URL. Updating this is the most direct way to rewrite a destination. |
| `method` | string | HTTP method, such as `GET` or `POST`. |
| `scheme` | string | URL scheme, usually `http` or `https`. |
| `host` | string | Request host. |
| `port` | number | Resolved URL port. |
| `path` | string | Path portion of the URL. |
| `query` | map | Query parameters. Duplicate query keys are represented by the first value. |
| `headers` | map | Lowercase header name to string value. |
| `body` | string | Request body decoded as text. |

If you change `body`, WePROXA updates `Content-Length` automatically.

### URL Rewrites and Default Ports

Changing `url` directly is the most explicit way to route a request somewhere else. You can also update `scheme`, `host`, `port`, `path`, or `query` independently.

When a script changes only the scheme, WePROXA uses the new scheme's default port instead of carrying over the old one. For example, changing `http` to `https` routes to 443 unless you set `port` yourself.

```txt
fn on_request() {
    this.scheme = "https";
}
```

Set `this.port` explicitly whenever you need a non-default destination port.

## Response Fields

Response scripts can read and update these fields:

| Field | Type | Notes |
|---|---|---|
| `status` | number | HTTP status code. |
| `headers` | map | Lowercase header name to string value. |
| `body` | string | Response body decoded as text. |

If an upstream response is compressed, scripts see the plaintext body. When a script changes the body, WePROXA removes stale content-encoding headers and sends the updated plaintext body.

Response scripts run only when the response body can be safely buffered for scripting. Very large or long-lived streaming responses continue through the proxy without forcing unbounded buffering.

## Examples

### Add a Header to Matching Requests

```txt
fn on_request() {
    this.headers["x-debug-session"] = "local-dev";
}
```

### Rewrite an API Path

```txt
fn on_request() {
    if this.path == "/v1/profile" {
        this.path = "/v1/profile-preview";
    }
}
```

### Simulate an Error Response

```txt
fn on_response() {
    this.status = 503;
    this.headers["content-type"] = "application/json";
    this.body = "{\"error\":\"temporarily unavailable\"}";
}
```

### Tag Responses

```txt
fn on_response() {
    this.headers["x-weproxa-script"] = "tagged";
}
```

## Working With Other Tools

- **Breakpoints** - request scripts run after request breakpoints, so scripts can automate edits after a manual review step.
- **Map Local** - request scripts can rewrite the URL before Map Local checks for a matching file rule.
- **Diff Requests** - add scripted and unscripted captures to Diff to verify exactly what changed.
- **Network Conditioning** - delays still apply to matching traffic after request-phase scripts complete.

## Safety Limits

Scripting is designed for fast request and response edits. WePROXA limits script operations, call depth, string size, collection size, and scriptable response body size so accidental infinite loops or very large generated data cannot stall capture indefinitely.

If a script has a syntax error, WePROXA rejects the rule before saving it. If a saved script throws at runtime, that invocation is skipped and traffic continues with the last valid state.
