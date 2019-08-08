
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




Usage
-----

* API: see [src/cli.js](src/cli.js)
* CLI: `nodejs src/cli.js text-only/rfcXXXX.txt`
* Web with JSONP: try [src/jsonp.html?rfcXXXX](src/jsonp.html?rfcXXXX)
  * You might want to adjust the `jsonpUrl` manually first.
  * If your RFC files aren't at `jsonpUrl` yet, the error message should
    tell you where to put them.
  * The `jsonp.php` could be a directory name, or an actual PHP script
    like [this text file reader][phutility-jsonp].


<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.
* Does anyone know an official, license-friendly source for
  [the XML versions](https://stackoverflow.com/a/49376946)
  of the RFCs? Renderung them might be more reliable than guessing the
  meaning of whitespace. OTOH, XML parsing is a beast of its own.




&nbsp;

  [phutility-jsonp]: https://github.com/mk-pmb/phutility-160816-pmb/blob/master/web/http/jsonp_file_reader.php


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
