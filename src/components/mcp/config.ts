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

export type CommandValidation =
  | { valid: true; command: string }
  | { valid: false; error: string };

export const MCP_HELPER_PLACEHOLDER = '<WEPROXA_MCP_HELPER_PATH>';
export const DEFAULT_MCP_COMMAND = MCP_HELPER_PLACEHOLDER;

export function validateMcpCommand(value: string): CommandValidation {
  const command = value.trim();
  if (!command) {
    return { valid: false, error: 'Enter the helper command from WePROXA.' };
  }

  if (/[\r\n]/.test(command)) {
    return { valid: false, error: 'The helper command must be one path on one line.' };
  }

  return { valid: true, command };
}

function serverEntry(command: string, explicitType: boolean): Record<string, string> {
  return {
    ...(explicitType ? { type: 'stdio' } : {}),
    command,
  };
}

function generateVsCodeConfiguration(command: string): string {
  return JSON.stringify(
    {
      servers: {
        weproxa: serverEntry(command, true),
      },
    },
    null,
    2,
  );
}

function generateMcpJsonConfiguration(command: string): string {
  return JSON.stringify(
    {
      mcpServers: {
        weproxa: serverEntry(command, true),
      },
    },
    null,
    2,
  );
}

function generateCodexConfiguration(command: string): string {
  return [
    '[mcp_servers.weproxa]',
    `command = ${JSON.stringify(command)}`,
    'enabled = true',
  ].join('\n');
}

function shellQuote(value: string): string {
  return `'${value.split("'").join("'\"'\"'")}'`;
}

function generateClaudeCodeConfiguration(command: string, scope: ClientScope): string {
  const claudeScope = scope === 'workspace' ? 'local' : 'user';
  return `claude mcp add --scope ${claudeScope} weproxa -- ${shellQuote(command)}`;
}

export function generateConfiguration(
  client: ClientTarget,
  command: string,
  scope: ClientScope,
): string {
  switch (client) {
    case 'vscode':
      return generateVsCodeConfiguration(command);
    case 'cursor':
    case 'jetbrains':
    case 'generic':
      return generateMcpJsonConfiguration(command);
    case 'codex':
      return generateCodexConfiguration(command);
    case 'claude-code':
      return generateClaudeCodeConfiguration(command, scope);
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
