#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-

function wmirror () {
  export LANG{,UAGE}=en_US.UTF-8  # make error messages search engine-friendly
  local URL="$1"
  local FAILS=0

  if [ "$#" -ge 2 ]; then
    for URL in "$@"; do
      echo
      echo "<< $URL >>"
      "$FUNCNAME" "$URL" && continue
      (( FAILS += 1 ))
      echo W: "Failure for '$1'. Total failures so far: $FAILS" >&2
    done
    [ "$FAILS" -le 100 ] || FAILS=100
    return "$FAILS"
  fi

  local W_OPTS=()
  mkdir --parents -- text-only || true

  case "$URL" in # Is the URL arg an RFC number range?
    *[^0-9-]* ) ;; # Nope, contains stuff other than digits and potential dash.
    *-*-* ) ;; # Nope, too many dashes.
    *- ) ;; # Nope, dash at end.
    [0-9]*-[0-9]* )
      "$FUNCNAME" $(seq --format='%04.0f' "${URL%-*}" "${URL#*-}")
      return $?;;
    [0-9]* )
      wget "${W_OPTS[@]}" --output-document="text-only/rfc$URL.txt" \
        -- "https://www.rfc-editor.org/rfc/rfc$URL.txt"
      return $?;;
  esac


  W_OPTS+=(
    --mirror
    --no-parent
    --no-host-directories

    # My attempts to omit all variations of index.html?… seem futile:
    --regex-type posix
    --reject-regex '\?C=[A-Z];O=[AD]$'
    --reject-regex '/index\.htm(l|)$'
    )

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
