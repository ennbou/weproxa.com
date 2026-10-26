#!/usr/bin/env bash
# Installs the latest WePROXA release: curl -fsSL https://weproxa.com/i | bash
#
# macOS: copies WePROXA.app out of the DMG into /Applications.
# Linux: installs the .deb (apt) or .rpm (dnf) that the Linux update manifest
#   names for this computer, which is the package the in-app updater would
#   install. ci/deploy-r2-linux.sh publishes that manifest.
# Windows has its own command: winget install weproxa
set -euo pipefail

APP_NAME='WePROXA'
INSTALL_DIR="${WEPROXA_INSTALL_DIR:-/Applications}"
LAUNCH_AFTER_INSTALL="${WEPROXA_LAUNCH_AFTER_INSTALL:-true}"
LINUX_GUIDE_URL='https://weproxa.com/guide/getting-started/installation-linux/'

# The oldest glibc the Linux packages start on: the one on the Ubuntu 22.04
# runners that build them (.github/workflows/build-linux.yml).
MIN_GLIBC='2.35'

BASE_URL=''
MANIFEST_URL=''
TEMP_DIR=''
MANIFEST_PATH=''
MOUNT_DIR=''
DMG_PATH=''
MOUNTED='false'
USE_SUDO='false'

log() {
  printf '[weproxa-install] %s\n' "$*"
}

die() {
  printf '[weproxa-install] %s\n' "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

cleanup() {
  if [[ "$MOUNTED" == 'true' && -n "$MOUNT_DIR" && -d "$MOUNT_DIR" ]]; then
    hdiutil detach "$MOUNT_DIR" -quiet >/dev/null 2>&1 || \
      hdiutil detach "$MOUNT_DIR" -force -quiet >/dev/null 2>&1 || true
  fi

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

# Each platform's releases live in their own bucket, behind their own domain.
use_release_host() {
  BASE_URL="${WEPROXA_BASE_URL:-$1}"
  MANIFEST_URL="${WEPROXA_MANIFEST_URL:-$BASE_URL/latest.json}"
}

# ─── macOS ────────────────────────────────────────────────────────────────────

resolve_native_arch() {
  if [[ "$(sysctl -in hw.optional.arm64 2>/dev/null || true)" == '1' ]]; then
    printf 'arm64\n'
    return
  fi

  case "$(uname -m)" in
    arm64)
      printf 'arm64\n'
      ;;
    x86_64)
      printf 'x86_64\n'
      ;;
    *)
      die "Unsupported macOS architecture: $(uname -m)"
      ;;
  esac
}

version_major_dir() {
  local version="$1"
  printf '%s.x.x\n' "${version%%.*}"
}

resolve_dmg_url() {
  local version="$1"
  local major_dir
  local native_arch
  local primary_url
  local fallback_url

  major_dir="$(version_major_dir "$version")"
  native_arch="$(resolve_native_arch)"

  if [[ "$native_arch" == 'arm64' ]]; then
    primary_url="${BASE_URL}/${major_dir}/${version}/arm64/${APP_NAME}_${version}_aarch64.dmg"
  else
    primary_url="${BASE_URL}/${major_dir}/${version}/x86_64/${APP_NAME}_${version}_x64.dmg"
  fi

  fallback_url="${BASE_URL}/${major_dir}/${version}/${APP_NAME}_${version}_universal.dmg"

  if curl -fsLI "$primary_url" >/dev/null 2>&1; then
    printf '%s\n' "$primary_url"
    return
  fi

  if curl -fsLI "$fallback_url" >/dev/null 2>&1; then
    printf '%s\n' "$fallback_url"
    return
  fi

  die "Could not resolve a downloadable DMG for WePROXA $version"
}

read_manifest_version() {
  local manifest_path="$1"
  local version=''

  version="$(plutil -extract version raw -o - "$manifest_path" 2>/dev/null || true)"

  if [[ -z "$version" || "$version" == 'null' ]]; then
    die "Failed to read the latest version from $MANIFEST_URL"
  fi

  printf '%s\n' "$version"
}

ensure_install_permissions() {
  local permission_probe

  if [[ "$EUID" -eq 0 ]]; then
    return
  fi

  permission_probe="$INSTALL_DIR"

  while [[ ! -e "$permission_probe" ]]; do
    permission_probe="$(dirname "$permission_probe")"
  done

  if [[ -w "$permission_probe" ]]; then
    return
  fi

  USE_SUDO='true'
  log "Administrator privileges are required to install into $INSTALL_DIR"
  sudo -v
}

install_macos() {
  require_command curl
  require_command ditto
  require_command hdiutil
  require_command mktemp
  require_command plutil

  trap cleanup EXIT

  TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/weproxa-install.XXXXXX")"
  MANIFEST_PATH="$TEMP_DIR/latest.json"
  MOUNT_DIR="$TEMP_DIR/mount"

  mkdir -p "$MOUNT_DIR"

  log 'Fetching latest release metadata'
  curl -fsSL "$MANIFEST_URL" -o "$MANIFEST_PATH"

  local version
  local dmg_url
  local app_source
  local destination_app
  local staged_app

  version="$(read_manifest_version "$MANIFEST_PATH")"
  dmg_url="$(resolve_dmg_url "$version")"
  DMG_PATH="$TEMP_DIR/$(basename "$dmg_url")"

  log "Downloading WePROXA $version"
  curl -fL --progress-bar "$dmg_url" -o "$DMG_PATH"

  log 'Mounting DMG'
  hdiutil attach "$DMG_PATH" -nobrowse -quiet -mountpoint "$MOUNT_DIR"
  MOUNTED='true'

  app_source="$(find "$MOUNT_DIR" -maxdepth 2 -type d -name "$APP_NAME.app" -print -quit)"
  [[ -n "$app_source" ]] || die "Could not find $APP_NAME.app in the mounted DMG"

  ensure_install_permissions
  run_install_command mkdir -p "$INSTALL_DIR"

  destination_app="$INSTALL_DIR/$APP_NAME.app"
  staged_app="$INSTALL_DIR/.$APP_NAME.app.$$"

  log "Installing $APP_NAME into $INSTALL_DIR"
  run_install_command rm -rf "$staged_app"
  run_install_command ditto "$app_source" "$staged_app"
  run_install_command rm -rf "$destination_app"
  run_install_command mv "$staged_app" "$destination_app"

  hdiutil detach "$MOUNT_DIR" -quiet >/dev/null 2>&1 || \
    hdiutil detach "$MOUNT_DIR" -force -quiet >/dev/null 2>&1 || true
  MOUNTED='false'

  log "Installed $APP_NAME $version to $destination_app"

  # The script is part of the signed app bundle, not downloaded/executed from
  # a separate source. Older releases do not contain command registration yet.
  local command_installer="$destination_app/Contents/Resources/install-mcp-command.sh"
  if [[ -f "$command_installer" ]]; then
    log 'Installing /usr/local/bin/weproxa-mcp (administrator permission may be required)'
    if [[ "$EUID" -eq 0 || -w /usr/local/bin ]]; then
      /bin/sh "$command_installer" "$destination_app/Contents/MacOS/weproxa-mcp" /usr/local/bin
    else
      sudo /bin/sh "$command_installer" "$destination_app/Contents/MacOS/weproxa-mcp" /usr/local/bin
    fi
    log 'Command installed. Fully quit and reopen your AI client before reconnecting.'
  fi

  if [[ "$LAUNCH_AFTER_INSTALL" == 'true' ]]; then
    log "Launching $APP_NAME"
    open "$destination_app"
  fi
}

# ─── Linux ────────────────────────────────────────────────────────────────────

# The `{arch}` in the manifest's `linux-{arch}-{deb,rpm}` keys.
resolve_linux_arch() {
  case "$(uname -m)" in
    x86_64 | amd64)
      printf 'x86_64\n'
      ;;
    aarch64 | arm64)
      printf 'aarch64\n'
      ;;
    *)
      die "Unsupported Linux architecture: $(uname -m). WePROXA runs on x86_64 and ARM64."
      ;;
  esac
}

# The package manager picks the format, because it is what installs the
# libraries the package depends on.
resolve_linux_package_type() {
  if command -v apt-get >/dev/null 2>&1; then
    printf 'deb\n'
    return
  fi

  if command -v dnf >/dev/null 2>&1; then
    printf 'rpm\n'
    return
  fi

  die "This installer needs apt (Debian, Ubuntu) or dnf (Fedora). For other distributions, see $LINUX_GUIDE_URL"
}

# Checked before anything is downloaded. On an older glibc the package installs
# cleanly, and then the app does not start.
require_glibc() {
  local found
  local found_re='^glibc ([0-9]+)\.([0-9]+)'
  local min_re='^([0-9]+)\.([0-9]+)$'

  found="$(getconf GNU_LIBC_VERSION 2>/dev/null || true)"
  [[ "$found" =~ $found_re ]] \
    || die "WePROXA needs glibc $MIN_GLIBC or newer, and this system does not use glibc."

  local major="${BASH_REMATCH[1]}"
  local minor="${BASH_REMATCH[2]}"

  [[ "$MIN_GLIBC" =~ $min_re ]]
  if (( major < BASH_REMATCH[1] || (major == BASH_REMATCH[1] && minor < BASH_REMATCH[2]) )); then
    die "WePROXA needs glibc $MIN_GLIBC or newer, and this system has $major.$minor. Ubuntu 22.04, Debian 12, and current Fedora releases have it."
  fi
}

# A stock system has nothing that parses JSON from a shell script, so the
# manifest is read with patterns. The values read here (a version, a URL)
# never contain a quote, and a platform entry never contains a brace, so the
# patterns match exactly, with or without line breaks in the file.
manifest_version() {
  local version_re='"version"[[:space:]]*:[[:space:]]*"([^"]+)"'

  [[ "$1" =~ $version_re ]] || return 1
  printf '%s\n' "${BASH_REMATCH[1]}"
}

manifest_platform_url() {
  local entry_re="\"$2\"[[:space:]]*:[[:space:]]*[{]([^}]*)[}]"
  local url_re='"url"[[:space:]]*:[[:space:]]*"([^"]+)"'

  [[ "$1" =~ $entry_re ]] || return 1
  local entry="${BASH_REMATCH[1]}"
  [[ "$entry" =~ $url_re ]] || return 1
  printf '%s\n' "${BASH_REMATCH[1]}"
}

ensure_package_install_permissions() {
  if [[ "$EUID" -eq 0 ]]; then
    return
  fi

  command -v sudo >/dev/null 2>&1 \
    || die 'Installing a system package needs root. Install sudo, or run this installer as root.'

  USE_SUDO='true'
  log 'Administrator privileges are required to install a system package'
  sudo -v
}

# The package managers read from /dev/null, because under `curl | bash` the
# script itself is standard input.
#
# A system's package lists can be too old to name its dependencies' current
# versions, so a failed install refreshes them and tries once more. Refreshing
# first would make every install wait on every configured repository, and fail
# whenever a third-party one is down.
install_deb_package() {
  if run_install_command env DEBIAN_FRONTEND=noninteractive \
    apt-get install -y "$1" </dev/null; then
    return
  fi

  log 'Refreshing the package lists and trying again'
  run_install_command apt-get update </dev/null || true
  run_install_command env DEBIAN_FRONTEND=noninteractive apt-get install -y "$1" </dev/null
}

install_rpm_package() {
  run_install_command dnf install -y "$1" </dev/null
}

launch_linux_app() {
  if [[ "$LAUNCH_AFTER_INSTALL" != 'true' ]]; then
    return
  fi

  # As root, WePROXA would set root's proxy and trust store, not the user's.
  if [[ "$EUID" -eq 0 ]]; then
    log 'Open WePROXA from your app menu as your own user, or run: weproxa'
    return
  fi

  if [[ -z "${DISPLAY:-}" && -z "${WAYLAND_DISPLAY:-}" ]]; then
    log 'No graphical session found. Open WePROXA from your app menu, or run: weproxa'
    return
  fi

  # Linux has no single-instance guard yet, so a second copy would start next
  # to the old version instead of replacing it.
  if pgrep -u "$EUID" -x weproxa >/dev/null 2>&1; then
    log 'WePROXA is already running. Quit it and open it again to use the new version.'
    return
  fi

  log "Launching $APP_NAME"
  setsid weproxa </dev/null >/dev/null 2>&1 &
}

install_linux() {
  require_command curl
  require_command getconf
  require_command mktemp

  local arch
  local package_type
  local manifest
  local version
  local package_url
  local package_path

  arch="$(resolve_linux_arch)"
  package_type="$(resolve_linux_package_type)"
  require_glibc

  trap cleanup EXIT

  TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/weproxa-install.XXXXXX")"
  MANIFEST_PATH="$TEMP_DIR/latest.json"

  log 'Fetching latest release metadata'
  curl -fsSL "$MANIFEST_URL" -o "$MANIFEST_PATH" || die "Could not download $MANIFEST_URL"

  manifest="$(<"$MANIFEST_PATH")"
  version="$(manifest_version "$manifest")" \
    || die "Failed to read the latest version from $MANIFEST_URL"
  package_url="$(manifest_platform_url "$manifest" "linux-$arch-$package_type")" \
    || die "WePROXA $version has no .$package_type package for $arch. See $LINUX_GUIDE_URL"
  package_path="$TEMP_DIR/$(basename "${package_url%%\?*}")"

  log "Downloading WePROXA $version (.$package_type for $arch)"
  curl -fL --progress-bar "$package_url" -o "$package_path"

  # apt reads a local package as its unprivileged _apt user, which cannot enter
  # mktemp's private directory.
  chmod 755 "$TEMP_DIR"
  chmod 644 "$package_path"

  ensure_package_install_permissions

  log "Installing $APP_NAME $version"
  if [[ "$package_type" == 'deb' ]]; then
    install_deb_package "$package_path"
  else
    install_rpm_package "$package_path"
  fi

  log "Installed $APP_NAME $version"
  log 'The weproxa-mcp command for AI clients is at /usr/bin/weproxa-mcp.'

  launch_linux_app
}

main() {
  [[ $# -eq 0 ]] || die 'This installer does not accept arguments.'

  case "$(uname -s)" in
    Darwin)
      use_release_host 'https://files.weproxa.com'
      install_macos
      ;;
    Linux)
      use_release_host 'https://files2.weproxa.com'
      install_linux
      ;;
    MINGW* | MSYS* | CYGWIN*)
      die 'On Windows, install WePROXA from Command Prompt with: winget install weproxa'
      ;;
    *)
      die "This installer supports macOS and Linux, not $(uname -s)."
      ;;
  esac
}

main "$@"
