---
title: "How to Mock API Responses with an HTTP Proxy"
description: Learn how an HTTP/HTTPS debugging proxy can intercept requests, return local API mock responses, and test failures without changing application code.
date: 2026-09-12
authors:
  - weproxa
tags:
  - api-mocking
  - http-proxy
  - guide
excerpt: Learn how an HTTP/HTTPS debugging proxy can intercept requests, return local API mock responses, and test failures without changing application code.
---

An API does not have to be finished—or even online—for you to build and test the application that calls it. An HTTP debugging proxy can intercept the real request and return a controlled response before the request reaches the server.

**WePROXA is a native HTTP/HTTPS debugging proxy and API mocking tool for macOS and Windows.** Its Map Local feature can replace a matching API response with a local file, an inline body, or another remote resource. You choose the status code, headers, and body without changing the application URL or adding mock logic to the codebase.

This guide explains when proxy-based API mocking is useful and shows how to create and verify a mock response in WePROXA.

## What is an HTTP debugging proxy?

An HTTP debugging proxy sits between an application and the network. The application sends its HTTP or HTTPS requests through the proxy, which can capture the complete exchange before forwarding it to the destination server.

A debugging proxy helps developers:

- inspect request URLs, methods, headers, and bodies;
- read response status codes, headers, and bodies;
- intercept or edit traffic;
- replay requests;
- block selected calls;
- simulate slow or failed networks; and
- replace real API responses with local mock responses.

For HTTPS traffic, the device must trust the proxy's local certificate authority and the target host must be enabled for SSL interception. This lets the proxy inspect the decrypted HTTP exchange while the traffic remains encrypted on either side of the proxy.

## What is proxy-based API mocking?

Proxy-based API mocking replaces the response to a real application request at the network layer. The application continues to call its normal URL, but the proxy returns a response you control.

```text
Normal request:
App -> WePROXA -> Real API -> WePROXA -> App

Request matched by a Map Local rule:
App -> WePROXA -> Local mock response -> App
                  (Real API is not called)
```

In WePROXA, this behavior is called [Map Local](/guide/features/map-local/). When an enabled rule matches, WePROXA serves the rule's response instead of forwarding the request to the origin server.

That makes proxy mocking useful when:

- the backend endpoint is not ready;
- a third-party API is unavailable or expensive to call;
- a rare error is difficult to reproduce;
- test data would be unsafe to create in production;
- you need a stable response for a UI demo; or
- you want to test the same mobile or desktop build without adding a mock mode.

## HTTP proxy mocking vs. a mock server

Both approaches return controlled API responses, but they fit different jobs.

| Question | HTTP proxy mock | Dedicated mock server |
| --- | --- | --- |
| Must the application use a different base URL? | Usually no | Usually yes |
| Can unmatched requests continue to the real API? | Yes | Only with proxy or pass-through support |
| Can you create a mock from captured traffic? | Yes | Depends on the tool |
| Can the same build be tested in a browser, desktop app, or mobile device? | Yes, when the client uses the proxy | Yes, when the client can reach the server |
| Is it ideal for modeling an entire API contract? | Sometimes | Usually |
| Is it quick for replacing one troublesome endpoint? | Yes | Often more setup |

Use a dedicated mock server when your team needs a complete simulated backend, contract validation, or mocks that run independently in CI. Use a debugging proxy when you want to observe real traffic and replace only the responses relevant to the test in front of you.

## How to mock an API response in WePROXA

The fastest workflow starts from a request the application already made.

### 1. Capture the real request

[Install WePROXA](/guide/getting-started/quick-start/), start the proxy, and reproduce the application action you want to test. Find the request in the capture list and inspect its method, URL, query parameters, and current response.

If the request uses HTTPS and only a `CONNECT` tunnel appears, trust the WePROXA CA certificate and [enable SSL interception](/guide/guides/ssl-interception/) for that host. Certificate-pinned applications may require a development build that permits interception.

### 2. Create a Map Local rule

Right-click the captured request and choose **Map Local**. WePROXA pre-fills the URL pattern, HTTP method, status, headers, and response content from the selected exchange.

You can also open the Map Local tool and create a rule manually. A typical rule might use:

| Field | Example |
| --- | --- |
| Name | `Profile — signed-in user` |
| URL pattern | `https://api.example.com/v1/profile` |
| Method | `GET` |
| Response source | Inline |
| Status | `200` |
| Header | `Content-Type: application/json` |

Then enter the response body:

```json
{
  "id": "user_123",
  "name": "Amina",
  "plan": "pro"
}
```

Save and enable the rule. The next matching request receives this JSON directly from WePROXA, and the origin API is not called.

### 3. Repeat the application action

Return to the application and trigger the same request again. The app should render the state described by the mock response.

In the WePROXA capture list, open the newest request and confirm:

- the expected HTTP status was returned;
- the response body matches the fixture; and
- **Map Local** appears as the response tool.

The Map Local marker is important. A matching body or status code alone does not prove that the local rule answered the request.

### 4. Make the match as narrow as the test

An exact URL and method are a safe starting point. For endpoints that share a path, add [request match conditions](/guide/features/map-local/#request-match-conditions) for query parameters, headers, text in the request body, or a JSON body path.

For example, one `POST /v1/login` rule can match a valid email and return `200`, while another matches an invalid credential and returns `401`. Narrow rules prevent one fixture from accidentally changing unrelated traffic.

## API states worth mocking

A useful mock setup covers more than the successful response.

### Empty data

Return `200 OK` with an empty collection to verify the application's empty state:

```json
{
  "items": [],
  "nextPage": null
}
```

### Validation failure

Return `422 Unprocessable Entity` with the same error shape the real API contract defines:

```json
{
  "error": "validation_failed",
  "fields": {
    "email": "Enter a valid email address"
  }
}
```

### Authentication and authorization

Use `401 Unauthorized` to test sign-in recovery and `403 Forbidden` to test a user who is authenticated but lacks permission. Keeping those cases separate catches misleading error messages and redirect loops.

### Rate limits and server errors

Return `429 Too Many Requests`, `500 Internal Server Error`, or `503 Service Unavailable` to exercise retry controls, error messages, and fallback UI. Add headers such as `Retry-After` when the application is expected to read them.

### Slow and offline behavior

Use [Network Conditioning](/guide/features/network-conditioning/) to add targeted request or response delay. Use the [Block List](/guide/features/block-list/) to return a `403`, close the connection, or hold it before closing. Connection-level failures are useful because an offline error does not behave like an HTTP response.

## Keep mocks repeatable with Workspaces and Scenarios

One temporary rule is enough for a quick UI check. A larger feature usually needs several responses, tool states, and HTTPS hosts to move together.

[Workspaces](/guide/features/workspaces/) organize rules by project or environment. [Scenarios](/guide/features/scenarios/) group the exact rules and tool states for a workflow such as:

- checkout succeeds;
- payment is declined;
- the account has no previous orders; or
- the API is unavailable after the first screen.

Activating a Scenario applies the setup together. Scenarios can also declare pass-through containment so an unmocked request fails instead of quietly reaching the real backend. That makes a manual test or acceptance run easier to reproduce.

## Can an AI coding agent create and verify the mocks?

Yes. WePROXA includes a local Model Context Protocol (MCP) server for compatible AI coding clients. With your approval, an agent can inspect captured traffic, propose Map Local fixtures, create scoped rules, and verify which rule answered the next request.

The useful part is the verification loop: the agent can compare the original response with the mocked capture instead of only generating plausible JSON. See [AI-Powered API Debugging with WePROXA](/blog/ai-powered-api-debugging-with-weproxa/) for a complete example and [Agent Skills](/guide/guides/agent-skills/) for repeatable traffic-inspection and mock-authoring workflows.

## Frequently asked questions

### Can I mock an API response without changing application code?

Yes. Configure the application or operating system to use WePROXA as its HTTP/HTTPS proxy, then add a Map Local rule for the existing API URL. The application keeps calling the same endpoint while WePROXA returns the mock.

### Can WePROXA mock HTTPS APIs?

Yes. Install and trust the local WePROXA CA certificate, then enable SSL interception for the target host or application. Some certificate-pinned apps intentionally reject interception and may need a development configuration.

### Does a Map Local request reach the real API server?

No. When an enabled Map Local rule matches, WePROXA responds from the selected local file, inline body, or remote source instead of forwarding the request to the origin.

### Can I mock status codes and response headers?

Yes. A Map Local rule can override the HTTP status code and response headers as well as the body. This is useful for authentication errors, validation failures, rate limits, redirects, cache behavior, and server errors.

### Can I mock only one request and let everything else stay live?

Yes. Rules can target a URL pattern and method, with optional conditions for query parameters, headers, or request bodies. Requests that do not match continue normally unless pass-through containment is enabled.

### Is WePROXA a mock server or a proxy debugger?

WePROXA is an HTTP/HTTPS proxy debugger with API mocking features. It captures and inspects real traffic, while Map Local lets it act as a selective mock layer for matching requests.

### Which platforms does WePROXA support?

WePROXA is available for macOS and Windows. It can also capture traffic from remote phones and tablets when they use the computer running WePROXA as their network proxy.

## Start with one real request

The quickest way to decide whether proxy-based mocking fits your workflow is to use it on one endpoint you already need to debug.

[Capture your first HTTPS request](/blog/from-download-to-request-bodies/), create a Map Local rule from that request, and replace its response with the success, empty, or failure state your application needs. You can expand the setup into a Scenario after the first mock is working and verified.
