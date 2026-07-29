export const CLIENT_TARGETS = [
  'vscode',
  'cursor',
  'codex',
  'claude-code',
  'jetbrains',
  'generic',
] as const;

export const CLIENT_SCOPES = ['user', 'workspace'] as const;

export type ClientTarget = (typeof CLIENT_TARGETS)[number];
export type ClientScope = (typeof CLIENT_SCOPES)[number];

export type EndpointValidation =
  | { valid: true; endpoint: string }
  | { valid: false; error: string };

export const DEFAULT_MCP_ENDPOINT = 'http://127.0.0.1:8765/mcp';
export const AUTH_TOKEN_PLACEHOLDER = '<WEPROXA_AUTH_TOKEN>';

const LOOPBACK_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

function hasExplicitPort(endpoint: string): boolean {
  const authority = endpoint.match(/^http:\/\/([^/?#]+)/i)?.[1];
  if (!authority) {
    return false;
  }

  return authority.startsWith('[')
    ? /^\[[^\]]+\]:\d+$/.test(authority)
    : /^[^:]+:\d+$/.test(authority);
}

function isLoopbackHostname(hostname: string): boolean {
  const normalizedHostname = hostname.toLowerCase();
  if (LOOPBACK_HOSTNAMES.has(normalizedHostname)) {
    return true;
  }

  const octets = normalizedHostname.split('.');
  return (
    octets.length === 4 &&
    octets[0] === '127' &&
    octets.every((octet) => /^\d{1,3}$/.test(octet) && Number(octet) <= 255)
  );
}

export function validateMcpEndpoint(value: string): EndpointValidation {
  const endpoint = value.trim();
  if (!endpoint) {
    return { valid: false, error: 'Enter the endpoint shown in WePROXA.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(endpoint);
  } catch {
    return { valid: false, error: 'Enter a complete URL, including http:// and a port.' };
  }

  if (parsed.protocol !== 'http:') {
    return { valid: false, error: 'The local WePROXA endpoint must use http://.' };
  }

  if (parsed.username || parsed.password) {
    return { valid: false, error: 'Do not place credentials in the endpoint URL.' };
  }

  if (!isLoopbackHostname(parsed.hostname)) {
    return {
      valid: false,
      error: 'Use a loopback host: 127.0.0.1, localhost, or [::1].',
    };
  }

  if (!hasExplicitPort(endpoint)) {
    return { valid: false, error: 'Include the exact port shown in WePROXA.' };
  }

  if (parsed.pathname !== '/mcp') {
    return { valid: false, error: 'The endpoint path must be exactly /mcp.' };
  }

  if (parsed.search || parsed.hash) {
    return { valid: false, error: 'Remove query parameters and fragments from the endpoint.' };
  }

  return { valid: true, endpoint };
}

function authorizationHeaders() {
  return {
    Authorization: `Bearer ${AUTH_TOKEN_PLACEHOLDER}`,
  };
}

function generateVsCodeConfiguration(endpoint: string): string {
  return JSON.stringify(
    {
      servers: {
        weproxa: {
          type: 'http',
          url: endpoint,
          headers: authorizationHeaders(),
        },
      },
    },
    null,
    2,
  );
}

function generateCursorConfiguration(endpoint: string): string {
  return JSON.stringify(
    {
      mcpServers: {
        weproxa: {
          url: endpoint,
          headers: authorizationHeaders(),
        },
      },
    },
    null,
    2,
  );
}

function generateCodexConfiguration(endpoint: string): string {
  return [
    '[mcp_servers.weproxa]',
    `url = ${JSON.stringify(endpoint)}`,
    `http_headers = { Authorization = "Bearer ${AUTH_TOKEN_PLACEHOLDER}" }`,
  ].join('\n');
}

function generateClaudeCodeConfiguration(endpoint: string, scope: ClientScope): string {
  const claudeScope = scope === 'workspace' ? 'project' : 'user';

  return [
    'claude mcp add --transport http weproxa \\',
    `  --scope ${claudeScope} \\`,
    `  --header "Authorization: Bearer ${AUTH_TOKEN_PLACEHOLDER}" \\`,
    `  "${endpoint}"`,
  ].join('\n');
}

function generateJetBrainsConfiguration(endpoint: string): string {
  return JSON.stringify(
    {
      mcpServers: {
        weproxa: {
          type: 'streamable-http',
          url: endpoint,
          headers: authorizationHeaders(),
        },
      },
    },
    null,
    2,
  );
}

function generateGenericConfiguration(endpoint: string): string {
  return JSON.stringify(
    {
      mcpServers: {
        weproxa: {
          type: 'http',
          url: endpoint,
          headers: authorizationHeaders(),
        },
      },
    },
    null,
    2,
  );
}

export function generateConfiguration(
  client: ClientTarget,
  endpoint: string,
  scope: ClientScope,
): string {
  switch (client) {
    case 'vscode':
      return generateVsCodeConfiguration(endpoint);
    case 'cursor':
      return generateCursorConfiguration(endpoint);
    case 'codex':
      return generateCodexConfiguration(endpoint);
    case 'claude-code':
      return generateClaudeCodeConfiguration(endpoint, scope);
    case 'jetbrains':
      return generateJetBrainsConfiguration(endpoint);
    case 'generic':
      return generateGenericConfiguration(endpoint);
  }
}

export function isClientTarget(value: string): value is ClientTarget {
  return CLIENT_TARGETS.some((client) => client === value);
}

export function isClientScope(value: string): value is ClientScope {
  return CLIENT_SCOPES.some((scope) => scope === value);
}

export function createMcpHandoffUrl(client: ClientTarget, scope: ClientScope): string {
  return `weproxa://mcp/connect?client=${client}&scope=${scope}`;
}
