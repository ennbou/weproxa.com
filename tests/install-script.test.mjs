// The Linux half of the installer served at weproxa.com/i (public/script.sh).
//
// Small scripts stand in for uname, getconf, the package managers, sudo, pgrep
// and setsid, and record how they were called. The manifest and packages are
// file:// URLs, which the real curl reads like any other. PATH holds nothing
// else, so a real apt-get or dnf can never run.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../public/script.sh', import.meta.url));

// The real tools the script and the stand-ins use.
const SYSTEM_TOOLS = ['basename', 'cat', 'chmod', 'cp', 'curl', 'env', 'mktemp', 'rm'];

const STAND_INS = {
  uname: `case "$1" in -s) echo "\${TEST_OS:-Linux}" ;; -m) echo "$TEST_MACHINE" ;; esac`,
  getconf: `[ -n "$TEST_GLIBC" ] || exit 1; echo "glibc $TEST_GLIBC"`,
  sudo: `[ "$1" = -v ] && exit 0; exec "$@"`,
  'apt-get': `echo "apt-get $*" >> "$STATE/calls"
case "$1" in
  update) exit 0 ;;
  install)
    if [ -f "$STATE/fail-install-once" ]; then rm "$STATE/fail-install-once"; exit 100; fi
    cp "$3" "$STATE/installed" ;;
esac`,
  dnf: `echo "dnf $*" >> "$STATE/calls"; cp "$3" "$STATE/installed"`,
  pgrep: `exit "\${TEST_PGREP_STATUS:-1}"`,
  setsid: `echo "setsid $*" >> "$STATE/calls"`,
};

const ALL_PACKAGES = {
  'linux-x86_64-deb': 'weproxa_3.11.0_amd64.deb',
  'linux-x86_64-rpm': 'weproxa-3.11.0-1.x86_64.rpm',
  'linux-aarch64-deb': 'weproxa_3.11.0_arm64.deb',
  'linux-aarch64-rpm': 'weproxa-3.11.0-1.aarch64.rpm',
};

function resolveTool(name) {
  const found = spawnSync('/bin/sh', ['-c', `command -v ${name}`], { encoding: 'utf8' });
  assert.equal(found.status, 0, `${name} must be installed to run this test`);
  return found.stdout.trim();
}

const bash = resolveTool('bash');

// A sandbox with the stand-ins for MANAGERS, and a manifest offering PACKAGES
// (the deploy's layout, or minified when COMPACT is set).
function sandbox(t, { managers = ['apt-get'], packages = ALL_PACKAGES, compact = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'weproxa-install-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));

  const bin = join(root, 'bin');
  const state = join(root, 'state');
  const release = join(root, 'release');
  for (const dir of [bin, state, release]) mkdirSync(dir);

  for (const tool of SYSTEM_TOOLS) symlinkSync(resolveTool(tool), join(bin, tool));
  for (const [name, body] of Object.entries(STAND_INS)) {
    if ((name === 'apt-get' || name === 'dnf') && !managers.includes(name)) continue;
    writeFileSync(join(bin, name), `#!/bin/sh\n${body}\n`, { mode: 0o755 });
  }

  const platforms = {};
  for (const [key, name] of Object.entries(packages)) {
    writeFileSync(join(release, name), `package ${name}`);
    platforms[key] = { signature: 'c2lnbmF0dXJl', url: `file://${join(release, name)}` };
  }
  const manifest = { version: '3.11.0', notes: 'Weproxa 3.11.0', pub_date: '2026-10-26T09:21:43Z', platforms };
  writeFileSync(join(release, 'latest.json'), JSON.stringify(manifest, null, compact ? 0 : 2));

  return {
    state,
    run(env = {}) {
      return spawnSync(bash, [script], {
        encoding: 'utf8',
        env: {
          PATH: bin,
          HOME: root,
          TMPDIR: root,
          STATE: state,
          TEST_MACHINE: 'x86_64',
          TEST_GLIBC: '2.39',
          WEPROXA_MANIFEST_URL: `file://${join(release, 'latest.json')}`,
          WEPROXA_LAUNCH_AFTER_INSTALL: 'false',
          ...env,
        },
      });
    },
    calls() {
      const path = join(state, 'calls');
      return existsSync(path) ? readFileSync(path, 'utf8').trim().split('\n') : [];
    },
    installed() {
      return readFileSync(join(state, 'installed'), 'utf8');
    },
  };
}

const posix = { skip: process.platform === 'win32' };

test('installs the .deb the manifest names for this computer with apt', posix, (t) => {
  const box = sandbox(t);
  const result = box.run();

  assert.equal(result.status, 0, result.stderr);
  const calls = box.calls();
  assert.equal(calls.length, 1);
  assert.match(calls[0], /^apt-get install -y \/.+\/weproxa_3\.11\.0_amd64\.deb$/);
  assert.equal(box.installed(), 'package weproxa_3.11.0_amd64.deb');
  assert.match(result.stdout, /Installed WePROXA 3\.11\.0/);
});

test('uses dnf and the ARM64 package where there is no apt', posix, (t) => {
  const box = sandbox(t, { managers: ['dnf'], compact: true });
  const result = box.run({ TEST_MACHINE: 'aarch64' });

  assert.equal(result.status, 0, result.stderr);
  const calls = box.calls();
  assert.equal(calls.length, 1);
  assert.match(calls[0], /^dnf install -y \/.+\/weproxa-3\.11\.0-1\.aarch64\.rpm$/);
  assert.equal(box.installed(), 'package weproxa-3.11.0-1.aarch64.rpm');
});

test('refreshes the package lists once when apt cannot install', posix, (t) => {
  const box = sandbox(t);
  writeFileSync(join(box.state, 'fail-install-once'), '');
  const result = box.run();

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(
    box.calls().map((call) => call.split(' ').slice(0, 2).join(' ')),
    ['apt-get install', 'apt-get update', 'apt-get install'],
  );
});

test('refuses a glibc older than the packages need, before installing', posix, (t) => {
  const box = sandbox(t);

  const old = box.run({ TEST_GLIBC: '2.31' });
  assert.notEqual(old.status, 0);
  assert.match(old.stderr, /needs glibc 2\.35 or newer, and this system has 2\.31/);

  const musl = box.run({ TEST_GLIBC: '' });
  assert.notEqual(musl.status, 0);
  assert.match(musl.stderr, /does not use glibc/);

  assert.deepEqual(box.calls(), []);
});

test('says so when the release has no package for this computer', posix, (t) => {
  const box = sandbox(t, {
    packages: { 'linux-x86_64-deb': ALL_PACKAGES['linux-x86_64-deb'] },
  });
  const result = box.run({ TEST_MACHINE: 'aarch64' });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /WePROXA 3\.11\.0 has no \.deb package for aarch64/);
  assert.deepEqual(box.calls(), []);
});

test('refuses a distribution with neither apt nor dnf', posix, (t) => {
  const box = sandbox(t, { managers: [] });
  const result = box.run();

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /needs apt \(Debian, Ubuntu\) or dnf \(Fedora\)/);
});

test('sends Windows users to winget', posix, (t) => {
  const box = sandbox(t);
  const result = box.run({ TEST_OS: 'MINGW64_NT-10.0-26100' });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /winget install weproxa/);
});

test('does not start a second copy next to one already running', {
  // As root, the script never starts the app at all.
  skip: process.platform === 'win32' || process.getuid?.() === 0,
}, (t) => {
  const box = sandbox(t);
  const env = { WEPROXA_LAUNCH_AFTER_INSTALL: 'true', DISPLAY: ':0' };

  const running = box.run({ ...env, TEST_PGREP_STATUS: '0' });
  assert.equal(running.status, 0, running.stderr);
  assert.match(running.stdout, /already running/);
  assert.ok(!box.calls().some((call) => call.startsWith('setsid')));

  const headless = box.run({ WEPROXA_LAUNCH_AFTER_INSTALL: 'true' });
  assert.equal(headless.status, 0, headless.stderr);
  assert.match(headless.stdout, /No graphical session found/);
});
