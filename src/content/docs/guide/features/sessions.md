---
title: Sessions & HAR Export
description: Save captures, record traffic into persistent sessions, and share HTTP exchanges as HAR files.
---

Sessions keep named collections of requests and responses for later investigation. They remain available after you clear the live traffic log or restart WePROXA. Find them under **Explorer → Sessions**.

A session can copy traffic already captured, record new traffic, or do both. Its entries keep the captured headers, bodies, timing, client, tool markers, and Scenario attribution available at the time they are stored.

## Create a Session

1. Open **Explorer** and click **+** beside **Sessions**.
2. Enter a **Name**, or keep the suggested name.
3. Under **Collect from**, choose **All traffic**, **App**, or **Host**.
4. Choose which requests to keep:

   | Requests | Behavior |
   |---|---|
   | **Captured so far** | Copy matching requests currently in the live log as a snapshot |
   | **New from now on** | Record matching requests captured after you start |
   | **Both** | Copy matching requests already captured, then keep recording new ones |

5. For a recording, choose a duration under **Stop recording**, or select **When I stop it**.
6. Click **Save Session** or **Start Recording**.

An **App** scope matches the exact client name shown in Explorer. A **Host** scope collects traffic to that hostname across paths and ports. Enter a hostname such as `api.example.com`; pasting a full URL into the creation dialog selects its host.

Saving a snapshot keeps the exchange as it exists at that moment. Choose **Both** when pending requests should continue updating as their responses arrive.

## Start from an App, Host, or Filtered View

Right-click an app or host in Explorer and choose **Save as Session...** or **Record Session...**. The dialog starts with that scope selected.

To keep the current live request-list view:

1. Select the source and apply the filters you want.
2. Right-click a request or empty space in the list.
3. Choose **Save N Shown Requests as Session...** to copy the displayed requests, or **Record Session with This View...** to record traffic matching the view.

These list actions apply to all requests currently shown, including rows outside the visible scroll area. Right-clicking one row does not narrow the session to that row.

Recordable views can combine app, host, path, or device selections with URL search, content-type filters, and Advanced Filters. The scope is captured when the session is created; changing the live view later does not change what that session records.

A request or response search cannot be used for recording. Views whose membership changes with SSL settings or tool activity also cannot be recorded. You can still save their displayed requests as a **Picked requests** snapshot; the dialog explains why recording is unavailable. Use a URL search, app, host, or supported Advanced Filter when you need a recording.

## Inspect and Manage Sessions

Select a session in Explorer to open its requests in the usual list and details panel. The **ID** column shows each entry's position within the session. A red recording indicator and the session's request count show when it is collecting traffic.

Session views support metadata filtering. Request and response body search and advanced filters that require the live backend search are unavailable; the list shows a notice when a filter cannot be applied. Captured bodies remain available in the details panel.

Right-click a session, or use its **Session actions** button, to:

- **Rename...** the session.
- **Stop Recording** while it is active.
- **Record Again...** using the session's original scope.
- **Export as HAR...** to share its stored exchanges.
- **Delete...** the session and its entries after confirmation.

When recording again, choose whether to keep existing entries and add more or replace them. You can also copy matching requests already in the live log before recording new ones. **Picked requests** sessions have no recording scope, so **Record Again...** is unavailable for them.

Deleting a session also stops its recording. It removes that session's stored copies; the live traffic log remains available.

## Recording Duration and Limits

The duration picker offers intervals from **30 seconds** through **2 hours**, plus **When I stop it**. You can stop a timed recording earlier from the session's menu.

- Up to **five sessions** can record at once.
- Each session holds up to **25,000 requests**.
- Session names can contain up to **120 characters**.

A recording stops when its timer ends, the session fills, WePROXA cannot save an entry, or you quit the app. WePROXA reports timer completion, a full session, or a write failure in the app. Stored entries remain available after relaunch; start **Record Again...** to collect more traffic.

Clearing the live log or switching Workspaces leaves sessions available. A recording keeps its scope until stopped. [Resetting settings](/guide/guides/troubleshooting/#reset-weproxa-to-defaults) also preserves stored sessions, but the resulting restart ends active recordings. Sessions preserve HTTP exchanges and captured bodies; WebSocket frame histories and [capture milestones](/guide/features/inspect-requests/#capture-milestones) belong to the live log.

## Export as HAR

HAR is an HTTP Archive format for exchanging captured requests, responses, and timing information.

1. Open a session's menu and choose **Export as HAR...**.
2. Review **Remove sensitive data**, which is enabled by default.
3. Click **Export...** and choose where to save the `.har` file.
4. Use **Show in Finder** on macOS or **Show in Explorer** on Windows in the completion message to find the file.

You can also export live traffic directly: right-click an app or host and choose **Export as HAR...**, or filter the request list and choose **Export N Shown Requests as HAR...**. Creating a session first is optional.

With **Remove sensitive data** enabled, WePROXA redacts likely credentials in headers, cookies, URLs, and text bodies, omits cookie arrays and client identification, and leaves out bodies it cannot check, such as binary or multipart content. An entry comment explains when a body was omitted. Review the exported file before sharing it.

Turning the option off includes captured credentials and bodies. Sanitization applies to the exported file; the session keeps the original captured data. A HAR file can only include bodies WePROXA retained during capture, and it does not include WebSocket frame histories.

## Sessions in AI Workflows

[MCP capture sessions](/guide/guides/mcp-integration/#capture-sessions) label requests in the live log for grouping exploration runs. Use **Explorer → Sessions** to keep a capture after relaunch or export it as HAR.
