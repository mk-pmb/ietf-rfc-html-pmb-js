/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';
var fs = require('fs'), render = require('./render'),
  srcFn = (process.argv[2] || process.env.RFC_TXT || 0);

fs.readFile(srcFn, 'UTF-8', function (err, text) {
  if (err) {
    console.error(err);
    return process.exit(3);
  }
  console.log(render(text));
});
