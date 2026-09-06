#!/usr/bin/env bash
set -euo pipefail

APP_NAME='WePROXA'
BASE_URL="${WEPROXA_BASE_URL:-https://files.weproxa.com}"
MANIFEST_URL="${WEPROXA_MANIFEST_URL:-$BASE_URL/latest.json}"
INSTALL_DIR="${WEPROXA_INSTALL_DIR:-/Applications}"
LAUNCH_AFTER_INSTALL="${WEPROXA_LAUNCH_AFTER_INSTALL:-true}"

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

main() {
  [[ $# -eq 0 ]] || die 'This installer does not accept arguments.'

  [[ "$(uname -s)" == 'Darwin' ]] || die 'This installer only supports macOS.'

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

main "$@"
