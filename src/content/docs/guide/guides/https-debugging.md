---
title: HTTPS Debugging
description: How to debug HTTPS/SSL traffic with Weproxa.
---

Weproxa provides full HTTPS interception (MITM) so you can inspect encrypted traffic just like plain HTTP.

## How It Works

When HTTPS interception is enabled:

1. Your client connects to Weproxa's proxy
2. Weproxa establishes a secure connection with the real server
3. Weproxa dynamically generates a certificate for the target domain
4. Your client connects to Weproxa using that certificate
5. Weproxa decrypts, inspects, and re-encrypts all traffic

This is fully transparent — your app sees valid HTTPS responses as long as the Weproxa CA is trusted.

## Enabling HTTPS Interception

HTTPS interception works on a per-host basis. To start inspecting HTTPS traffic:

1. **Install the CA certificate** — see [Certificate Trust](/guide/guides/certificate-trust/) for setup instructions.
2. **Add SSL hosts** — add the hosts you want to inspect to the SSL Interception Hosts list. See [SSL Interception](/guide/guides/ssl-interception/) for the two ways to do this.

## Viewing HTTPS Traffic

HTTPS requests appear in the request list just like HTTP requests. You can:

- View full request and response headers
- Inspect decrypted request and response bodies
- Set breakpoints on HTTPS requests
- Map HTTPS URLs to local files

## Troubleshooting

### Certificate errors in browser
Make sure the Weproxa CA certificate is trusted in your macOS Keychain. See [Certificate Trust](/guide/guides/certificate-trust/).

### Some apps ignore system proxy
Some applications use their own proxy settings or certificate stores. You may need to configure them manually to use the Weproxa proxy address.

### Certificate pinning
Apps with certificate pinning will reject Weproxa's generated certificates. This is a security feature of those apps and cannot be bypassed through Weproxa.
