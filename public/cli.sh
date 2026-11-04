#!/usr/bin/env bash
# Installs weproxa-cli, WePROXA without a window, for CI jobs and scripts:
#   curl -fsSL https://weproxa.com/cli | bash
#
# It puts weproxa-cli, and the weproxa-mcp relay an MCP client starts to reach
# a `weproxa-cli headless --mcp` run, in /usr/local/bin. When it cannot write
# there it asks sudo, and without sudo it uses ~/.local/bin. Update later with:
#   weproxa-cli update
#
# Releases come from the bucket the WePROXA app of the same system ships from
# (ci/deploy-r2-cli.sh in the app repository): files.weproxa.com for macOS,
# files2.weproxa.com for Linux. The newest is named by cli/latest.json there.
# A pinned version is read from its own folder, so a CI job that pins one gets
# the same bytes on every run. Either way the archive must match its SHA-256,
# and the new weproxa-cli must start, before anything is installed.
#
# Settings, as environment variables:
#   WEPROXA_CLI_VERSION      Install this version instead of the newest
#   WEPROXA_CLI_INSTALL_DIR  Install here instead of /usr/local/bin
#
# In a CI job, pin the version:
#   curl -fsSL https://weproxa.com/cli | WEPROXA_CLI_VERSION=3.12.0 bash
#
# Windows has no weproxa-cli release yet. The WePROXA app has its own
# installer: https://weproxa.com/i
set -euo pipefail

SYSTEM_DIR="${WEPROXA_CLI_SYSTEM_DIR:-/usr/local/bin}"   # tests point it elsewhere
VERSION_PATTERN='^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$'

BASE_URL=''
OS=''
ARCH=''
TEMP_DIR=''
USE_SUDO='false'

log() {
  printf '[weproxa-cli-install] %s\n' "$*"
}

die() {
  printf '[weproxa-cli-install] %s\n' "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

cleanup() {
  if [[ -n "$TEMP_DIR" && -d "$TEMP_DIR" ]]; then
    rm -rf "$TEMP_DIR"
  fi
}

run_install_command() {
  if [[ "$USE_SUDO" == 'true' ]]; then
    sudo "$@"
    return
  fi

  "$@"
}

sha256_of() {
  local line

  if command -v sha256sum >/dev/null 2>&1; then
    line="$(sha256sum "$1")"
  elif command -v shasum >/dev/null 2>&1; then
    line="$(shasum -a 256 "$1")"
  else
    die 'Missing required command: sha256sum or shasum'
  fi
  printf '%s\n' "${line%% *}"
}

# ─── This computer ────────────────────────────────────────────────────────────

resolve_platform() {
  case "$(uname -s)" in
    Darwin)
      OS='macos'
      BASE_URL="${WEPROXA_CLI_BASE_URL:-https://files.weproxa.com}"
      # A shell running under Rosetta reports x86_64 on Apple silicon, where the
      # arm64 build is the one to install.
      if [[ "$(sysctl -in hw.optional.arm64 2>/dev/null || true)" == '1' ]]; then
        ARCH='arm64'
      else
        case "$(uname -m)" in
          arm64) ARCH='arm64' ;;
          x86_64) ARCH='x86_64' ;;
          *) die "Unsupported macOS architecture: $(uname -m)" ;;
        esac
      fi
      ;;
    Linux)
      OS='linux'
      BASE_URL="${WEPROXA_CLI_BASE_URL:-https://files2.weproxa.com}"
      case "$(uname -m)" in
        x86_64 | amd64) ARCH='x86_64' ;;
        aarch64 | arm64) ARCH='arm64' ;;
        *) die "Unsupported Linux architecture: $(uname -m). weproxa-cli runs on x86_64 and ARM64." ;;
      esac
      # Built against glibc; on musl (Alpine) it would not start at all.
      getconf GNU_LIBC_VERSION >/dev/null 2>&1 \
        || die 'weproxa-cli needs glibc, and this system does not use it (Alpine uses musl). Use a Debian, Ubuntu, or Fedora image.'
      ;;
    MINGW* | MSYS* | CYGWIN*)
      die 'weproxa-cli has no Windows release yet. For the WePROXA app, see https://weproxa.com'
      ;;
    *)
      die "This installer supports macOS and Linux, not $(uname -s)."
      ;;
  esac
}

# ─── The release ──────────────────────────────────────────────────────────────

# A stock system has nothing that parses JSON from a shell script, so the
# manifest is read with patterns. The values read here (a version, a URL, a
# hex checksum) never contain a quote, and a platform entry never contains a
# brace, so the patterns match exactly, with or without line breaks in the file.
manifest_field() {
  local entry_re="\"$2\"[[:space:]]*:[[:space:]]*[{]([^}]*)[}]"
  local field_re="\"$3\"[[:space:]]*:[[:space:]]*\"([^\"]+)\""

  [[ "$1" =~ $entry_re ]] || return 1
  local entry="${BASH_REMATCH[1]}"
  [[ "$entry" =~ $field_re ]] || return 1
  printf '%s\n' "${BASH_REMATCH[1]}"
}

archive_url() {
  local version="$1"
  printf '%s/%s.x.x/%s/%s/weproxa-cli-%s-%s-%s.tar.gz\n' \
    "$BASE_URL" "${version%%.*}" "$version" "$ARCH" "$version" "$OS" "$ARCH"
}

# Sets RELEASE_VERSION, RELEASE_URL and RELEASE_SHA256.
resolve_release() {
  local platform="$OS-$ARCH"

  if [[ -n "${WEPROXA_CLI_VERSION:-}" ]]; then
    RELEASE_VERSION="${WEPROXA_CLI_VERSION#v}"
    [[ "$RELEASE_VERSION" =~ $VERSION_PATTERN ]] \
      || die "WEPROXA_CLI_VERSION is not a version: $WEPROXA_CLI_VERSION"
    RELEASE_URL="$(archive_url "$RELEASE_VERSION")"
    local checksum
    checksum="$(curl -fsSL "$RELEASE_URL.sha256" 2>/dev/null)" \
      || die "weproxa-cli $RELEASE_VERSION has no $platform release ($RELEASE_URL)"
    RELEASE_SHA256="${checksum%% *}"
    return
  fi

  local manifest_url="$BASE_URL/cli/latest.json"
  local manifest
  log 'Fetching the latest release'
  manifest="$(curl -fsSL "$manifest_url")" || die "Could not download $manifest_url"
  RELEASE_VERSION="$(manifest_field "$manifest" "$platform" version)" \
    || die "The latest weproxa-cli release has no $platform build ($manifest_url)"
  RELEASE_URL="$(manifest_field "$manifest" "$platform" url)" \
    || die "Could not read the $platform download from $manifest_url"
  RELEASE_SHA256="$(manifest_field "$manifest" "$platform" sha256)" \
    || die "Could not read the $platform checksum from $manifest_url"
  [[ "$RELEASE_VERSION" =~ $VERSION_PATTERN ]] \
    || die "$manifest_url names an invalid version: $RELEASE_VERSION"
}

# Unpacks the archive into $TEMP_DIR/release and checks what it holds.
download_release() {
  local archive="$TEMP_DIR/weproxa-cli.tar.gz"

  log "Downloading weproxa-cli $RELEASE_VERSION ($OS-$ARCH)"
  curl -fL --progress-bar "$RELEASE_URL" -o "$archive" || die "Could not download $RELEASE_URL"

  local actual
  actual="$(sha256_of "$archive")"
  [[ "$actual" == "$RELEASE_SHA256" ]] \
    || die "The download does not match its checksum (expected $RELEASE_SHA256, got $actual). Nothing was installed."

  mkdir "$TEMP_DIR/release"
  tar -xzf "$archive" -C "$TEMP_DIR/release" weproxa-cli weproxa-mcp \
    || die 'The download is not a weproxa-cli release. Nothing was installed.'

  local program
  for program in weproxa-cli weproxa-mcp; do
    [[ -f "$TEMP_DIR/release/$program" && ! -L "$TEMP_DIR/release/$program" ]] \
      || die "The download holds no $program. Nothing was installed."
  done
}

# Runs the new weproxa-cli once, before it replaces anything: a build for
# another architecture, or one that needs a newer glibc, fails here.
check_release_starts() {
  local printed

  # Standard input is the script itself under `curl | bash`.
  if printed="$("$TEMP_DIR/release/weproxa-cli" --version 2>&1 </dev/null)" \
    && [[ "$printed" == "weproxa-cli $RELEASE_VERSION" ]]; then
    return
  fi

  if [[ "$OS" == 'linux' ]]; then
    die "weproxa-cli $RELEASE_VERSION does not start on this system ($(getconf GNU_LIBC_VERSION)); it is built on Ubuntu 22.04 and needs a glibc at least as new. Nothing was installed. It printed: $printed"
  fi
  die "weproxa-cli $RELEASE_VERSION does not start on this computer. Nothing was installed. It printed: $printed"
}

# ─── Installing ───────────────────────────────────────────────────────────────

# Whether the folder, or the nearest one above it that exists, can be written.
writable() {
  local probe="$1"

  while [[ ! -e "$probe" ]]; do
    probe="$(dirname "$probe")"
  done
  [[ -w "$probe" ]]
}

# Sets INSTALL_DIR and USE_SUDO.
resolve_install_dir() {
  if [[ -n "${WEPROXA_CLI_INSTALL_DIR:-}" ]]; then
    INSTALL_DIR="$WEPROXA_CLI_INSTALL_DIR"
    [[ "$INSTALL_DIR" == /* ]] || die "WEPROXA_CLI_INSTALL_DIR must be an absolute path: $INSTALL_DIR"
    writable "$INSTALL_DIR" && return
    command -v sudo >/dev/null 2>&1 \
      || die "Cannot write to $INSTALL_DIR, and there is no sudo. Choose a folder you own."
    use_sudo
    return
  fi

  INSTALL_DIR="$SYSTEM_DIR"
  writable "$INSTALL_DIR" && return
  if command -v sudo >/dev/null 2>&1; then
    use_sudo
    return
  fi

  [[ -n "${HOME:-}" ]] || die "Cannot write to $SYSTEM_DIR, and there is no sudo. Set WEPROXA_CLI_INSTALL_DIR."
  INSTALL_DIR="$HOME/.local/bin"
  log "No permission to write to $SYSTEM_DIR and no sudo, so installing into $INSTALL_DIR"
}

# sudo asks for the password on the terminal, not on standard input, which
# under `curl | bash` is the script itself.
use_sudo() {
  USE_SUDO='true'
  log "Administrator privileges are required to install into $INSTALL_DIR"
  sudo -v \
    || die "sudo refused. Install into a folder you own instead: WEPROXA_CLI_INSTALL_DIR=\$HOME/.local/bin"
}

# Copied in under a temporary name, then renamed over the old one, so a run
# using the old binary keeps it, and no one ever starts half a file.
install_program() {
  local program="$1"
  local destination="$INSTALL_DIR/$program"
  local staged="$INSTALL_DIR/.$program.install.$$"

  run_install_command cp "$TEMP_DIR/release/$program" "$staged"
  run_install_command chmod 755 "$staged"
  run_install_command mv -f "$staged" "$destination"
}

install_release() {
  run_install_command mkdir -p "$INSTALL_DIR"

  # On macOS the WePROXA app links /usr/local/bin/weproxa-mcp to its own copy,
  # and keeps it current itself. Both relays work with any run.
  local relay="$INSTALL_DIR/weproxa-mcp"
  if [[ -L "$relay" ]]; then
    log "Kept $relay, the link the WePROXA app manages"
  elif [[ -e "$relay" && ! -f "$relay" ]]; then
    die "$relay is not a file. Nothing was installed."
  else
    install_program weproxa-mcp
  fi
  install_program weproxa-cli
}

report_path() {
  case ":${PATH:-}:" in
    *":$INSTALL_DIR:"*)
      local found
      found="$(command -v weproxa-cli 2>/dev/null || true)"
      if [[ -n "$found" && "$found" != "$INSTALL_DIR/weproxa-cli" ]]; then
        log "Another weproxa-cli comes first on your PATH: $found"
      fi
      ;;
    *)
      log "$INSTALL_DIR is not on your PATH. Add it with: export PATH=\"$INSTALL_DIR:\$PATH\""
      ;;
  esac
}

main() {
  [[ $# -eq 0 ]] || die 'This installer takes no arguments. Settings are environment variables: see the top of the script.'

  require_command curl
  require_command tar
  require_command mktemp

  resolve_platform
  resolve_release

  trap cleanup EXIT
  TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/weproxa-cli-install.XXXXXX")"

  download_release
  check_release_starts
  resolve_install_dir
  install_release

  log "Installed weproxa-cli $RELEASE_VERSION in $INSTALL_DIR"
  report_path
  if [[ "$USE_SUDO" == 'true' ]]; then
    log 'Update it with: sudo weproxa-cli update'
  else
    log 'Update it with: weproxa-cli update'
  fi
}

main "$@"
