
<!--#echo json="package.json" key="name" underline="=" -->
ietf-rfc-html-pmb
=================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Render IETF RFCs as HTML, with indentation interpreted.
<!--/#echo -->



## Stability: experimental

You have been warned. ;-)



API
---

This module UMD-exports one function:

### renderRfcAsHtml(text)

Where `text` should be a string or buffer with the contents of `rfcXXXX.txt`.



Setup
-----

1. Download the RFCs you want to render.
    * To mirror all of them, you can use `util/update_rfcs_via_rsync.sh`.
1. If you want the web demo, try it and adjust webserver paths as needed.



Usage
-----

* API: see [src/cli.js](src/cli.js)
* CLI: `nodejs src/cli.js text-only/rfcXXXX.txt`
* Web: [src/fetch.html](src/fetch.html)


<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.
* Does anyone know an official, license-friendly source for
  [the XML versions](https://stackoverflow.com/a/49376946)
  of the RFCs? Rendering them might be more reliable than guessing the
  meaning of whitespace. OTOH, XML parsing is a beast of its own.




&nbsp;

  [phutility-jsonp]: https://github.com/mk-pmb/phutility-160816-pmb/blob/master/web/http/jsonp_file_reader.php


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
