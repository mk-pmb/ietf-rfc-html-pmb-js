#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-

function wmirror () {
  export LANG{,UAGE}=en_US.UTF-8  # make error messages search engine-friendly
  local URL="$1"

  local W_OPTS=(
    --mirror
    --no-parent
    --no-host-directories

    # My attempts to omit all variations of index.html?… seem futile:
    --regex-type posix
    --reject-regex '\?C=[A-Z];O=[AD]$'
    --reject-regex '/index\.htm(l|)$'
    )

  case "$URL" in # Is the URL arg just an RFC number?
    *[^0-9]* ) ;; # Nope, contains non-digits
    [0-9]* )
      wget "${W_OPTS[@]}" --output-document="text-only/rfc$URL.txt" \
        -- "https://www.rfc-editor.org/rfc/rfc$URL.txt" || return $?
      return $?;;
  esac

  case "$URL" in
    x2r:* )
      # e.g. x2r:text-only
      # … but seems to no longer be available as of 2023-03-02.
      URL="https://xml2rfc.tools.ietf.org/public/rfc/${URL#*:}"
      ;;
    *://* ) ;;
    * ) echo "E: URL must have a protocol" >&2; return 3;;
  esac

  local CUT="${URL%/}"
  case "$URL" in
    # ensure final slash so wget won't create a file with that name.
    */ ) ;;
    * ) URL="$CUT/";;
  esac
  CUT="${CUT#*://}"
  CUT="${CUT//[^\/]/}"
  W_OPTS+=(
    --cut-dirs="${#CUT}"
    )
  wget "${W_OPTS[@]}" -- "$URL" || return $?
}

wmirror "$@"; exit $?
