#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function update_rfcs () {
  export LANG{,UAGE}=en_US.UTF-8  # make error messages search engine-friendly
  local SELFPATH="$(readlink -m "$BASH_SOURCE"/..)"
  cd -- "$SELFPATH"/.. || return $?
  local OWNER="$(stat --format='%u:%g' .)"
  [ -n "$OWNER" ] || return $?

  sync_module text-only || return $?
}


function sync_module () {
  local MODU="$1"
  pushd -- "$MODU" >/dev/null || return $?
  local RS_OPTS=(
    --verbose
    --compress
    --recursive
    --links --safe-links
    --times
    --delete
    --chown="$OWNER"
    --exclude='.git'
    )
  rsync "${RS_OPTS[@]}" "ftp.rfc-editor.org::rfcs-$MODU" . || return $?
  if git status --porcelain | grep -qPe '\S' -m 1; then
    git add . || return $?
    git commit -m "auto-snap $(date +%y%m%d-%H%M)" || return $?
    git update-server-info || return $?
  fi
  [ "$USERNAME" != root ] || chown "$OWNER" -R . || return $?
  popd >/dev/null || return $?
}


update_rfcs "$@"; exit $?
