#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-

function wmirror () {
  export LANG{,UAGE}=en_US.UTF-8  # make error messages search engine-friendly
  local URL="$1"
  case "$URL" in
    x2r:* ) URL="https://xml2rfc.tools.ietf.org/public/rfc/${URL#*:}";;
    * ) echo "E: URL must have a protocol" >&2; return 3;;
  esac

  local CUT="${URL%/}"
  URL="$CUT/" # ensure final slash so wget won't create a file with that name.
  CUT="${CUT#*://}"
  CUT="${CUT//[^\/]/}"
  local W_OPTS=(
    --mirror
    --no-parent
    --no-host-directories
    --cut-dirs="${#CUT}"

    # My attempts to omit all variations of index.html?… seem futile:
    --regex-type posix
    --reject-regex '\?C=[A-Z];O=[AD]$'
    --reject-regex '/index\.htm(l|)$'
    )
  wget "${W_OPTS[@]}" -- "$URL" || return $?
}

wmirror "$@"; exit $?
