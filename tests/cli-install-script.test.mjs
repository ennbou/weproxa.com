// The weproxa-cli installer served at weproxa.com/cli (public/cli.sh).
//
// Small scripts stand in for uname, getconf, sysctl and sudo, and record how
// they were called. The releases are file:// URLs laid out as
// ci/deploy-r2-cli.sh publishes them, which the real curl reads like any other,
// and each archive holds two shell scripts that print the version a real
// release prints. PATH holds nothing else.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../public/cli.sh', import.meta.url));

// The real tools the script and the stand-ins use. Only one of the checksum
// tools has to exist.
const SYSTEM_TOOLS = ['cat', 'chmod', 'cp', 'curl', 'dirname', 'gzip', 'mkdir', 'mktemp', 'mv', 'rm', 'tar'];
const CHECKSUM_TOOLS = ['sha256sum', 'shasum'];

const STAND_INS = {
  uname: `case "$1" in -s) echo "\${TEST_OS:-Linux}" ;; -m) echo "$TEST_MACHINE" ;; esac`,
  getconf: `[ -n "$TEST_GLIBC" ] || exit 1; echo "glibc $TEST_GLIBC"`,
  sysctl: `echo "\${TEST_ARM64:-0}"`,
  // Grants what root would: the system folder becomes writable.
  sudo: `echo "sudo $*" >> "$STATE/calls"
[ "$1" = -v ] && exit 0
chmod u+w "$WEPROXA_CLI_SYSTEM_DIR"
exec "$@"`,
};

function findTool(name) {
  const found = spawnSync('/bin/sh', ['-c', `command -v ${name}`], { encoding: 'utf8' });
  return found.status === 0 ? found.stdout.trim() : null;
}

function resolveTool(name) {
  const path = findTool(name);
  assert.ok(path, `${name} must be installed to run this test`);
  return path;
}

const bash = resolveTool('bash');

const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

// A sandbox with the stand-ins, and RELEASES published as the deploy lays them
// out: { version, platform, cliPrints? }. The newest goes into cli/latest.json
// unless MANIFEST is false.
function sandbox(t, { releases = [{ version: '3.12.0', platform: 'linux-x86_64' }], manifest = true, sudo = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'weproxa-cli-install-'));
  t.after(() => {
    chmodSync(system, 0o755);
    rmSync(root, { recursive: true, force: true });
  });

  const bin = join(root, 'bin');
  const state = join(root, 'state');
  const release = join(root, 'release');
  const system = join(root, 'usr-local-bin');
  const home = join(root, 'home');
  for (const dir of [bin, state, release, system, home]) mkdirSync(dir);

  for (const tool of SYSTEM_TOOLS) symlinkSync(resolveTool(tool), join(bin, tool));
  const checksum = CHECKSUM_TOOLS.find(findTool);
  assert.ok(checksum, 'sha256sum or shasum must be installed to run this test');
  symlinkSync(findTool(checksum), join(bin, checksum));
  for (const [name, body] of Object.entries(STAND_INS)) {
    if (name === 'sudo' && !sudo) continue;
    writeFileSync(join(bin, name), `#!/bin/sh\n${body}\n`, { mode: 0o755 });
  }

  const platforms = {};
  for (const { version, platform, cliPrints = `weproxa-cli ${version}` } of releases) {
    const arch = platform.split('-')[1];
    const folder = join(release, `${version.split('.')[0]}.x.x`, version, arch);
    const staging = join(root, `stage-${version}-${platform}`);
    mkdirSync(folder, { recursive: true });
    mkdirSync(staging);
    writeFileSync(join(staging, 'weproxa-cli'), `#!/bin/sh\necho '${cliPrints}'\n`, { mode: 0o755 });
    writeFileSync(join(staging, 'weproxa-mcp'), `#!/bin/sh\necho 'weproxa-mcp ${version}' >&2\n`, { mode: 0o755 });
    const name = `weproxa-cli-${version}-${platform}.tar.gz`;
    const archive = join(folder, name);
    const packed = spawnSync('tar', ['-C', staging, '-czf', archive, 'weproxa-cli', 'weproxa-mcp'], {
      env: { ...process.env, COPYFILE_DISABLE: '1' },
    });
    assert.equal(packed.status, 0, String(packed.stderr));
    writeFileSync(`${archive}.sha256`, `${sha256(archive)}  ${name}\n`);
    platforms[platform] = { version, url: `file://${archive}`, sha256: sha256(archive), signature: 'c2ln' };
  }
  if (manifest) {
    mkdirSync(join(release, 'cli'));
    const newest = releases.map((r) => r.version).sort().at(-1);
    const body = { version: newest, pub_date: '2026-11-04T10:00:00Z', platforms };
    writeFileSync(join(release, 'cli', 'latest.json'), JSON.stringify(body, null, 2));
  }

  return {
    root,
    system,
    home,
    state,
    release,
    run(env = {}) {
      return spawnSync(bash, [script], {
        encoding: 'utf8',
        env: {
          PATH: bin,
          HOME: home,
          TMPDIR: root,
          STATE: state,
          TEST_MACHINE: 'x86_64',
          TEST_GLIBC: '2.39',
          WEPROXA_CLI_BASE_URL: `file://${release}`,
          WEPROXA_CLI_SYSTEM_DIR: system,
          ...env,
        },
      });
    },
    calls() {
      const path = join(state, 'calls');
      return existsSync(path) ? readFileSync(path, 'utf8').trim().split('\n') : [];
    },
  };
}

function installed(dir, program) {
  return readFileSync(join(dir, program), 'utf8');
}

function assertInstalled(dir, version) {
  assert.match(installed(dir, 'weproxa-cli'), new RegExp(`weproxa-cli ${version.replaceAll('.', '\\.')}`));
  assert.match(installed(dir, 'weproxa-mcp'), new RegExp(`weproxa-mcp ${version.replaceAll('.', '\\.')}`));
  assert.equal(lstatSync(join(dir, 'weproxa-cli')).mode & 0o777, 0o755);
}

const posix = { skip: process.platform === 'win32' };
// As root every folder is writable, so the permission paths cannot be reached.
const unprivileged = { skip: process.platform === 'win32' || process.getuid?.() === 0 };

test('installs the newest release the manifest names for this computer', posix, (t) => {
  const box = sandbox(t);
  const result = box.run();

  assert.equal(result.status, 0, result.stderr);
  assertInstalled(box.system, '3.12.0');
  assert.match(result.stdout, /Installed weproxa-cli 3\.12\.0 in /);
  assert.match(result.stdout, /Update it with: weproxa-cli update/);
  assert.deepEqual(box.calls(), []);
});

test('installs a pinned version from its own folder, without the manifest', posix, (t) => {
  const box = sandbox(t, {
    releases: [{ version: '3.11.2', platform: 'linux-x86_64' }],
    manifest: false,
  });
  const result = box.run({ WEPROXA_CLI_VERSION: 'v3.11.2' });

  assert.equal(result.status, 0, result.stderr);
  assertInstalled(box.system, '3.11.2');
});

test('picks the ARM64 build on Linux and on Apple silicon under Rosetta', posix, (t) => {
  const box = sandbox(t, {
    releases: [
      { version: '3.12.0', platform: 'linux-arm64' },
      { version: '3.12.0', platform: 'macos-arm64' },
    ],
  });

  const linux = box.run({ TEST_MACHINE: 'aarch64' });
  assert.equal(linux.status, 0, linux.stderr);
  assert.match(linux.stdout, /linux-arm64/);

  const mac = box.run({ TEST_OS: 'Darwin', TEST_MACHINE: 'x86_64', TEST_ARM64: '1', TEST_GLIBC: '' });
  assert.equal(mac.status, 0, mac.stderr);
  assert.match(mac.stdout, /macos-arm64/);
});

test('installs into the folder the caller names', posix, (t) => {
  const box = sandbox(t);
  const dir = join(box.root, 'tools', 'bin');
  const result = box.run({ WEPROXA_CLI_INSTALL_DIR: dir });

  assert.equal(result.status, 0, result.stderr);
  assertInstalled(dir, '3.12.0');
  assert.match(result.stdout, /is not on your PATH/);
});

test('installs nothing when the archive does not match its checksum', posix, (t) => {
  const box = sandbox(t);
  const archive = join(box.release, '3.x.x', '3.12.0', 'x86_64', 'weproxa-cli-3.12.0-linux-x86_64.tar.gz');
  writeFileSync(archive, 'replaced after the manifest was written');
  const result = box.run();

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not match its checksum/);
  assert.ok(!existsSync(join(box.system, 'weproxa-cli')));
});

test('installs nothing when the new weproxa-cli does not start', posix, (t) => {
  const box = sandbox(t, {
    releases: [{ version: '3.12.0', platform: 'linux-x86_64', cliPrints: 'GLIBC_2.38 not found' }],
  });
  const result = box.run();

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not start on this system \(glibc 2\.39\)/);
  assert.ok(!existsSync(join(box.system, 'weproxa-cli')));
});

test('keeps the weproxa-mcp link the WePROXA app manages', posix, (t) => {
  const box = sandbox(t);
  const appHelper = join(box.root, 'WePROXA.app-weproxa-mcp');
  writeFileSync(appHelper, "the app's helper");
  symlinkSync(appHelper, join(box.system, 'weproxa-mcp'));
  const result = box.run();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(readlinkSync(join(box.system, 'weproxa-mcp')), appHelper);
  assert.equal(readFileSync(appHelper, 'utf8'), "the app's helper");
  assert.match(installed(box.system, 'weproxa-cli'), /weproxa-cli 3\.12\.0/);
  assert.match(result.stdout, /Kept .*weproxa-mcp, the link the WePROXA app manages/);
});

test('replaces an older install in place', posix, (t) => {
  const box = sandbox(t);
  writeFileSync(join(box.system, 'weproxa-cli'), 'old', { mode: 0o755 });
  writeFileSync(join(box.system, 'weproxa-mcp'), 'old', { mode: 0o755 });
  const result = box.run();

  assert.equal(result.status, 0, result.stderr);
  assertInstalled(box.system, '3.12.0');
});

test('asks sudo when the system folder is not writable', unprivileged, (t) => {
  const box = sandbox(t);
  chmodSync(box.system, 0o555);
  const result = box.run();

  assert.equal(result.status, 0, result.stderr);
  assert.ok(box.calls().includes('sudo -v'));
  assertInstalled(box.system, '3.12.0');
  assert.match(result.stdout, /Update it with: sudo weproxa-cli update/);
});

test('uses ~/.local/bin without sudo', unprivileged, (t) => {
  const box = sandbox(t, { sudo: false });
  chmodSync(box.system, 0o555);
  const result = box.run();

  assert.equal(result.status, 0, result.stderr);
  assertInstalled(join(box.home, '.local', 'bin'), '3.12.0');
  assert.ok(!existsSync(join(box.system, 'weproxa-cli')));
});

test('says so when the release has no build for this computer', posix, (t) => {
  const box = sandbox(t);
  const result = box.run({ TEST_MACHINE: 'aarch64' });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /has no linux-arm64 build/);
});

test('refuses a system without glibc, and Windows', posix, (t) => {
  const box = sandbox(t);

  const musl = box.run({ TEST_GLIBC: '' });
  assert.notEqual(musl.status, 0);
  assert.match(musl.stderr, /needs glibc/);

  const windows = box.run({ TEST_OS: 'MINGW64_NT-10.0-26100' });
  assert.notEqual(windows.status, 0);
  assert.match(windows.stderr, /no Windows release yet/);
});
