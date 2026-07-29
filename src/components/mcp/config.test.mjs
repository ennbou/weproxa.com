import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AUTH_TOKEN_PLACEHOLDER,
  CLIENT_TARGETS,
  createMcpHandoffUrl,
  DEFAULT_MCP_ENDPOINT,
  generateConfiguration,
  validateMcpEndpoint,
} from './config.ts';

const JSON_CLIENTS = ['vscode', 'cursor', 'jetbrains', 'generic'];

test('accepts only loopback HTTP MCP endpoints with an explicit port', () => {
  for (const endpoint of [
    DEFAULT_MCP_ENDPOINT,
    'http://localhost:9000/mcp',
    'http://127.24.9.2:80/mcp',
    'http://[::1]:8765/mcp',
  ]) {
    assert.equal(validateMcpEndpoint(endpoint).valid, true, endpoint);
  }

  for (const endpoint of [
    '',
    'https://127.0.0.1:8765/mcp',
    'http://192.168.1.4:8765/mcp',
    'http://127.0.0.1/mcp',
    'http://127.0.0.1:8765/',
    'http://127.0.0.1:8765/mcp/',
    'http://token@127.0.0.1:8765/mcp',
    'http://127.0.0.1:8765/mcp?token=secret',
  ]) {
    assert.equal(validateMcpEndpoint(endpoint).valid, false, endpoint);
  }
});

test('all clients receive distinct templates containing only the token placeholder', () => {
  const templates = CLIENT_TARGETS.map((client) =>
    generateConfiguration(client, DEFAULT_MCP_ENDPOINT, 'user'),
  );

  assert.equal(new Set(templates).size, CLIENT_TARGETS.length);
  for (const template of templates) {
    assert.match(template, new RegExp(AUTH_TOKEN_PLACEHOLDER.replace(/[<>]/g, '\\$&')));
    assert.doesNotMatch(template, /authToken|accessToken|secret-token/i);
  }
});

test('JSON client templates are syntactically valid and use client-specific shapes', () => {
  for (const client of JSON_CLIENTS) {
    assert.doesNotThrow(() =>
      JSON.parse(generateConfiguration(client, DEFAULT_MCP_ENDPOINT, 'workspace')),
    );
  }

  const vscode = JSON.parse(generateConfiguration('vscode', DEFAULT_MCP_ENDPOINT, 'user'));
  const cursor = JSON.parse(generateConfiguration('cursor', DEFAULT_MCP_ENDPOINT, 'user'));
  const jetbrains = JSON.parse(
    generateConfiguration('jetbrains', DEFAULT_MCP_ENDPOINT, 'user'),
  );

  assert.ok(vscode.servers.weproxa);
  assert.ok(cursor.mcpServers.weproxa);
  assert.equal(cursor.mcpServers.weproxa.type, undefined);
  assert.equal(jetbrains.mcpServers.weproxa.type, 'streamable-http');
});

test('Claude Code maps workspace scope to project scope', () => {
  assert.match(
    generateConfiguration('claude-code', DEFAULT_MCP_ENDPOINT, 'workspace'),
    /--scope project/,
  );
  assert.match(
    generateConfiguration('claude-code', DEFAULT_MCP_ENDPOINT, 'user'),
    /--scope user/,
  );
});

test('handoff URLs contain only controlled client and scope values', () => {
  for (const client of CLIENT_TARGETS) {
    const handoff = createMcpHandoffUrl(client, 'workspace');
    assert.equal(handoff, `weproxa://mcp/connect?client=${client}&scope=workspace`);
    assert.doesNotMatch(handoff, /127\.0\.0\.1|8765|token|%2F|%3A/i);
  }
});
